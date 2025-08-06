import { Body, ClassSerializerInterceptor, Controller, Delete, Get, Param, ParseUUIDPipe, Post, Put, Query, Req, SerializeOptions, UseGuards, UseInterceptors } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/product/create-product.dto';
import { ProductResponseDto } from './dto/product/product-response.dto';
import { UpdateProductDto } from './dto/product/update-product.dto';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { PermissionGuard } from '../auth/guards/permission.guard';
import { RequirePermission } from 'src/core/decorators/permission.decorator';
import e, { Request } from 'express';
@Controller('products')
@UseInterceptors(ClassSerializerInterceptor)
@SerializeOptions({
    excludeExtraneousValues: true
})
@UseGuards(PermissionGuard)
export class ProductController {
    constructor(
        private productService: ProductService
    ) { }

    @Get('')
    async findAllProduct(@Req() req: Request, @Query('page') page: number, @Query('limit') limit: number): Promise<ProductResponseDto[]> {
        const products = await this.productService.findAllProduct(req, page, limit)
        return plainToInstance(ProductResponseDto, products)
    }

    // @RequirePermission('product:read')
    @Get('search')
    async searchProduct(@Query('name') name: string, @Req() req: Request): Promise<ProductResponseDto[]> {
        const products = await this.productService.searchProduct(name, req)
        return plainToInstance(ProductResponseDto, products)
    }

    // @RequirePermission('product:read')
    @Get(':id')
    async findProductById(@Param('id', ParseUUIDPipe) id: string, @Req() req: Request): Promise<ProductResponseDto> {
        const product = await this.productService.findProductById(id, req)
        return plainToInstance(ProductResponseDto, product)
    }

    @Get('category/:categoryId')
    async findProductsByCategory(@Param('categoryId', ParseUUIDPipe) categoryId: string, @Req() req: Request): Promise<ProductResponseDto[]> {
        const products = await this.productService.findProductsByCategory(categoryId, req)
        return plainToInstance(ProductResponseDto, products)
    }

    @Get('brand/:brandId')
    async findProductsByBrand(@Param('brandId', ParseUUIDPipe) brandId: string, @Req() req: Request): Promise<ProductResponseDto[]> {
        const products = await this.productService.findProductsByBrand(brandId, req)
        return plainToInstance(ProductResponseDto, products)
    }

    @RequirePermission('product:create')
    @Post('')
    async createProduct(@Body() productData: CreateProductDto): Promise<ProductResponseDto> {
        const product = await this.productService.createProductWithVariant(productData)
        return plainToInstance(ProductResponseDto, product)
    }

    @RequirePermission('product:update')
    @Put(':id')
    async updateProduct(@Body() productData: UpdateProductDto, @Param('id', ParseUUIDPipe) id: string): Promise<ProductResponseDto> {
        const updateProduct = await this.productService.updateProduct(productData, id)
        return plainToInstance(ProductResponseDto, updateProduct)
    }

    @RequirePermission('product:delete')
    @Delete(':id')
    async deleteProduct(@Param('id', ParseUUIDPipe) id: string): Promise<{ message: string }> {
        const { message } = await this.productService.deleteProduct(id)
        return {
            message
        }
    }
}   
