import { Expose, Type } from "class-transformer"
import { CartItem } from "src/database/entities/cart-item.entity"
import { OrderItem } from "src/database/entities/order-item.entity"
import { ImageResponseDto } from "src/modules/image/dto/image-response.dto"
export class VariantResponseDto {
    @Expose()
    id: string
    @Expose()
    size: number
    @Expose()
    sku: string
    @Expose()
    additionalPrice: number
    @Expose()
    stockQuantity: number
    @Expose()
    cartItems: CartItem[]
    @Expose()
    orderItems: OrderItem[]
    @Expose()
    @Type(() => ImageResponseDto)
    images: ImageResponseDto[]
}