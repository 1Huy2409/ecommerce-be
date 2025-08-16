import { Optional } from "@nestjs/common";
import { IsNotEmpty, IsNumber } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class UpdateCartItemDto {
    @IsNotEmpty()
    @IsNumber()
    @Optional()
    @ApiProperty({ example: '10', description: 'Enter your quantity here' })
    quantity?: number
}