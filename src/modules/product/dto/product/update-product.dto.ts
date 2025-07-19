import { IsString, IsNotEmpty, IsOptional, IsDecimal, IsInt, IsArray, ValidateNested, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateProductVariantDto } from '../variant/create-product-variant.dto';
import { ImageUploadRequestDto } from '../image/image-upload-request.dto';
import { UpdateProductVariantDto } from '../variant/update-product-variant.dto';
export class UpdateProductDto {
    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsNotEmpty()
    basePrice?: number;

    @IsOptional()
    @IsString()
    gender?: string;

    @IsOptional()
    @IsNotEmpty()
    @IsUUID()
    brandId?: string;

    @IsOptional()
    @IsNotEmpty()
    @IsUUID()
    categoryId?: string;

    @IsOptional()
    @IsArray()
    @IsUUID(undefined, { each: true })
    productImageIds?: string[]

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => UpdateProductVariantDto)
    variants?: UpdateProductVariantDto[];
}