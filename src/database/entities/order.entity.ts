import { Entity, PrimaryGeneratedColumn, CreateDateColumn, Column, UpdateDateColumn, OneToOne, ManyToOne, OneToMany, JoinColumn } from "typeorm";
import { User } from "./user.entity";
import { OrderItem } from "./order-item.entity";
import { Payment } from "./payment.entity";

export enum OrderStatus {
    PENDING = 'pending',
    PROCESSING = 'processing',
    SHIPPED = 'shipped',
    DELIVERED = 'delivered',
    CANCELLED = 'cancelled',
    REFUNDED = 'refunded'
}
@Entity("orders")
export class Order {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    orderDate: Date;

    @Column({ type: 'decimal', precision: 12, scale: 2 })
    totalAmount: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0.00 })
    shippingFee: number;

    @Column({ type: 'decimal', precision: 12, scale: 2 })
    finalAmount: number;

    @Column({
        type: 'enum',
        enum: OrderStatus,
        default: OrderStatus.PENDING,
    })
    status: OrderStatus;

    @Column({ length: 50, nullable: true })
    paymentMethod: string;

    @Column({ type: 'jsonb' })
    shippingAddress: object;

    @Column({ type: 'text', nullable: true })
    customerNote: string;

    @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    @ManyToOne(() => User, (user) => user.orders, {
        nullable: false,
        onDelete: 'RESTRICT',
    })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @OneToMany(() => OrderItem, (item) => item.order)
    items: OrderItem[];

    @OneToOne(() => Payment, (payment) => payment.order)
    payment: Payment;
}