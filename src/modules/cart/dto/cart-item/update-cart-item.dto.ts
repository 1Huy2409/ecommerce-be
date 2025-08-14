import { Optional } from "@nestjs/common";
import { IsNotEmpty, IsNumber } from "class-validator";

export class UpdateCartItemDto {
    @IsNotEmpty()
    @IsNumber()
    @Optional()
    quantity?: number
}