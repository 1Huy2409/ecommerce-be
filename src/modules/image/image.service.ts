import { InjectRepository } from '@nestjs/typeorm';
import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CloudinaryService } from '../storage/cloudinary/cloudinary.service';
import { Image } from 'src/database/entities/image.entity';
import { DeleteResult, EntityManager, IsNull, Not, Repository } from 'typeorm';
import { Product } from 'src/database/entities/product.entity';
import { ProductVariant } from 'src/database/entities/product-variant.entity';
import { error } from 'console';
@Injectable()
export class ImageService {
    constructor(
        @InjectRepository(Image)
        private imagesRepository: Repository<Image>,
        private cloudinaryService: CloudinaryService,

    ) { }
    async uploadFileAndCreateEntity(file: Express.Multer.File): Promise<Image> {
        const cloudinaryResult = await this.cloudinaryService.uploadFile(file)
        const newImage = this.imagesRepository.create({
            fileName: file.originalname,
            url: cloudinaryResult?.secure_url,
            publicId: cloudinaryResult?.public_id
        })
        return await this.imagesRepository.save(newImage)
    }
    async attachImageToProductTransaction(manager: EntityManager, imageId: string, product: Product, isThumbnail: boolean, order: number) {
        const image = await manager.findOne(Image, { where: { id: imageId }, relations: ['product', 'variants'] })
        if (!image) {
            throw new NotFoundException(`Image with ID ${imageId} is not found!`)
        }
        if (image.variants.length > 0 || image.product !== null) {
            throw new ConflictException("This image has its owner")
        }
        image.isThumbnail = isThumbnail
        image.order = order ? order : 0
        image.product = product
        await manager.save(Image, image)
    }
    async attachImageToVariantTransaction(manager: EntityManager, imageId: string, variant: ProductVariant, isThumbnail: boolean, order: number) {
        const image = await manager.findOne(Image, { where: { id: imageId }, relations: ['product', 'variants', 'variants.product'] })
        if (!image) {
            throw new NotFoundException(`Image with ID ${imageId} is not found!`)
        }
        // validation image belongs to product
        if (image.product) {
            throw new ConflictException("This image has its product")
        }
        // validation image belongs to variants with same product owner
        if (image.variants && image.variants.length > 0) {
            const existingProductIds = image.variants.map(item => item.product.id)
            const uniqueProductIds = [...new Set(existingProductIds)]
            if (uniqueProductIds.length > 0 && !uniqueProductIds.includes(variant.product.id)) {
                const uniqueProduct = await manager.findOne(Product, {
                    where: {
                        id: uniqueProductIds[0]
                    }
                })
                if (!uniqueProduct) {
                    throw new NotFoundException(`Product with ID ${uniqueProductIds[0]} is not found!`)
                }
                // throw conflict exception
                throw new ConflictException(`This image is already used by variants of product: "${uniqueProduct.name}". Cannot assign to variants of "${variant.product.name}"`)
            }
        }
        const currentVariants: ProductVariant[] = image.variants
        const currentVariantIds: string[] = currentVariants.map(item => item.id)
        if (!currentVariantIds.includes(variant.id)) {
            currentVariants.push(variant)
            image.variants = currentVariants
        }
        image.isThumbnail = isThumbnail ? isThumbnail : false
        image.order = order ? order : 0
        await manager.save(Image, image)
    }
    async detachImageFromProduct(manager: EntityManager, imageId: string, variantId: string | null) {
        const removeImage = await manager.findOne(Image, {
            where: { id: imageId },
            relations: ['product', 'variants']
        })
        if (!removeImage) {
            throw new NotFoundException(`Image with ID ${imageId} is not found!`)
        }

        if (removeImage.product !== null) {
            removeImage.product = null
        }
        if (removeImage.variants !== null) {
            const newVariants = removeImage.variants.filter(item => item.id !== variantId)
            removeImage.variants = newVariants
        }

        await manager.save(Image, removeImage)
    }

    async getImagesByOwner(queryOwner: string): Promise<Image[]> {
        let images: Image[] | null = []
        const owner = queryOwner ? queryOwner : ""
        switch (owner.toLowerCase()) {
            case "product":
                images = await this.imagesRepository.find(
                    {
                        where: {
                            product: Not(IsNull())
                        }
                    }
                )
                break;
            case "variant":
                const rawImages = await this.imagesRepository.find(
                    {
                        relations: ['variants']
                    }
                )
                images = rawImages.filter(item => item.variants.length > 0)
                break;
            case "noowner":
                const rawData = await this.imagesRepository.find(
                    {
                        where: {
                            product: IsNull()
                        },
                        relations: ["variants"]
                    }
                )
                images = rawData.filter(item => item.variants.length === 0)
                break;
            default:
                images = await this.imagesRepository.find()
                break;
        }
        return images
    }
}
