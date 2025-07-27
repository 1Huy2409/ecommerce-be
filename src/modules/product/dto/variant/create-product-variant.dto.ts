import { IsArray, IsDecimal, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, ValidateNested } from "class-validator";
import { ImageUploadRequestDto } from "../image/image-upload-request.dto";
import { Type } from "class-transformer";

export class CreateProductVariantDto {
    @IsNotEmpty()
    @IsNumber()
    size: number

    @IsNotEmpty()
    sku: string

    @IsNotEmpty()
    @IsNumber({ maxDecimalPlaces: 2 })
    additionalPrice: number

    @IsInt()
    stockQuantity: number

    @IsOptional()
    @IsArray()
    @IsUUID(undefined, { each: true })
    productVariantImageIds?: string[]
}