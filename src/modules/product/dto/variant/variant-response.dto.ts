import { CartItem } from "src/database/entities/cart-item.entity"
import { Image } from "src/database/entities/image.entity"
import { OrderItem } from "src/database/entities/order-item.entity"
import { ProductVariant } from "src/database/entities/product-variant.entity"
import { Product } from "src/database/entities/product.entity"
export class VariantResponseDto {
    id: string
    size: number
    sku: string
    additionalPrice: number
    stockQuantity: number
    cartItems: CartItem[]
    orderItems: OrderItem[]
    images: Image[]

    constructor(partial: Partial<ProductVariant>) {
        Object.assign(this, partial)
    }
}