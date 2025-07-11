import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
import { Cart } from "./cart.entity";
import { ProductVariant } from "./product-variant.entity";
@Entity("cart_items")
export class CartItem {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({ type: 'int', default: 1 })
    quantity: number

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    priceAtAddition: number // price when add to cart

    @ManyToOne(() => Cart, (cart) => cart.items, {
        nullable: false,
        onDelete: 'CASCADE'
    })
    @JoinColumn({ name: 'cart_id' })
    cart: Cart

    @ManyToOne(() => ProductVariant, (variant) => variant.cartItems, {
        nullable: false,
        onDelete: 'RESTRICT'
    })
    @JoinColumn({ name: 'product_variant_id' })
    productVariant: ProductVariant
}