import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Product } from './product.entity'
import { ProductVariant } from "./product-variant.entity";
@Entity("images")
export class Image {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({ length: 255 })
    fileName: string

    @Column({ type: 'text' })
    url: string

    @Column({ length: 255 })
    publicId: string

    @Column({ default: false })
    isThumbnail: boolean

    @Column({ type: 'int', default: 0 })
    order: number

    @ManyToOne(() => Product, (product) => product.images, {
        nullable: true,
        onDelete: 'CASCADE'
    })
    @JoinColumn({ name: 'product_id' })
    product: Product

    @ManyToOne(() => ProductVariant, (product_variant) => product_variant.images, {
        nullable: true,
        onDelete: 'CASCADE'
    })
    @JoinColumn({ name: 'variant_id' })
    product_variant: ProductVariant
}