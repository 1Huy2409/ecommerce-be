import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";
import { OrderStatus } from "src/database/entities/order.entity";

export class UpdateOrderDto {
    @IsString()
    @IsOptional()
    @ApiProperty({
        example: OrderStatus.CONFIRMED,
        description: 'Update status of this order'
    })
    status?: OrderStatus
}