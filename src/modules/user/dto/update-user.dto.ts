import { IsEmail, IsNotEmpty, MinLength, IsString, IsPhoneNumber } from "class-validator";

export class UpdateUserDto {
    @IsNotEmpty({ message: "Fullname cant be empty!" })
    @MinLength(10, { message: "Fullname must be at least 10 characters" })
    fullname: string;

    @IsNotEmpty({ message: "Username cant be empty!" })
    @MinLength(5, { message: "Username must be at least 5 characters!" })
    username: string;

    @IsNotEmpty({ message: "Email cant be empty!" })
    @IsEmail()
    email: string;

    @IsString({ message: "Password must be string!" })
    @MinLength(6, { message: "Password must be at least 6 characters!" })
    password: string;

    @IsPhoneNumber()
    phone_number: string;
}