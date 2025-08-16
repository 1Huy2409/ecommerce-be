import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator'
export class LoginDTO {
    @ApiProperty({ example: 'nobita2005', description: 'Enter username here' })
    @IsNotEmpty({ message: "Email cant be empty!" })
    username: string;

    @ApiProperty({ example: 'kakaka@05', description: 'Enter password here' })
    @IsNotEmpty({ message: "Password cant be empty" })
    password: string
}