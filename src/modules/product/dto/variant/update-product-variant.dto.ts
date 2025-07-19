import { IsArray, IsDecimal, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, ValidateNested } from "class-validator";

export class UpdateProductVariantDto {
    @IsUUID()
    @IsOptional()
    id?: string

    @IsOptional()
    @IsNotEmpty()
    @IsNumber()
    size?: number

    @IsOptional()
    @IsNotEmpty()
    sku?: string

    @IsOptional()
    @IsNotEmpty()
    @IsNumber({ maxDecimalPlaces: 2 })
    additionalPrice?: number

    @IsOptional()
    @IsInt()
    stockQuantity?: number

    @IsOptional()
    @IsArray()
    @IsUUID(undefined, { each: true })
    productVariantImageIds?: string[]
}