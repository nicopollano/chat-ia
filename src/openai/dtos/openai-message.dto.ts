import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { Applications } from "src/common/enums/applications.enum";

export class OpenAiMessageDTO{
    @IsNumber()
    @IsNotEmpty()
    @ApiProperty({ example: 1 })
    userid: number;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ example: "Tenes mortadela?" })
    message: string;

    @IsNumber()
    @IsNotEmpty()
    @ApiProperty({ example: 352333 })
    clientNumber: number;

    //@IsEnum({})
    @IsNotEmpty()
    @ApiProperty({ enum: Applications, example: Applications.whastapp})
    app: Applications;
}