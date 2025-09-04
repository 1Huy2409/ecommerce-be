import { IsEnum, IsNotEmpty, IsUUID } from "class-validator";
import { PaymentStatus } from "src/database/entities/payment.entity";

export class CodPaymentDto {
    @IsNotEmpty()
    @IsUUID()
    paymentId: string

    @IsNotEmpty()
    @IsEnum(PaymentStatus)
    status: PaymentStatus

}