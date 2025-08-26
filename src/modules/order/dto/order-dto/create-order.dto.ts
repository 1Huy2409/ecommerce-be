import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsObject, IsOptional, IsString } from "class-validator";
import { PaymentMethod } from "src/database/entities/order.entity";

export class CreateOrderDto {
    @IsNotEmpty()
    @IsEnum(PaymentMethod)
    @ApiProperty({
        enum: PaymentMethod,
        example: PaymentMethod.STRIPE,
        description: 'Payment method for the order'
    })
    paymentMethod: PaymentMethod

    @IsNotEmpty()
    @IsObject()
    @ApiProperty({
        example: {
            fullname: 'Hà Thúc Minh Quang',
            phone: '0935492577',
            address: '05',
            district: 'Lac Long Quan',
            city: 'Da Nang'
        },
        description: 'Shipping address for the order'
    })
    shippingAddress: {
        fullname: string,
        phone: string,
        address: string,
        district: string,
        city: string
    }

    @IsOptional()
    @IsString()
    @ApiProperty({
        example: 'Give me some tags',
        description: 'Note for the order (Optional)'
    })
    customerNote?: string
}