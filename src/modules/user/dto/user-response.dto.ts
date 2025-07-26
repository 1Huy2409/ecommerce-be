import { Expose } from "class-transformer";
export class UserResponseDto {
    @Expose()
    id: string;

    @Expose()
    fullname: string;

    @Expose()
    username: string;

    @Expose()
    email: string;

    @Expose()
    providers: object;

    @Expose()
    isActive: boolean;

    @Expose()
    created_at: Date;

    @Expose()
    updated_at: Date;

    @Expose()
    get roleName(): string | undefined {
        return (this as any).role ? (this as any).role.name : undefined
    }
}