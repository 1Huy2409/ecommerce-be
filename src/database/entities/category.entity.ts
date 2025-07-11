import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, OneToMany, JoinColumn } from "typeorm";
import { Product } from "./product.entity";

@Entity("categories")
export class Category {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({ unique: true, length: 100 })
    name: string

    @Column({ unique: true, length: 100 })
    slug: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @ManyToOne(() => Category, (category) => category.children, { nullable: true })
    @JoinColumn({ name: 'parent_id' })
    parent: Category;

    @OneToMany(() => Category, (category) => category.parent)
    children: Category[];

    @OneToMany(() => Product, (product) => product.category)
    products: Product[];
}

