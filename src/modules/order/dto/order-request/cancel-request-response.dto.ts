import { Expose, Type } from "class-transformer";
import { CancelRequestStatus } from "src/database/entities/order-cancel-request.entity";
import { Order, OrderStatus } from "src/database/entities/order.entity";
import { User } from "src/database/entities/user.entity";

class OrderSummaryDto {
    @Expose()
    id: string
    @Expose()
    orderNumber: string
    @Expose()
    status: OrderStatus
}

class UserSummaryDto {
    @Expose()
    fullname: string
}

export class CancelRequestResponseDto {
    @Expose()
    id: string

    @Expose()
    reason: string

    @Expose()
    adminNote: string

    @Expose()
    status: CancelRequestStatus

    @Expose()
    @Type(() => OrderSummaryDto)
    order: OrderSummaryDto

    @Expose()
    @Type(() => UserSummaryDto)
    requestedBy: UserSummaryDto

    @Expose()
    processedAt: Date
}