// src/entities/payment.entity.ts
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    OneToOne,
    JoinColumn,
} from 'typeorm';
import { Order } from './order.entity';

export enum PaymentStatus {
    PENDING = 'pending',
    SUCCESSFUL = 'successful',
    FAILED = 'failed',
    REFUNDED = 'refunded',
}

@Entity('payments')
export class Payment {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true, length: 255 })
    transactionId: string; // ID từ cổng thanh toán

    @Column({ type: 'decimal', precision: 12, scale: 2 })
    amount: number;

    @Column({ length: 10, default: 'VND' })
    currency: string;

    @Column({
        type: 'enum',
        enum: PaymentStatus,
        default: PaymentStatus.PENDING,
    })
    status: PaymentStatus;

    @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    paymentDate: Date;

    @Column({ type: 'jsonb', nullable: true })
    providerResponse: object;

    @OneToOne(() => Order, (order) => order.payment, {
        nullable: false,
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'order_id', referencedColumnName: 'id' })
    order: Order;
}