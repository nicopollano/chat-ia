import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { In, Like, Repository } from "typeorm";
import { Product } from "./entities/product.entity";
import { CreateProductDTO } from "./dtos/product-create.dto";
import { OpenAiCallbacks } from "src/openai/openai.callbacks";

@Injectable()
export class ProductService{
    constructor(
        @InjectRepository(Product) private productRepository : Repository<Product>,
    ){}

    async createProduct(createProduct: CreateProductDTO){
        const { brand, colors, extra_info, info_about_product, name, price, quantity, category } = createProduct;
        const product = await this.productRepository.create({
            brand,
            colors,
            extra_info,
            info_about_product,
            name,
            price,
            quantity,
            category
        });
        if(!product) throw new BadRequestException("Cannot create new product");

        await this.productRepository.save(product);

        return product;
    }

    async findOne(id: number){
        const product = await this.productRepository.findOneBy({ id });
        if(!product) return null;
        return product;
    }

    async findAll(){
        const products = await this.productRepository.find();
        if(!products[0]) return null;
        return products;
    }

    async findAllByColor(colors: string[]){
        const products = await this.productRepository.find({ where: { colors: In(Like(colors)) }})
        if(!products[0]) return null;

        return products;
    }

    async findAllByName(name: string){
        name = name.toLowerCase();
        const products = await this.productRepository.find({ where: { name: Like(name) }})
        if(!products[0]) return null;

        return products;
    }

    async findAllByBrand(brand: string){
        brand = brand.toLowerCase();
        const products = await this.productRepository.find({ where: { brand: Like(brand) }})
        if(!products[0]) return null;

        return products;
    }

    async findByName(name: string){
        name = name.toLowerCase();
        const product = await this.productRepository.findOne({ where: [ { name: Like(name) }, { brand: Like(name) } ] })
        if(!product) return null;

        return product;
    }
}