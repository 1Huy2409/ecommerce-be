import { IsEmail, IsNotEmpty, MinLength, IsString, Min } from "class-validator";
export class RegisterDTO {
    @IsNotEmpty({ message: "Fullname cant be empty!" })
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
}