import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, MinLength, IsString, IsPhoneNumber } from "class-validator";

export class UpdateProfileDto {
    @IsNotEmpty({ message: "Fullname cant be empty!" })
    @MinLength(10, { message: "Fullname must be at least 10 characters" })
    @ApiProperty({ example: 'Nguyễn Hữu Nhất Huy', description: 'Enter your fullname here' })
    fullname: string;

    @IsNotEmpty({ message: "Username cant be empty!" })
    @MinLength(5, { message: "Username must be at least 5 characters!" })
    @ApiProperty({ example: 'username@123', description: 'Enter your username here' })
    username: string;

    @IsNotEmpty({ message: "Email cant be empty!" })
    @IsEmail()
    @ApiProperty({ example: 'nguyenvana@gmail.com', description: 'Enter your email here' })
    email: string;

    @IsString({ message: "Password must be string!" })
    @MinLength(6, { message: "Password must be at least 6 characters!" })
    @ApiProperty({ example: 'password@123', description: 'Enter your password here' })
    password: string;

    @IsString()
    @ApiProperty({ example: '0935492574', description: 'Enter your phone number here' })
    phone_number: string;

}