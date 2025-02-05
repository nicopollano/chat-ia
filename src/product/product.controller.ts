import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { Public } from "src/common/decorators/public.decorator";
import { CreateProductDTO } from "./dtos/product-create.dto";
import { ProductService } from "./product.service";

@Controller()
@ApiTags("Product")
export class ProductController{
    constructor(
        private productService: ProductService,
    ){}

    @Post()
    @Public()
    async create(@Body() createProduct: CreateProductDTO){
        return await  this.productService.createProduct(createProduct);
    }

    @Public()
    @Get("all")
    async findAll(){
        return await this.productService.findAll();
    }

    @Public()
    @Get("bycolor/:colors")
    async findAllByColor(@Param("colors") colors: string){
        const color_array = colors.split(",");
        return await this.productService.findAllByColor(color_array);
    }

    @Public()
    @Get("search/:id")
    async findOne(@Param("id") id: number){
        return await this.productService.findOne(id);
    }
}