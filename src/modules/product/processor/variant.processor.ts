import { InjectQueue, Processor, WorkerHost } from "@nestjs/bullmq";
import { CreateVariantJobData } from "../types/create-variant-job";
import { Job, Queue } from "bullmq";
import { ProductVariant } from "src/database/entities/product-variant.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Product } from "src/database/entities/product.entity";
import { DataSource, EntityManager, Repository } from "typeorm";
import { NotFoundException } from "@nestjs/common";
import { ProductVariantService } from "../product-variant.service";

@Processor('variant-queue')
export class VariantProcessor extends WorkerHost {
    constructor(
        @InjectRepository(Product)
        private productRepository: Repository<Product>,
        private dataSource: DataSource,
        private variantService: ProductVariantService,
        @InjectQueue('product-queue')
        private productQueue: Queue
    ) {
        super()
    }

    // Override để handle specific job names
    async process(job: Job<any, any, string>): Promise<any> {
        console.log(`[VariantProcessor] ===== JOB RECEIVED =====`);
        console.log(`[VariantProcessor] Job ID: ${job.id}`);
        console.log(`[VariantProcessor] Job Name: ${job.name}`);
        console.log(`[VariantProcessor] Queue Name: ${job.queueName}`);

        if (job.name === 'create-variant') {
            return this.handleCreateVariant(job);
        } else {
            console.log(`[VariantProcessor] Unknown job name: ${job.name}`);
            throw new Error(`Unknown job name: ${job.name}`);
        }
    }
    
    async handleCreateVariant(job: Job<CreateVariantJobData>): Promise<ProductVariant[]> {
        const { variants } = job.data;
        
        console.log(`[VariantProcessor] Processing job: ${job.id}`);
        console.log(`[VariantProcessor] Creating ${variants.length} variants`);

        try {
            const productId = await this.getProductIdFromParent(job);
            
            if (!productId) {
                throw new NotFoundException('Product ID not found from parent job');
            }

            console.log(`[VariantProcessor] Creating variants for product: ${productId}`);

            const result = await this.dataSource.transaction(async (manager: EntityManager) => {
                const product = await this.productRepository.findOne({
                    where: { id: productId }
                });

                if (!product) {
                    throw new NotFoundException(`Product with ID ${productId} is not found!`);
                }

                let productVariants: ProductVariant[] = [];
                for (const variant of variants) {
                    const newVariant = await this.variantService.createVariantTransaction(manager, variant, product);
                    if (newVariant) {
                        productVariants.push(newVariant);
                    }
                }

                product.variants = productVariants;
                await manager.save(Product, product);

                console.log(`[VariantProcessor] Created ${productVariants.length} variants for product ${productId}`);
                return productVariants;
            });

            console.log(`[VariantProcessor] Job ${job.id} completed successfully`);
            return result;

        } catch (error) {
            console.error(`[VariantProcessor] Job ${job.id} failed:`, error);
            throw error;
        }
    }

    private async getProductIdFromParent(job: Job): Promise<string | null> {
        try {
            const parent = job.parent;
            if (!parent) {
                throw new Error('No parent job found');
            }
            
            console.log(`[VariantProcessor] Getting parent job: ${parent.id}`);
            
            const parentJob = await this.productQueue.getJob(parent.id!);
            if (!parentJob) {
                throw new Error('Parent job not found');
            }

            // Check parent job state first
            const state = await parentJob.getState();
            console.log(`[VariantProcessor] Parent job state: ${state}`);

            // If already completed, get result directly
            if (state === 'completed') {
                const result = parentJob.returnvalue;
                if (result && result.id) {
                    console.log(`[VariantProcessor] Got product ID from completed parent: ${result.id}`);
                    return result.id;
                }
            }

            // If not completed, wait with longer timeout
            console.log(`[VariantProcessor] Waiting for parent job to complete...`);
            await parentJob.waitUntilFinished(this.productQueue, 120000); // 2 minutes timeout
            
            const result = parentJob.returnvalue;
            if (!result || !result.id) {
                console.error(`[VariantProcessor] Parent job returnvalue:`, result);
                throw new Error('Parent job did not return product ID');
            }
    
            console.log(`[VariantProcessor] Retrieved product ID from parent: ${result.id}`);
            return result.id;
            
        } catch (error) {
            console.error(`[VariantProcessor] Error getting product ID from parent:`, error);
            
            // Try to get more info about parent job for debugging
            if (job.parent) {
                try {
                    const parentJob = await this.productQueue.getJob(job.parent.id!);
                    if (parentJob) {
                        const state = await parentJob.getState();
                        console.error(`[VariantProcessor] Parent job final state: ${state}`);
                        console.error(`[VariantProcessor] Parent job data:`, parentJob.data);
                        console.error(`[VariantProcessor] Parent job returnvalue:`, parentJob.returnvalue);
                        console.error(`[VariantProcessor] Parent job failedReason:`, parentJob.failedReason);
                    }
                } catch (debugError) {
                    console.error(`[VariantProcessor] Error getting debug info:`, debugError);
                }
            }
            
            throw error;
        }
    }
}