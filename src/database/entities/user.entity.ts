import { _default } from './../../../node_modules/@types/validator/index.d';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany, OneToOne } from "typeorm";
import { Role } from "./role.entity";
import { Order } from "./order.entity";
import { Cart } from "./cart.entity";
import { Exclude } from 'class-transformer';
@Entity("users")
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    fullname: string;

    @Column({ unique: true })
    username: string;

    @Column({ unique: true })
    email: string;

    @Column({ type: 'jsonb', nullable: true })
    providers: {
        google?: {
            id: string,
            email: string
        }
    }

    @Column({ default: true })
    isActive: boolean

    @ManyToOne(() => Role, (role) => role.users, {
        eager: true,
        nullable: false,
        onDelete: 'RESTRICT'
    })
    @JoinColumn({ name: 'role_id' })
    role: Role

    @OneToMany(() => Order, (order) => order.user)
    orders: Order[]

    @OneToOne(() => Cart, (cart) => cart.user)
    cart: Cart

    @Column({ unique: true, nullable: true })
    phone_number: string

    @Column()
    @Exclude({ toPlainOnly: true })
    password: string;

    @CreateDateColumn()
    created_at: Date

    @UpdateDateColumn()
    updated_at: Date

}