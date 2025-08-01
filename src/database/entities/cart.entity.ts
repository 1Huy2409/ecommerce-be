import { Entity, PrimaryGeneratedColumn, OneToOne, CreateDateColumn, UpdateDateColumn, OneToMany } from "typeorm";
import { User } from "./user.entity";
import { CartItem } from "./cart-item.entity";
@Entity("carts")
export class Cart {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @OneToOne(() => User, (user) => user.cart, {
        nullable: false,
        onDelete: 'CASCADE'
    })
    user: User

    @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    @OneToMany(() => CartItem, (cartItem) => cartItem.cart)
    items: CartItem[]
}