import { Optional } from "@nestjs/common";
import { IsBoolean, IsNotEmpty, IsNumber } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class UpdateCartItemDto {
    @IsNotEmpty()
    @IsNumber()
    @Optional()
    @ApiProperty({ example: '10', description: 'Enter your quantity here' })
    quantity?: number

    @Optional()
    @IsBoolean()
    @ApiProperty({ example: true, description: 'Enter cartitem status here' })
    isChecked?: boolean
}