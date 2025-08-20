import { Expose, Type } from "class-transformer";
import { OrderItemResponseDto } from "../order-item-dto/order-item-response.dto";


export class OrderResponseDto {
    @Expose()
    id: string

    @Expose()
    orderNumber: string

    @Expose()
    orderDate: Date

    @Expose()
    totalAmount: number

    @Expose()
    finalAmount: number

    @Expose()
    status: string

    @Expose()
    paymentMethod: string

    @Expose()
    shippingAddress: object

    @Expose()
    customerNote: string

    @Expose()
    updatedAt: Date

    @Expose()
    @Type(() => OrderItemResponseDto)
    items: OrderItemResponseDto[]
}