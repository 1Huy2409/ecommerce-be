import { IsArray, IsNotEmpty, IsOptional, IsString, IsUUID, MinLength } from "class-validator";

export class CreateRoleDto {
    @IsNotEmpty()
    @IsString()
    name: string

    @IsOptional()
    @IsString()
    @MinLength(10, { message: 'Role description must be at least 10 characters' })
    description?: string

    @IsOptional()
    @IsArray()
    @IsUUID(undefined, { each: true })
    permissionIds: string[]
}   