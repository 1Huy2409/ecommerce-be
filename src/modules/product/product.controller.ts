import { Body, ClassSerializerInterceptor, Controller, Get, Param, ParseUUIDPipe, Post, Put, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/product/create-product.dto';
import { ProductResponseDto } from './dto/product/product-response.dto';
import { UpdateProductDto } from './dto/product/update-product.dto';
import { instanceToPlain } from 'class-transformer';
import { PermissionGuard } from '../auth/guards/permission.guard';
import { RequirePermission } from 'src/core/decorators/permission.decorator';
@Controller('products')
@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(PermissionGuard)
export class ProductController {
    constructor(
        private productService: ProductService
    ) { }

    @RequirePermission('product:read')
    @Get('')
    async findAllProduct(): Promise<ProductResponseDto[]> {
        const products = await this.productService.findAllProduct()
        return instanceToPlain(products) as ProductResponseDto[]
    }

    @RequirePermission('product:read')
    @Get('search')
    async searchProduct(@Query('name') name: string): Promise<ProductResponseDto[]> {
        const products = await this.productService.searchProduct(name)
        return instanceToPlain(products) as ProductResponseDto[]
    }

    @RequirePermission('product:read')
    @Get(':id')
    async findProductById(@Param('id', ParseUUIDPipe) id: string): Promise<ProductResponseDto> {
        const product = await this.productService.findProductById(id)
        return instanceToPlain(product) as ProductResponseDto
    }

    @Get('category/:categoryId')
    async findProductsByCategory(@Param('categoryId', ParseUUIDPipe) categoryId: string): Promise<ProductResponseDto[]> {
        const products = await this.productService.findProductsByCategory(categoryId)
        return instanceToPlain(products) as ProductResponseDto[]
    }

    @Get('brand/:brandId')
    async findProductsByBrand(@Param('brandId', ParseUUIDPipe) brandId: string): Promise<ProductResponseDto[]> {
        const products = await this.productService.findProductsByBrand(brandId)
        return instanceToPlain(products) as ProductResponseDto[]
    }

    @RequirePermission('product:create')
    @Post('')
    async createProduct(@Body() productData: CreateProductDto): Promise<ProductResponseDto> {
        const product = await this.productService.createProductWithVariant(productData)
        return instanceToPlain(product) as ProductResponseDto
    }

    @RequirePermission('product:update')
    @Put(':id')
    async updateProduct(@Body() productData: UpdateProductDto, @Param('id', ParseUUIDPipe) id: string): Promise<ProductResponseDto> {
        const updateProduct = await this.productService.updateProduct(productData, id)
        return instanceToPlain(updateProduct) as ProductResponseDto
    }

}   
