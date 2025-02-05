import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CraeteUserDTO{
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ example: "nicolas" })
    username: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ example: "pass" })
    password: string;
}