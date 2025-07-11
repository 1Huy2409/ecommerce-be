import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToMany } from "typeorm";
import { Role } from "./role.entity";

@Entity("permissions")
export class Permission {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({ unique: true, length: 100 })
    name: string

    @Column({ type: 'text', nullable: true })
    description: string

    @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date

    @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    updated_at: Date

    @ManyToMany(() => Role, (role) => role.permissions)
    roles: Role[]
}   