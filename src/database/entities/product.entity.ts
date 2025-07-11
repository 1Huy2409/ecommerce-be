import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Brand } from "./brand.entity";
import { Category } from "./category.entity";
import { ProductVariant } from "./product-variant.entity";
import { Image } from "./image.entity";

@Entity("products")
export class Product {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({ length: 255 })
    name: string

    @Column({ type: 'text', nullable: true })
    description: string

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    basePrice: number

    @Column({ length: 20, nullable: true })
    gender: string

    @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date

    @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    updated_at: Date

    @ManyToOne(() => Brand, (brand) => brand.products, { nullable: false })
    @JoinColumn({ name: 'brand_id' })
    brand: Brand

    @ManyToOne(() => Category, (category) => category.products, { nullable: false })
    @JoinColumn({ name: 'category_id' })
    category: Category

    @OneToMany(() => ProductVariant, (variant) => variant.product)
    variants: ProductVariant[]

    @OneToMany(() => Image, (image) => image.product)
    images: Image[]
}