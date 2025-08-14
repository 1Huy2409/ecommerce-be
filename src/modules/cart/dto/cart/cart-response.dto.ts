import { Expose, Type } from "class-transformer";
import { CartItemResponseDto } from "../cart-item/cart-item-response.dto";

export class CartResponseDto {
    @Expose()
    id: string;

    @Expose()
    createdAt: Date;

    @Expose()
    updatedAt: Date;

    @Expose()
    @Type(() => CartItemResponseDto)
    items: CartItemResponseDto[];

    @Expose()
    get totalItems(): number {
        return this.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
    }

    @Expose()
    get totalAmount(): number {
        return this.items?.reduce((sum, item) => sum + item.totalPrice, 0) || 0;
    }
}