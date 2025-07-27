import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ProductVariant } from "src/database/entities/product-variant.entity";
import { EntityManager, Not, Repository, DataSource } from "typeorm";
import { CreateProductVariantDto } from "./dto/variant/create-product-variant.dto";
import { Product } from "src/database/entities/product.entity";
import { ImageService } from "../image/image.service";
import { UpdateProductVariantDto } from "./dto/variant/update-product-variant.dto";
@Injectable()
export class ProductVariantService {
    constructor(
        @InjectRepository(ProductVariant)
        private variantsRepository: Repository<ProductVariant>,
        @InjectRepository(Product)
        private productsRepository: Repository<Product>,
        private imageService: ImageService,
        private dataSource: DataSource
    ) { }

    async getVariantByProduct(productId: string): Promise<ProductVariant[]> {
        const product = await this.productsRepository.findOne({ where: { id: productId } })
        if (!product) {
            throw new NotFoundException(`Product with ID ${productId} is not found!`)
        }
        return product.variants
    }

    async createVariantTransaction(manager: EntityManager, variantData: CreateProductVariantDto | UpdateProductVariantDto, parentProduct: Product): Promise<ProductVariant | null> {
        const { size, sku, additionalPrice, stockQuantity, productVariantImageIds } = variantData
        const existingSku = await manager.findOne(ProductVariant, { where: { sku } })
        if (existingSku) {
            throw new ConflictException("This sku for your variant have already exist!")
        }
        try {
            const newVariant = manager.create(ProductVariant, {
                size,
                sku,
                additionalPrice,
                stockQuantity,
                product: parentProduct
            })
            const saveVariant = await manager.save(ProductVariant, newVariant)
            if (productVariantImageIds && productVariantImageIds.length > 0) {
                for (let i = 0; i < productVariantImageIds.length; i++) {
                    let variantImageId = productVariantImageIds[i]
                    await this.imageService.attachImageToVariantTransaction(
                        manager,
                        variantImageId,
                        saveVariant,
                        i === 0,
                        i
                    )
                }
            }
            const finalVariant = await manager.findOne(ProductVariant, { where: { id: saveVariant.id }, relations: { images: true } })
            return finalVariant
        }
        catch (error) {
            console.log("Variant Error: ", error)
            throw error
        }
    }

    async updateVariant(variantId: string, updateVariantDto: UpdateProductVariantDto): Promise<ProductVariant | null | undefined> {
        const { sku, productVariantImageIds, ...restData } = updateVariantDto
        const updateVariant = await this.variantsRepository.findOne({ where: { id: variantId } })
        console.log("Variant tim duoc: ", updateVariant)
        console.log("Rest data: ", restData)
        const existingSku = await this.variantsRepository.findOne({ where: { sku, id: Not(variantId) } })
        if (existingSku) {
            throw new ConflictException("This sku for your variant have already exist!")
        }
        if (!updateVariant) {
            throw new NotFoundException(`Variant with ID ${variantId} is not found!`)
        }
        return await this.dataSource.transaction(async (manager: EntityManager) => {
            try {
                const savedVariant = await manager.save(ProductVariant, {
                    ...updateVariant,
                    ...restData,
                    id: updateVariant.id,
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
                                await this.imageService.attachImageToVariantTransaction(
                                    manager,
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
                return await manager.findOne(ProductVariant, {
                    where: { id: savedVariant.id },
                    relations: {
                        images: true
                    }
                })
            }
            catch (error) {
                console.log("Update variant error: ", error)
                throw error
            }
        })
    }
    async updateVariantTransaction(manager: EntityManager, variantId: string, updateVariantDto: UpdateProductVariantDto): Promise<ProductVariant> {
        const { id, sku, productVariantImageIds, ...restData } = updateVariantDto
        const updateVariant = await manager.findOne(ProductVariant, { where: { id: variantId }, relations: ['images'] })
        const existingSku = await manager.findOne(ProductVariant, { where: { sku, id: Not(variantId) } })
        if (existingSku) {
            throw new ConflictException("This sku for your variant have already exist!")
        }
        if (!updateVariant) {
            throw new NotFoundException(`Variant with ID ${variantId} is not found!`)
        }
        const savedVariant = await manager.save(ProductVariant, {
            ...updateVariant,
            ...restData,
            id,
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
                        await this.imageService.attachImageToVariantTransaction(
                            manager,
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