import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { Order } from 'src/database/entities/order.entity';

@Injectable()
export class StripeService {
    private stripe: Stripe;

    constructor(private configService: ConfigService) {
        const secretKey = this.configService.get<string>('STRIPE_SECRET_KEY')
        if (!secretKey) {
            throw new Error('STRIPE_SECRET_KEY is required!')
        }
        this.stripe = new Stripe(secretKey, {
            apiVersion: '2025-07-30.basil'
        })
    }

    async createPaymentIntent(order: Order): Promise<Stripe.PaymentIntent> {
        try {
            const paymentIntent = await this.stripe.paymentIntents.create({
                amount: Math.round(order.finalAmount),
                currency: 'vnd',
                metadata: {
                    orderId: order.id,
                    orderNumber: order.orderNumber,
                },
                payment_method_types: ['card'],
            });
            return paymentIntent;
        } catch (error) {
            throw new Error(`Stripe PaymentIntent creation failed: ${error.message}`);
        }
    }

    async retrievePaymentIntent(paymentIntentId: string): Promise<Stripe.PaymentIntent> {
        try {
            return await this.stripe.paymentIntents.retrieve(paymentIntentId);
        } catch (error) {
            throw new Error(`Failed to retrieve PaymentIntent: ${error.message}`);
        }
    }

    async constructWebhookEvent(body: any, signature: string): Promise<Stripe.Event> {
        const webhookSecret = this.configService.get<string>('STRIPE_WEBHOOK_SECRET');
        if (!webhookSecret) {
            throw new Error('STRIPE_WEBHOOK_SECRET is required!')
        }
        try {
            return this.stripe.webhooks.constructEvent(body, signature, webhookSecret);
        } catch (error) {
            throw new Error(`Webhook signature verification failed: ${error.message}`);
        }
    }

    verifyWebhookSignature(body: any, signature: string): boolean {
        try {
            this.constructWebhookEvent(body, signature);
            return true;
        } catch (error) {
            return false;
        }
    }
}