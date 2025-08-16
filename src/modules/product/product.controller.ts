import { Body, ClassSerializerInterceptor, Controller, Delete, Get, Param, ParseUUIDPipe, Post, Put, Query, Req, SerializeOptions, UseGuards, UseInterceptors } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/product/create-product.dto';
import { ProductResponseDto } from './dto/product/product-response.dto';
import { UpdateProductDto } from './dto/product/update-product.dto';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { PermissionGuard } from '../auth/guards/permission.guard';
import { RequirePermission } from 'src/core/decorators/permission.decorator';
import e, { Request } from 'express';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
@ApiTags('Product')
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
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get all products' })
    @ApiResponse({ status: 200, description: 'Get all products successfully!' })
    async findAllProduct(@Req() req: Request, @Query('page') page: number, @Query('limit') limit: number): Promise<ProductResponseDto[]> {
        const products = await this.productService.findAllProduct(req, page, limit)
        return plainToInstance(ProductResponseDto, products)
    }

    // @RequirePermission('product:read')
    @Get('search')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Search product' })
    @ApiResponse({ status: 200, description: 'Get products by searching successfully!' })
    async searchProduct(@Query('name') name: string, @Req() req: Request): Promise<ProductResponseDto[]> {
        const products = await this.productService.searchProduct(name, req)
        return plainToInstance(ProductResponseDto, products)
    }

    // @RequirePermission('product:read')
    @Get(':id')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get product by ID' })
    @ApiResponse({ status: 200, description: 'Get product by ID successfully!' })
    async findProductById(@Param('id', ParseUUIDPipe) id: string, @Req() req: Request): Promise<ProductResponseDto> {
        const product = await this.productService.findProductById(id, req)
        return plainToInstance(ProductResponseDto, product)
    }

    @Get('category/:categoryId')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get products by category ID' })
    @ApiResponse({ status: 200, description: 'Get products by category ID successfully!' })
    async findProductsByCategory(@Param('categoryId', ParseUUIDPipe) categoryId: string, @Req() req: Request): Promise<ProductResponseDto[]> {
        const products = await this.productService.findProductsByCategory(categoryId, req)
        return plainToInstance(ProductResponseDto, products)
    }

    @Get('brand/:brandId')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get products by brand ID' })
    @ApiResponse({ status: 200, description: 'Get products by brand ID successfully!' })
    async findProductsByBrand(@Param('brandId', ParseUUIDPipe) brandId: string, @Req() req: Request): Promise<ProductResponseDto[]> {
        const products = await this.productService.findProductsByBrand(brandId, req)
        return plainToInstance(ProductResponseDto, products)
    }

    @RequirePermission('product:create')
    @Post('')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Create new product' })
    @ApiResponse({ status: 201, description: 'Create new product successfully!' })
    async createProduct(@Body() productData: CreateProductDto): Promise<ProductResponseDto> {
        const product = await this.productService.createProductWithVariant(productData)
        return plainToInstance(ProductResponseDto, product)
    }

    @RequirePermission('product:update')
    @Put(':id')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Update product by ID' })
    @ApiResponse({ status: 200, description: 'Update product by ID successfully!' })
    async updateProduct(@Body() productData: UpdateProductDto, @Param('id', ParseUUIDPipe) id: string): Promise<ProductResponseDto> {
        const updateProduct = await this.productService.updateProduct(productData, id)
        return plainToInstance(ProductResponseDto, updateProduct)
    }

    @RequirePermission('product:delete')
    @Delete(':id')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Delete product by ID' })
    @ApiResponse({ status: 200, description: 'Delete product by ID successfully!' })
    async deleteProduct(@Param('id', ParseUUIDPipe) id: string): Promise<{ message: string }> {
        const { message } = await this.productService.deleteProduct(id)
        return {
            message
        }
    }
}   
