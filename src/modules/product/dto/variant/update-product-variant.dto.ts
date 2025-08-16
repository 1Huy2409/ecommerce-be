import { IsArray, IsBoolean, IsDecimal, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, ValidateNested } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
export class UpdateProductVariantDto {
    @IsUUID()
    @IsOptional()
    id?: string

    @IsOptional()
    @IsNotEmpty()
    @ApiProperty({ example: 'red', description: 'Enter color here' })
    color?: string

    @IsOptional()
    @IsNotEmpty()
    @IsNumber()
    @ApiProperty({ example: 40, description: 'Enter size here' })
    size?: number

    @IsOptional()
    @IsNotEmpty()
    @ApiProperty({ example: 'SKUCODE', description: 'Enter skucode here' })
    sku?: string

    @IsOptional()
    @IsNotEmpty()
    @IsNumber({ maxDecimalPlaces: 2 })
    @ApiProperty({ example: 30, description: 'Enter additional price here' })
    additionalPrice?: number

    @IsOptional()
    @IsInt()
    @ApiProperty({ example: 10, description: 'Enter stock quantity here' })
    stockQuantity?: number

    @IsOptional()
    @IsBoolean()
    @ApiProperty({ example: false, description: 'Enter product variant image here' })
    isLocked: boolean

    @IsOptional()
    @IsArray()
    @IsUUID(undefined, { each: true })
    @ApiProperty({ example: 'product-variant-image-id', description: 'Enter variant image ID here' })
    productVariantImageIds?: string[]
}