import { IsArray, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, ValidateNested } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
export class CreateProductVariantDto {
    @IsNotEmpty()
    @IsString()
    @ApiProperty({ example: 'red', description: 'Enter color here' })
    color: string

    @IsNotEmpty()
    @IsNumber()
    @ApiProperty({ example: 40, description: 'Enter size here' })
    size: number

    @IsNotEmpty()
    @ApiProperty({ example: 'SKUCODE', description: 'Enter skucode here' })
    sku: string

    @IsNotEmpty()
    @IsNumber({ maxDecimalPlaces: 2 })
    @ApiProperty({ example: 30, description: 'Enter additional price here' })
    additionalPrice: number

    @IsInt()
    @ApiProperty({ example: 10, description: 'Enter stock quantity here' })
    stockQuantity: number

    @IsOptional()
    @IsArray()
    @IsUUID(undefined, { each: true })
    @ApiProperty({ example: 'product-variant-image-id', description: 'Enter variant image ID here' })
    productVariantImageIds?: string[]
}