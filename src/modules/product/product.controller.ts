import { Body, Controller, Param, ParseUUIDPipe, Post, Put } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/product/create-product.dto';
import { ProductResponseDto } from './dto/product/product-response.dto';
import { UpdateProductDto } from './dto/product/update-product.dto';
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
    @Put(':id')
    async updateProduct(@Body() productData: UpdateProductDto, @Param('id', ParseUUIDPipe) id: string) {
        const updateProduct = await this.productService.updateProduct(productData, id)
        return updateProduct
    }

    // get product by id

    // get all products

}   
