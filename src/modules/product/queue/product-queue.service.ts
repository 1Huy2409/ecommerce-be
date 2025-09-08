import { InjectQueue } from "@nestjs/bullmq";
import { Injectable } from "@nestjs/common";
import { Queue, FlowProducer } from "bullmq";
import { CreateProductDto } from "../dto/product/create-product.dto";

@Injectable()
export class ProductQueueService {
    private flowProducer: FlowProducer;

    constructor(
        @InjectQueue('product-queue')
        private productQueue: Queue,
    ) { 
        this.flowProducer = new FlowProducer({
            connection: {
                host: process.env.REDIS_HOST,
                port: parseInt(process.env.REDIS_PORT || '6379'),
                password: process.env.REDIS_PASSWORD || undefined,
            }
        });
    }

    async createProductWithVariant(productData: CreateProductDto) {
        const { variants, ...productInfo } = productData;
        
        console.log(`[ProductQueueService] Creating flow for product: ${productInfo.name}`);
        
        const flowTree = {
            name: 'create-product',
            queueName: 'product-queue',
            data: productInfo,
            opts: {
                attempts: 3,
                backoff: {
                    type: 'exponential' as const,
                    delay: 2000,
                },
                removeOnComplete: 10,
                removeOnFail: 50,
                timeout: 300000, // 5 minutes timeout for product creation
            },
            children: variants && variants.length > 0 ? [
                {
                    name: 'create-variant',
                    queueName: 'variant-queue',
                    data: {
                        variants: variants
                    },
                    opts: {
                        attempts: 3,
                        backoff: {
                            type: 'exponential' as const,
                            delay: 2000,
                        },
                        timeout: 180000, // 3 minutes timeout for variant creation
                        delay: 2000, // 2 second delay to ensure parent completes
                    }
                }
            ] : []
        };

        const flow = await this.flowProducer.add(flowTree);
        
        console.log(`[ProductQueueService] Flow created with ID: ${flow.job.id}`);

        return {
            flowId: flow.job.id,
            productJobId: flow.job.id,
            message: 'Product creation flow has been queued'
        };
    }

    async getFlowStatus(flowId: string) {
        try {
            const job = await this.productQueue.getJob(flowId);
            if (!job) {
                return { status: 'not_found' };
            }

            const children = await job.getChildrenValues();
            const state = await job.getState();
            
            return {
                status: state,
                progress: job.progress,
                data: job.data,
                result: job.returnvalue,
                children: children,
                failedReason: job.failedReason,
                processedOn: job.processedOn,
                finishedOn: job.finishedOn,
            };
        } catch (error) {
            console.error(`[ProductQueueService] Error getting flow status:`, error);
            return { status: 'error', error: error.message };
        }
    }
}