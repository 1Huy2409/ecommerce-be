import { IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator";

export class CreatePermissionDto {
    @IsString()
    @IsNotEmpty({ message: 'Permission name cant be empty' })
    name: string

    @IsOptional()
    @IsString()
    @MinLength(10, { message: 'Permission description must be at least 10 characters' })
    description: string
}