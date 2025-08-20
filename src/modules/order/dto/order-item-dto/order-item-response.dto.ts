import { Expose } from "class-transformer";

export class OrderItemResponseDto {
    @Expose()
    id: string

    @Expose()
    quantity: number

    @Expose()
    priceAtPurchase: number;

    @Expose()
    totalItemPrice: number;

    @Expose()
    get productInfo(): object | undefined {
        if ((this as any).productVariant) {
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
}