import { IsEmail, IsNotEmpty, MinLength, IsString, IsOptional } from "class-validator";

export class CreateUserDto {
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

    @IsOptional()
    @IsString({ message: "RoleID must be string" })
    role_id?: string;
}