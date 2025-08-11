import { IsNotEmpty, IsNumber } from "class-validator";


export class CreateCartItemDto {
    @IsNotEmpty()
    @IsNumber()
    quantity: number

}