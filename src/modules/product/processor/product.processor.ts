import { InjectQueue, Processor, WorkerHost } from "@nestjs/bullmq";
import { InjectRepository } from "@nestjs/typeorm";
import { Job, Queue } from "bullmq";
import { Brand } from "src/database/entities/brand.entity";
import { Category } from "src/database/entities/category.entity";
import { Product } from "src/database/entities/product.entity";
import { ImageService } from "src/modules/image/image.service";
import { DataSource, EntityManager, Repository } from "typeorm";
import { CreateProductJobData } from "../types/create-product-job";
import { BadRequestException, ConflictException } from "@nestjs/common";

@Processor('product-queue')
export class ProductProcessor extends WorkerHost {
    constructor(
        @InjectRepository(Product)
        private productsRepository: Repository<Product>,
        @InjectRepository(Brand)
        private brandsRepository: Repository<Brand>,
        @InjectRepository(Category)
        private categoriesRepository: Repository<Category>,
        private imageService: ImageService,
        private dataSource: DataSource,
    ) {
        super()
    }

    // Override để handle specific job names
    async process(job: Job<any, any, string>): Promise<any> {
        console.log(`[ProductProcessor] ===== JOB RECEIVED =====`);
        console.log(`[ProductProcessor] Job ID: ${job.id}`);
        console.log(`[ProductProcessor] Job Name: ${job.name}`);
        console.log(`[ProductProcessor] Queue Name: ${job.queueName}`);

        if (job.name === 'create-product') {
            return this.handleCreateProduct(job);
        } else {
            console.log(`[ProductProcessor] Unknown job name: ${job.name}`);
            throw new Error(`Unknown job name: ${job.name}`);
        }
    }
    
    async handleCreateProduct(job: Job<CreateProductJobData, {id: string}, string>): Promise<{id: string}> {
        const { name, description, basePrice, gender, brandId, categoryId, productImageIds } = job.data;
        
        console.log(`[ProductProcessor] ===== PROCESSING JOB START =====`);
        console.log(`[ProductProcessor] Job ID: ${job.id}`);
        console.log(`[ProductProcessor] Job Name: ${job.name}`);
        console.log(`[ProductProcessor] Creating product: ${name}`);
        console.log(`[ProductProcessor] Job Data:`, job.data);

        try {
            // Validation
            const existingBrand = await this.brandsRepository.findOne({ where: { id: brandId } });
            if (!existingBrand) {
                throw new BadRequestException(`Brand with ID ${brandId} doesnt exist!`);
            }

            const existingCategory = await this.categoriesRepository.findOne({ where: { id: categoryId } });
            if (!existingCategory) {
                throw new BadRequestException(`Category with ID ${categoryId} doesnt exist!`);
            }

            const existingProduct = await this.productsRepository.findOne({ where: { name: name } });
            if (existingProduct) {
                throw new ConflictException("This product have already exist!");
            }

            const result = await this.dataSource.transaction(async (manager: EntityManager) => {
                console.log(`[ProductProcessor] Starting transaction for product: ${name}`);
                
                const newProduct = manager.create(Product, {
                    name,
                    description,
                    basePrice,
                    gender,
                    brand: existingBrand,
                    category: existingCategory,
                });

                const saveProduct = await manager.save(Product, newProduct);
                console.log(`[ProductProcessor] Product saved with ID: ${saveProduct.id}`);

                // Attach product images
                if (productImageIds && productImageIds.length > 0) {
                    console.log(`[ProductProcessor] Attaching ${productImageIds.length} images`);
                    for (let i = 0; i < productImageIds.length; i++) {
                        const imageId = productImageIds[i];
                        await this.imageService.attachImageToProductTransaction(
                            manager,
                            imageId,
                            saveProduct,
                            i === 0,
                            i
                        );
                    }
                    console.log(`[ProductProcessor] Images attached successfully`);
                }

                return { id: saveProduct.id };
            });

            console.log(`[ProductProcessor] Job ${job.id} completed successfully with product ID: ${result.id}`);
            return result;

        } catch (error) {
            console.error(`[ProductProcessor] Job ${job.id} failed:`, error);
            throw error;
        }
    }
}