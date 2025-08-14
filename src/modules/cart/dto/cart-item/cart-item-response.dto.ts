import { Expose, Type } from "class-transformer";

export class CartItemResponseDto {
    @Expose()
    id: string;

    @Expose()
    quantity: number;

    @Expose()
    priceAtAddition: number;

    @Expose()
    get productInfo(): object | undefined {
        if ((this as any).productVariant && (this as any).productVariant.product) {
            return {
                productName: (this as any).productVariant.product.name,
                basePrice: (this as any).productVariant.product.basePrice,
                additionalPrice: (this as any).productVariant.additionalPrice,
                color: (this as any).productVariant.color,
                size: (this as any).productVariant.size,
            }
        }
        return undefined
    }

    @Expose()
    get totalPrice(): number {
        return Number(this.priceAtAddition) * this.quantity;
    }
}