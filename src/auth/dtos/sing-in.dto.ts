import { IsNotEmpty, IsString } from "@nestjs/class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class SingInDTO{
    @IsNotEmpty()
    @IsString()
    @ApiProperty({ example: "nicolas" })
    username: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({ example: "pass" })
    password: string;
}