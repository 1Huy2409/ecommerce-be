import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNotEmpty, IsOptional, IsString, IsUUID, MinLength } from "class-validator";

export class UpdateRoleDto {
    @IsOptional()
    @IsNotEmpty()
    @IsString()
    @ApiProperty({ example: 'staff', description: 'Enter role name here' })
    name?: string

    @IsOptional()
    @IsString()
    @MinLength(10, { message: 'Role description must be at least 10 characters' })
    @ApiProperty({ example: 'Description of this role', description: 'Enter your role description here' })
    description?: string

    @IsOptional()
    @IsArray()
    @IsUUID(undefined, { each: true })
    @ApiProperty({ example: 'permission-id', description: 'Enter your array of permisison ID here' })
    permissionIds: string[]
}