import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsUUID } from "class-validator";

export class CreatePaymentIntentDto {
    @IsNotEmpty()
    @IsUUID()
    @ApiProperty({
        description: 'Order ID to create payment intent for',
        example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    })
    orderId: string
}