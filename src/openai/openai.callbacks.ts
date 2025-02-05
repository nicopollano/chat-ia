import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { ProductService } from "src/product/product.service";

@Injectable()
export class OpenAiCallbacks{
    constructor(
        @Inject(forwardRef(()=> ProductService)) private productService : ProductService,
    ){}

    async getAllProducts(){
        const products = await this.productService.findAll();
        if(!products) return "No existen productos";
        const product_name = [];
        products.forEach((product) => {
            if(!product_name.includes(product.name))
                product_name.push(product.name);
        });
        return `AllProducts {${product_name.toString()}}`;
    }

    async checkBrand(name: string){
        name = this.getName(name);
        const product = await this.productService.findAllByBrand(name);
        if(!product) return "checkBrand {No existe}";
        return "checkBrand {Si existe}"
    }

    async checkInventory(name: string){
        name = this.getName(name);
        const product = await this.productService.findAllByName(name);
        if(!product) return "checkInventory {No existe}";
        return "checkInventory {Si existe}"
    }

    async getPrice(productName){
        productName = this.getName(productName);
        const product = await this.productService.findByName(productName);
        if(!product) return "No existe el producto";
        return `getPrice {${product.price} por unidad}`;
    }

    async checkQuantity(productName: string){
        productName = this.getName(productName);
        const product = await this.productService.findByName(productName);
        if(!product) return "checkQuantity {No existe el producto}";
        return `checkQuantity {Cantidad disponible ${product.quantity}}`;
    }

    getName(json: string){
        const name = JSON.parse(`${json}`).product
        console.log("name: ", name)
        return name;
    }
}   