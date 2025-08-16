import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, MinLength, IsString, IsPhoneNumber, IsBoolean } from "class-validator";

export class UpdateUserDto {
    @IsNotEmpty({ message: "Fullname cant be empty!" })
    @MinLength(10, { message: "Fullname must be at least 10 characters" })
    @ApiProperty({ example: 'Nguyễn Hữu Nhất Huy', description: 'Enter fullname here' })
    fullname: string;

    @IsNotEmpty({ message: "Username cant be empty!" })
    @MinLength(5, { message: "Username must be at least 5 characters!" })
    @ApiProperty({ example: 'username@123', description: 'Enter username here' })
    username: string;

    @IsNotEmpty({ message: "Email cant be empty!" })
    @IsEmail()
    @ApiProperty({ example: 'nguyenvana@gmail.com', description: 'Enter email here' })
    email: string;

    @IsString({ message: "Password must be string!" })
    @MinLength(6, { message: "Password must be at least 6 characters!" })
    @ApiProperty({ example: 'password@123', description: 'Enter password here' })
    password: string;

    @IsString()
    @ApiProperty({ example: '0935492574', description: 'Enter phone number here' })
    phone_number: string;

    @IsBoolean()
    @ApiProperty({ example: true, description: 'Enter status of user account (True/False)' })
    isActive: boolean
}