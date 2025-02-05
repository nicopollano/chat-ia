import { Body, Controller, forwardRef, Get, Inject, Post } from '@nestjs/common';
import { CraeteUserDTO } from './dtos/create-user.dto';
import { UserService } from './user.service';
import { ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { Public } from 'src/common/decorators/public.decorator';
import { SingInDTO } from 'src/auth/dtos/sing-in.dto';
import { AuthService } from 'src/auth/auth.service';
import { Role, Roles } from 'src/common/decorators/role.decorator';

@Controller('user')
@ApiBearerAuth()

export class UserController {
    constructor(
        private userService: UserService,
        @Inject(forwardRef(()=> AuthService)) private authService: AuthService,
    ){}

    @ApiBody({ type: CraeteUserDTO })
    @Post("create")
    async create(@Body() user: CraeteUserDTO){
        return await this.userService.create(user);
    }

    @Public()
    @ApiBody({ type: SingInDTO})
    @Post("login")
    async login(@Body() user: SingInDTO){
        return await this.authService.login(user);
    }

    @Get()
    @Roles(Role.admin)
    async coco(){
        return "hola";
    }
}
