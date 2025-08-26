import { Body, Controller, Get, Headers, HttpCode, HttpStatus, Param, ParseUUIDPipe, Post, Req } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreatePaymentIntentDto } from './dto/create-payment-intent.dto';
import { StripeService } from './providers/stripe.service';
import { Payment } from 'src/database/entities/payment.entity';
import { Public } from 'src/core/decorators/public.decorator';
@ApiTags('Payment')
@ApiBearerAuth()
@Controller('payments')
export class PaymentController {
    constructor(
        private paymentService: PaymentService,
        private stripeService: StripeService
    ) { }

    @Post('stripe/payment-intent')
    @ApiOperation({ summary: 'Create payment intent from server' })
    @ApiResponse({ status: 201, description: 'Create payment intent sucessfully!' })
    async createPaymentIntent(@Body() createPaymentIntentData: CreatePaymentIntentDto) {
        const paymentIntentResult = await this.paymentService.createPaymentIntent(createPaymentIntentData.orderId)
        return paymentIntentResult
    }

    @Public()
    @Post('stripe/webhook')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Handle Stripe webhook events' })
    async handleStripeWebhook(
        @Req() req: any,
        @Headers('stripe-signature') signature: string,
    ) {
        try {
            // When using express.raw() middleware, the body is available as Buffer in req.body
            const payload = req.body;
            
            if (!payload) {
                throw new Error('No webhook payload was provided');
            }
            
            if (!signature) {
                throw new Error('No stripe signature provided');
            }

            const event = await this.stripeService.constructWebhookEvent(payload, signature);
            await this.paymentService.handleStripeWebhook(event);
            return { received: true };
        } catch (error) {
            console.error('Webhook error:', error.message);
            throw error;
        }
    }

    @Get('status/:transactionId')
    @ApiOperation({ summary: 'Get payment status' })
    @ApiResponse({ status: 200, description: 'Get payment status successfully!' })
    async getPaymentStatus(@Param('transactionId') transactionId: string): Promise<Payment> {
        const payment = await this.paymentService.getPaymentStatus(transactionId)
        return payment
    }
}
