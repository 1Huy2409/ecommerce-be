import { IsString, IsNotEmpty, IsOptional, IsDecimal, IsInt, IsArray, ValidateNested, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateProductVariantDto } from '../variant/create-product-variant.dto';
import { ImageUploadRequestDto } from '../image/image-upload-request.dto';
export class CreateProductDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsNotEmpty()
    // @IsDecimal({ decimal_digits: '2' })
    basePrice: number;

    @IsOptional()
    @IsString()
    gender?: string;

    @IsNotEmpty()
    @IsUUID()
    brandId: string;

    @IsNotEmpty()
    @IsUUID()
    categoryId: string;

    @IsOptional()
    @IsArray()
    @IsUUID(undefined, { each: true })
    productImageIds: string[]

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateProductVariantDto)
    variants?: CreateProductVariantDto[];
}