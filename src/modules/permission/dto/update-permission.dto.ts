import { IsNotEmpty, IsOptional, IsString, Min, MinLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class UpdatePermissionDto {
    @IsOptional()
    @IsString()
    @IsNotEmpty({ message: 'Permission name cant be empty!' })
    @ApiProperty({ example: 'image:upload', description: 'Enter permission name here' })
    name?: string

    @IsOptional()
    @IsString()
    @IsNotEmpty({ message: 'Permission description cant be empty!' })
    @MinLength(10, { message: 'Permission description must be at least 10 characters' })
    @ApiProperty({ example: 'permission description', description: 'Enter permission description here' })
    description?: string
}