import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateProductDTO{
    @IsNotEmpty()
    @IsString()
    @ApiProperty({example: "coca"})
    name: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({example: "coca cola"})
    brand: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({example: ['rojo', 'amarillo', 'verde']})
    colors: string[];

    @IsNotEmpty()
    @IsString()
    @ApiProperty({example: "bebida"})
    category: string;


    @IsNotEmpty()
    @IsString()
    @ApiProperty({example: 1500})
    price: string;

    @IsNotEmpty()
    @IsNumber()
    @ApiProperty({example: 10})
    quantity: number;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({example: "envase de 2 litros"})
    info_about_product: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({example: ""})
    extra_info: string;
}