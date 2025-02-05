import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import { Observable } from "rxjs";

@Injectable()
export class PublicGuard implements CanActivate{
    constructor(
        private reflector : Reflector,
        private jwtService : JwtService,
    ){}

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const isPublic = this.reflector.get("isPublic", context.getHandler());

        if(isPublic) return true;
        const token = context.switchToHttp().getRequest().headers.authorization?.split(' ')[1];
        if(!token) throw new UnauthorizedException("Token invalid");

        try{
            const verifiedToken = this.jwtService.verify(token);

            if(verifiedToken) return true;
        }
        catch{
            throw new UnauthorizedException("Token invalid");
        }
        return false;
    }
}