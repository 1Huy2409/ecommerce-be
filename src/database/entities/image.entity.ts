import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Product } from './product.entity'
@Entity("images")
export class Image {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({ type: 'text' })
    url: string

    @Column({ default: false })
    isThumbnail: boolean

    @Column({ type: 'int', default: 0 })
    order: number

    @ManyToOne(() => Product, (product) => product.images, {
        nullable: false,
        onDelete: 'CASCADE'
    })
    @JoinColumn({ name: 'product_id' })
    product: Product
}