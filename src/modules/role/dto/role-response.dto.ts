import { Expose, Exclude, Transform } from "class-transformer"
import { Role } from "src/database/entities/role.entity"

export class RoleResponseDto {
    @Expose()
    name: string

    @Expose()
    description: string

    @Expose()
    created_at: Date

    @Expose()
    updated_at: Date

    @Expose()
    @Transform(({ obj }) => {
        return obj.permissions?.map(permission => permission.name)
    })
    permission_names: string[]
}