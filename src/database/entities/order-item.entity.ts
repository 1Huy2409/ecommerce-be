// src/entities/order-item.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Order } from './order.entity';
import { ProductVariant } from './product-variant.entity';

@Entity('order_items')
export class OrderItem {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'int' })
    quantity: number;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    priceAtPurchase: number;

    @Column({ type: 'decimal', precision: 12, scale: 2 })
    totalItemPrice: number;

    @ManyToOne(() => Order, (order) => order.items, {
        nullable: false,
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'order_id' })
    order: Order;

    @ManyToOne(() => ProductVariant, (variant) => variant.orderItems, {
        nullable: false,
        onDelete: 'RESTRICT',
    })
    @JoinColumn({ name: 'product_variant_id' })
    productVariant: ProductVariant;
}