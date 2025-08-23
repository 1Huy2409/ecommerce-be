import { Entity, PrimaryGeneratedColumn, CreateDateColumn, Column, UpdateDateColumn, OneToOne, ManyToOne, OneToMany, JoinColumn } from "typeorm";
import { User } from "./user.entity";
import { OrderItem } from "./order-item.entity";
import { Payment } from "./payment.entity";
import { OrderCancelRequest } from "./order-cancel-request.entity";

export enum OrderStatus {
    PENDING = 'pending',
    CONFIRMED = 'confirmed',
    PROCESSING = 'processing',
    SHIPPED = 'shipped',
    DELIVERED = 'delivered',
    CANCELLED = 'cancelled',
    REFUNDED = 'refunded'
}

export enum PaymentMethod {
    COD = 'cod',
    VNPAY = 'vnpay'
}
@Entity("orders")
export class Order {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true, length: 20 })
    orderNumber: string

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

    @Column({
        type: 'enum',
        enum: PaymentMethod,
        nullable: false
    })
    paymentMethod: PaymentMethod;

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

    @OneToMany(() => OrderCancelRequest, (request) => request.order)
    requests: OrderCancelRequest[]

    @OneToMany(() => OrderItem, (item) => item.order)
    items: OrderItem[];

    @OneToOne(() => Payment, (payment) => payment.order)
    payment: Payment;
}