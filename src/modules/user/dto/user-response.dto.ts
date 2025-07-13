import { User } from "src/database/entities/user.entity";
import { Expose } from "class-transformer";


export class UserResponseDto {
    id: string;
    fullname: string;
    username: string;
    email: string;
    providers: object;
    isActive: boolean;
    created_at: Date;
    updated_at: Date;

    @Expose()
    get roleName(): string | undefined {
        return (this as any).role ? (this as any).role.name : undefined
    }

    constructor(partial: Partial<User>) {
        Object.assign(this, partial)
    }
}