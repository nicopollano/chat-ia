import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import { Observable } from "rxjs";

@Injectable()
export class RoleGuard implements CanActivate{
    constructor(
        private reflector: Reflector,
        private jwtService: JwtService

    ){}

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const requiredRoles = this.reflector.get<string[]>("roles", context.getHandler());

        if(!requiredRoles) return true;

        const token = context.switchToHttp().getRequest().headers.authorization.split(' ')[1];
        const role = this.jwtService.decode(token).role;

        try{
            if(requiredRoles.includes(role)) return true;
            throw new UnauthorizedException("Role not allowed");
        }
        catch{
            throw new UnauthorizedException("Role not allowed");
        }
        return false;
    }
}