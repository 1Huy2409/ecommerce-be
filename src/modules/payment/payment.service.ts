import Stripe from 'stripe';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order, OrderStatus, PaymentMethod } from 'src/database/entities/order.entity';
import { Payment, PaymentStatus } from 'src/database/entities/payment.entity';
import { Repository } from 'typeorm';
import { StripeService } from './providers/stripe.service';
import { CodPaymentDto } from './dto/cod-payment.dto';

@Injectable()
export class PaymentService {
    constructor(
        @InjectRepository(Order)
        private orderRepository: Repository<Order>,
        @InjectRepository(Payment)
        private paymentRepository: Repository<Payment>,
        private stripeService: StripeService
    ) { }

    async createPaymentIntent(orderId: string): Promise<{ clientSecret: string | null, paymentIntentId: string, publishableKey: string | undefined }> {
        const order = await this.orderRepository.findOne({
            where: {
                id: orderId
            },
            relations: ['payment']
        })
        if (!order) {
            throw new NotFoundException(`Order with ID ${orderId} is not found!`)
        }
        if (order.paymentMethod !== PaymentMethod.STRIPE) {
            throw new BadRequestException('This method does not support for this payment method!')
        }
        if (!order.payment) {
            throw new BadRequestException('Payment record not found for this order')
        }
        if (order.payment.status === PaymentStatus.SUCCESSFUL) {
            throw new BadRequestException('This order has already been paid!')
        }
        const paymentIntent = await this.stripeService.createPaymentIntent(order)
        order.payment.transactionId = paymentIntent.id
        order.payment.providerResponse = {
            paymentIntentId: paymentIntent.id,
            clientSecret: paymentIntent.client_secret
        }
        await this.paymentRepository.save(order.payment)
        return {
            clientSecret: paymentIntent.client_secret,
            paymentIntentId: paymentIntent.id,
            publishableKey: process.env.STRIPE_PUBLIC_KEY
        }
    }

    async handleStripeWebhook(event: Stripe.Event) {
        switch (event.type) {
            case 'payment_intent.succeeded':
                await this.handlePaymentIntentSucceeded(event.data.object as Stripe.PaymentIntent);
                break;

            case 'payment_intent.payment_failed':
                await this.handlePaymentIntentFailed(event.data.object as Stripe.PaymentIntent);
                break;

            case 'payment_intent.processing':
                await this.handlePaymentIntentProcessing(event.data.object as Stripe.PaymentIntent);
                break;

            case 'payment_intent.requires_action':
                console.log('Payment requires additional action (3D Secure, etc.)');
                break;

            default:
                console.log(`Unhandled Stripe event type: ${event.type}`);
        }
    }

    private async handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent): Promise<void> {
        const payment = await this.paymentRepository.findOne({
            where: { transactionId: paymentIntent.id },
            relations: ['order'],
        });

        if (!payment) {
            console.error(`Payment not found for PaymentIntent: ${paymentIntent.id}`);
            return;
        }

        payment.status = PaymentStatus.SUCCESSFUL;
        payment.providerResponse = {
            ...payment.providerResponse,
            paymentIntent: paymentIntent,
            paidAt: new Date().toISOString(),
        };

        await this.paymentRepository.save(payment);

        if (payment.order) {
            payment.order.status = OrderStatus.CONFIRMED;
            await this.orderRepository.save(payment.order);
        }

        console.log(`Payment succeeded for order: ${payment.order?.orderNumber}`);
    }

    private async handlePaymentIntentFailed(paymentIntent: Stripe.PaymentIntent): Promise<void> {
        const payment = await this.paymentRepository.findOne({
            where: { transactionId: paymentIntent.id },
            relations: ['order'],
        });

        if (!payment) {
            console.error(`Payment not found for PaymentIntent: ${paymentIntent.id}`);
            return;
        }

        payment.status = PaymentStatus.FAILED;
        payment.providerResponse = {
            ...payment.providerResponse,
            paymentIntent: paymentIntent,
            failedAt: new Date().toISOString(),
            failureReason: paymentIntent.last_payment_error?.message,
        };

        await this.paymentRepository.save(payment);

        console.log(`Payment failed for order: ${payment.order?.orderNumber}`);
    }

    private async handlePaymentIntentProcessing(paymentIntent: Stripe.PaymentIntent): Promise<void> {
        const payment = await this.paymentRepository.findOne({
            where: { transactionId: paymentIntent.id },
        });

        if (payment) {
            payment.providerResponse = {
                ...payment.providerResponse,
                paymentIntent: paymentIntent,
                processingAt: new Date().toISOString(),
            };

            await this.paymentRepository.save(payment);
        }

        console.log(`Payment processing for PaymentIntent: ${paymentIntent.id}`);
    }

    async handleCodPayment(codPaymentData: CodPaymentDto): Promise<Payment> {
        const { paymentId, status } = codPaymentData
        // find payment
        const payment = await this.paymentRepository.findOne(
            {
                where: { id: paymentId, status: PaymentStatus.PENDING },
                relations: ['order']
            }
        )
        if (!payment) {
            throw new NotFoundException(`Payment with ID ${paymentId} is not found!`)
        }
        switch (status) {
            case PaymentStatus.SUCCESSFUL:
                payment.status = PaymentStatus.SUCCESSFUL
                payment.order.status = OrderStatus.DELIVERED
                break
            case PaymentStatus.FAILED:
                payment.status = PaymentStatus.FAILED
                payment.order.status = OrderStatus.CANCELLED
                break
        }
        return await this.paymentRepository.save(payment)
    }
    async getPaymentStatus(transactionId: string): Promise<Payment> {
        const payment = await this.paymentRepository.findOne({
            where: {
                transactionId
            },
            relations: ['order']
        })
        if (!payment) {
            throw new NotFoundException(`Payment with transaction ID ${transactionId} is not found!`)
        }
        return payment
    }
}
