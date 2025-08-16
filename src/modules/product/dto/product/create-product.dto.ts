import { IsString, IsNotEmpty, IsOptional, IsDecimal, IsInt, IsArray, ValidateNested, IsUUID, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateProductVariantDto } from '../variant/create-product-variant.dto';
import { ApiProperty } from '@nestjs/swagger';
export class CreateProductDto {
    @IsNotEmpty()
    @IsString()
    @ApiProperty({ example: 'Nike Jordan 100', description: 'Enter product name here' })
    name: string;

    @IsOptional()
    @IsString()
    @ApiProperty({ example: 'Product description ...', description: 'Enter product description here' })
    description?: string;

    @IsNotEmpty()
    @IsNumber()
    @ApiProperty({ example: 300, description: 'Enter product base price here' })
    basePrice: number;

    @IsOptional()
    @IsString()
    @ApiProperty({ example: 'male', description: 'Enter product gender here' })
    gender?: string;

    @IsNotEmpty()
    @IsUUID()
    @ApiProperty({ example: 'brand-id', description: 'Enter brand ID here' })
    brandId: string;

    @IsNotEmpty()
    @IsUUID()
    @ApiProperty({ example: 'category-id', description: 'Enter category ID here' })
    categoryId: string;

    @IsOptional()
    @IsArray()
    @IsUUID(undefined, { each: true })
    @ApiProperty({ example: 'product-image-ID', description: 'Enter product image ID here' })
    productImageIds?: string[]

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateProductVariantDto)
    @ApiProperty({
        example: [
            {
                "color": "blue",
                "size": 41,
                "sku": "AMBLUE",
                "additionalPrice": 50.00,
                "stockQuantity": 30,
                "productVariantImageIds": ["product-variant-iamage-id"]
            },
            {
                "color": "black",
                "size": 42,
                "sku": "AMBLACK",
                "additionalPrice": 52.00,
                "stockQuantity": 20,
                "productVariantImageIds": ["product-variant-iamage-id"]
            }
        ], description: 'Enter product name here'
    })
    variants?: CreateProductVariantDto[];
}