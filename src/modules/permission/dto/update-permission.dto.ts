import { IsNotEmpty, IsOptional, IsString, Min, MinLength } from "class-validator";

export class UpdatePermissionDto {
    @IsOptional()
    @IsString()
    @IsNotEmpty({ message: 'Permission name cant be empty!' })
    name?: string

    @IsOptional()
    @IsString()
    @IsNotEmpty({ message: 'Permission description cant be empty!' })
    @MinLength(10, { message: 'Permission description must be at least 10 characters' })
    description?: string
}