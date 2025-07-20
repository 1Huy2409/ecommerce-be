import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ProductVariant } from "src/database/entities/product-variant.entity";
import { Not, Repository } from "typeorm";
import { CreateProductVariantDto } from "./dto/variant/create-product-variant.dto";
import { Product } from "src/database/entities/product.entity";
import { ImageService } from "../image/image.service";
import { UpdateProductVariantDto } from "./dto/variant/update-product-variant.dto";
@Injectable()
export class ProductVariantService {
    constructor(
        @InjectRepository(ProductVariant)
        private variantsRepository: Repository<ProductVariant>,
        private imageService: ImageService
    ) { }
    async createVariant(variantData: CreateProductVariantDto | UpdateProductVariantDto, parentProduct: Product): Promise<ProductVariant> {
        const { size, sku, additionalPrice, stockQuantity, productVariantImageIds } = variantData
        const existingSku = await this.variantsRepository.findOne({ where: { sku } })
        if (existingSku) {
            throw new ConflictException("This sku for your variant have already exist!")
        }
        const newVariant = this.variantsRepository.create({
            size,
            sku,
            additionalPrice,
            stockQuantity,
            product: parentProduct
        })
        const savedVariant = await this.variantsRepository.save(newVariant)
        if (productVariantImageIds && productVariantImageIds.length > 0) {
            for (let i = 0; i < productVariantImageIds.length; i++) {
                let variantImageId = productVariantImageIds[i]
                await this.imageService.attachImageToVariant(
                    variantImageId,
                    savedVariant,
                    i === 0,
                    i
                )
            }
        }
        return savedVariant
    }
    async updateVariant(variantId: string, updateVariantDto: UpdateProductVariantDto): Promise<ProductVariant> {
        const { sku, productVariantImageIds, ...restData } = updateVariantDto
        const updateVariant = await this.variantsRepository.findOne({ where: { id: variantId } })
        const existingSku = await this.variantsRepository.findOne({ where: { sku, id: Not(variantId) } })
        if (existingSku) {
            throw new ConflictException("This sku for your variant have already exist!")
        }
        if (!updateVariant) {
            throw new NotFoundException(`Variant with ID ${variantId} is not found!`)
        }
        const savedVariant = await this.variantsRepository.save({
            ...updateVariant,
            ...restData,
            sku
        })
        if (productVariantImageIds) {
            const newProductVariantImageIds = productVariantImageIds
            const oldProductVariantImageIds = updateVariant.images.map((item) => item.id)
            const attachImageIds = newProductVariantImageIds.filter(item => !oldProductVariantImageIds.includes(item))
            const removeImageIds = oldProductVariantImageIds.filter(item => !newProductVariantImageIds.includes(item))
            if (attachImageIds && attachImageIds.length > 0) {
                for (let i = 0; i < newProductVariantImageIds.length; i++) {
                    const imageId = newProductVariantImageIds[i]
                    if (attachImageIds.includes(imageId)) {
                        await this.imageService.attachImageToVariant(
                            imageId,
                            savedVariant,
                            i === 0,
                            i
                        )
                    }
                }
            }
            if (removeImageIds && removeImageIds.length > 0) {
                for (let i = 0; i < removeImageIds.length; i++) {
                    const imageId = removeImageIds[i]
                    await this.imageService.removeImageFromProduct(imageId)
                }
            }
        }
        return savedVariant
    }
    async deleteVariant(variantId: string) {
        const variant = await this.variantsRepository.findOne({
            where: { id: variantId }
        })
        if (!variant) {
            throw new NotFoundException(`Variant with ID ${variantId} is not found!`)
        }
        await this.variantsRepository.remove(variant)
    }
}