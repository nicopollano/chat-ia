import { forwardRef, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SingInDTO } from './dtos/sing-in.dto';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        @Inject(forwardRef(()=> UserService)) private userService: UserService
    ){}

    async login(user: SingInDTO){
        const { password, username} = user;

        const usernameToLower = username;
        const passwordToLower = password;

        const userFind = await this.userService.checkUser(usernameToLower, passwordToLower);
        
        if(!userFind) throw new UnauthorizedException("User or Password error");

        const payload = {
            sub: userFind.id,
            role: userFind.role
        }

        const access_token = await this.jwtService.signAsync(payload, { expiresIn: '30m' });
        const refresh_token = await this.jwtService.signAsync(payload, { expiresIn: '1h' })

        return {
            access_token,
            refresh_token,
            userid: userFind.id,
            username: userFind.username,
            role: userFind.role
        }
    }
}
