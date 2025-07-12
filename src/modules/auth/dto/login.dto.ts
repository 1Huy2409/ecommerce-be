import { IsNotEmpty } from 'class-validator'
export class LoginDTO {
    @IsNotEmpty({ message: "Email cant be empty!" })
    username: string;

    @IsNotEmpty({ message: "Password cant be empty" })
    password: string
}