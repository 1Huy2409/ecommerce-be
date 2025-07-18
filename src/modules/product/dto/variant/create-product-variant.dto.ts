import { IsArray, IsDecimal, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, ValidateNested } from "class-validator";
import { ImageUploadRequestDto } from "../image/image-upload-request.dto";
import { Type } from "class-transformer";

export class CreateProductVariantDto {
    @IsNotEmpty()
    @IsNumber()
    size: number

    @IsOptional()
    @IsNotEmpty()
    sku: string

    @IsDecimal({ decimal_digits: '2' })
    additionalPrice: number

    @IsInt()
    stockQuantity: number

    @IsOptional()
    @IsArray()
    @IsUUID(undefined, { each: true })
    productVariantImageIds: string[]
}