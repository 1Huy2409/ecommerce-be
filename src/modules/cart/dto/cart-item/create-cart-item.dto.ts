import { IsNotEmpty, IsNumber, IsUUID } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
export class CreateCartItemDto {
    @IsUUID()
    @IsNotEmpty()
    @ApiProperty({ example: 'variant-id', description: 'Enter your variant ID here' })
    variantId: string

    @IsNotEmpty()
    @IsNumber()
    @ApiProperty({ example: '10', description: 'Enter your quantity here' })
    quantity: number
}