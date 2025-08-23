import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Order } from "./order.entity";
import { User } from "./user.entity";

export enum CancelRequestStatus {
    PENDING = 'pending',
    REJECT = 'rejecte',
    APPROVE = 'approve'
}

@Entity('order_cancel_requests')
export class OrderCancelRequest {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({ length: 100 })
    reason: string

    @Column({ length: 100 })
    adminNote: string

    @Column({
        type: 'enum',
        enum: CancelRequestStatus,
        default: CancelRequestStatus.PENDING
    })
    status: CancelRequestStatus

    @ManyToOne(() => Order, (order) => order.requests, {
        nullable: false,
        onDelete: 'CASCADE'
    })
    @JoinColumn({ name: 'order_id' })
    order: Order

    @ManyToOne(() => User, (user) => user.requests, {
        nullable: false,
        onDelete: 'RESTRICT'
    })
    @JoinColumn({ name: 'requested_by' })
    requestedBy: User

    @ManyToOne(() => User, (user) => user.processes, {
        nullable: true,
        onDelete: 'RESTRICT'
    })
    @JoinColumn({ name: 'processed_by' })
    processedBy: User

    @Column({ type: 'timestamptz', nullable: true })
    processedAt: Date

    @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date

    @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    updated_at: Date
}