import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from 'src/user/user.module';

@Module({
  imports:[PassportModule,
    JwtModule.register({
      secret: 'holis'
    }),
    forwardRef(()=> UserModule),
  ],
  providers: [AuthService],
  exports: [AuthService]
})
export class AuthModule {}
