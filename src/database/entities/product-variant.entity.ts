import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn, ManyToMany, JoinTable } from "typeorm";
import { OrderItem } from "./order-item.entity";
import { CartItem } from "./cart-item.entity";
import { Product } from "./product.entity";
import { Image } from "./image.entity";
@Entity("product_variants")
export class ProductVariant {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({ length: 20 })
    color: string

    @Column({ type: 'decimal', precision: 4, scale: 1 })
    size: number

    @Column({ unique: true, length: 100, nullable: true })
    sku: string;

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0.00 })
    additionalPrice: number;

    @Column({ type: 'int', default: 0 })
    stockQuantity: number;

    @Column({ default: false })
    isLocked: boolean

    @ManyToOne(() => Product, (product) => product.variants, {
        nullable: false,
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'product_id' })
    product: Product;

    @OneToMany(() => CartItem, (cartItem) => cartItem.productVariant)
    cartItems: CartItem[];

    @OneToMany(() => OrderItem, (orderItem) => orderItem.productVariant)
    orderItems: OrderItem[];

    // @OneToMany(() => Image, (image) => image.product_variant, {
    //     cascade: ['insert', 'update', 'remove'],
    //     eager: true
    // })
    // images: Image[]

    @ManyToMany(() => Image, (image) => image.variants, {
        eager: true
    })
    @JoinTable({
        name: 'variant_image',
        joinColumn: {
            name: 'variant_id',
            referencedColumnName: 'id'
        },
        inverseJoinColumn: {
            name: 'image_id',
            referencedColumnName: 'id'
        }
    })
    images: Image[]
}