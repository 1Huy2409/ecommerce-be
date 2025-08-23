import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateCancelRequest {
    @IsNotEmpty()
    @IsString()
    @ApiProperty({ example: 'I dont wanna buy this shit!' })
    reason: string
}