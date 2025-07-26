import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, OneToMany, PrimaryColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "./user.entity";
import { Permission } from "./permission.entity";
@Entity("roles")
export class Role {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({ unique: true, length: 50 })
    name: string

    @Column({ type: 'text', nullable: true })
    description: string

    @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date

    @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    updated_at: Date

    @OneToMany(() => User, (user) => user.role)
    users: User[]

    @ManyToMany(() => Permission, (permission) => permission.roles, {
        eager: true
    })
    @JoinTable({
        name: 'role_permission',
        joinColumn: {
            name: 'role_id',
            referencedColumnName: 'id'
        },
        inverseJoinColumn: {
            name: 'permission_id',
            referencedColumnName: 'id'
        }
    })
    permissions: Permission[]

}