import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsString } from "class-validator";
import { CancelRequestStatus } from "src/database/entities/order-cancel-request.entity";

export class ProcessCancelRequestDto {
    @IsNotEmpty()
    @IsString()
    @ApiProperty({ example: 'You have used this product before request' })
    adminNote: string

    @IsNotEmpty()
    @IsEnum(CancelRequestStatus)
    @ApiProperty({ example: CancelRequestStatus.REJECT })
    status: CancelRequestStatus

}