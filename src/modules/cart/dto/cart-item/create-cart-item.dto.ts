import { IsNotEmpty, IsNumber, IsUUID } from "class-validator";
export class CreateCartItemDto {
    @IsUUID()
    @IsNotEmpty()
    variantId: string

    @IsNotEmpty()
    @IsNumber()
    quantity: number
}