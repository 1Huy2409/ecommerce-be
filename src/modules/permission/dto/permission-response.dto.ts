import { Permission } from "src/database/entities/permission.entity"

export class PermissionResponseDto {
    name: string
    description: string
    created_at: Date
    updated_at: Date

    constructor(partial: Partial<Permission>) {
        Object.assign(this, partial)
    }
}