import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { OpenAiModule } from './openai/openai.module';
import { ProductService } from './product/product.service';
import { ProductModule } from './product/product.module';
import { AppController } from './app.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env"
    }),
    
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory : (configService : ConfigService) => ({
        type: 'postgres',
        port: configService.get<number>("PORT_DB"),
        database: configService.get<string>("DATABASE_DB"),
        username: configService.get<string>("USERNAME_DB"),
        password: configService.get<string>("PASSWORD_DB"),
        host: configService.get<string>("HOST_DB"),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true,
      }),
      inject: [ConfigService]
    }),
    AuthModule,
    UserModule, 
    OpenAiModule,
    ProductModule,
  ],  
  controllers: [AppController]
})

export class AppModule {}
