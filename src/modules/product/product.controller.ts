import { Body, Controller, Post } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/product/create-product.dto';
import { ProductResponseDto } from './dto/product/product-response.dto';
@Controller('products')
export class ProductController {
    constructor(
        private productService: ProductService
    ) { }

    @Post('')
    async createProduct(@Body() productData: CreateProductDto) {
        const product = await this.productService.createProductWithVariant(productData)
        return product
    }
}   
