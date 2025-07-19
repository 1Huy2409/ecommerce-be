import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/product/create-product.dto';
import { Product } from 'src/database/entities/product.entity';
import { Category } from 'src/database/entities/category.entity';
import { Brand } from 'src/database/entities/brand.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { ImageService } from '../image/image.service';
import { ProductVariantService } from './product-variant.service';
import { ProductVariant } from 'src/database/entities/product-variant.entity';
import { UpdateProductDto } from './dto/product/update-product.dto';
@Injectable()
export class ProductService {
    constructor(
        @InjectRepository(Product)
        private productsRepository: Repository<Product>,
        @InjectRepository(Brand)
        private brandsRepository: Repository<Brand>,
        @InjectRepository(Category)
        private categoriesRepository: Repository<Category>,
        private imageService: ImageService,
        private variantService: ProductVariantService
    ) { }
    async createProductWithVariant(productData: CreateProductDto): Promise<Product | null> {
        const { name, description, basePrice, gender, brandId, categoryId, productImageIds, variants } = productData
        const existingBrand = await this.brandsRepository.findOne({ where: { id: brandId } })
        if (!existingBrand) {
            throw new BadRequestException(`Brand with ID ${brandId} doesnt exist!`)
        }
        const existingCategory = await this.categoriesRepository.findOne({ where: { id: categoryId } })
        if (!existingCategory) {
            throw new BadRequestException(`Category with ID ${categoryId} doesnt exist!`)
        }
        const existingProduct = await this.productsRepository.findOne({ where: { name: name } })
        if (existingProduct) {
            throw new ConflictException("This product have already exist!")
        }
        const newProduct = this.productsRepository.create({
            name,
            description,
            basePrice,
            gender,
            brand: existingBrand,
            category: existingCategory,
        })
        const savedProduct = await this.productsRepository.save(newProduct)
        if (productImageIds && productImageIds.length > 0) {
            for (let i = 0; i < productImageIds.length; i++) {
                const imageId = productImageIds[i]
                await this.imageService.attachImageToProduct(
                    imageId,
                    savedProduct,
                    i === 0,
                    i
                )
            }
        }

        const productVariants: ProductVariant[] = []
        if (variants && variants.length > 0) {
            for (let i = 0; i < variants.length; i++) {
                const variant = variants[i]
                const newVariant: ProductVariant = await this.variantService.createVariant(variant, savedProduct)
                productVariants.push(newVariant)
            }
        }
        savedProduct.variants = productVariants
        await this.productsRepository.save(savedProduct)
        return this.productsRepository.findOne({ where: { id: savedProduct.id } })
    }
    async updateProduct(productData: UpdateProductDto, id: string) {
        const { name, brandId, categoryId, productImageIds, variants, ...restData } = productData
        const updateProduct = await this.productsRepository.findOne({ where: { id } })
        if (!updateProduct) {
            throw new NotFoundException(`Product with ID ${id} is not found!`)
        }
        const existingBrand = await this.brandsRepository.findOne({ where: { id: brandId } })
        if (!existingBrand) {
            throw new BadRequestException(`Brand with ID ${brandId} doesnt exist!`)
        }
        const existingCategory = await this.categoriesRepository.findOne({ where: { id: categoryId } })
        if (!existingCategory) {
            throw new BadRequestException(`Category with ID ${categoryId} doesnt exist!`)
        }
        const existingProduct = await this.productsRepository.findOne({ where: { name: name, id: Not(id) } })
        if (existingProduct) {
            throw new ConflictException("This product have already exist!")
        }
        const saveProduct = await this.productsRepository.save({
            ...updateProduct,
            brandId,
            categoryId,
            ...restData,
        })

        const updatedVariants: ProductVariant[] = []
        if (variants) {
            const currentVariantIds = saveProduct.variants.map(v => v.id)
            const incomingVariantIds = variants.filter(v => v.id).map(v => v.id!)

            const variantsToDeleteIds = currentVariantIds.filter((id) => !incomingVariantIds.includes(id))
            for (const variantId of variantsToDeleteIds) {
                await this.variantService.deleteVariant(variantId)
            }
            for (const variant of variants) {
                if (variant.id) {
                    const existingVariant = saveProduct.variants.find((v) => v.id === variant.id)
                    if (existingVariant) {
                        const updateVariant = await this.variantService.updateVariant(variant.id, variant)
                        updatedVariants.push(updateVariant)
                    }
                    else {
                        throw new BadRequestException(`Variant with ID ${variant.id} not found for update`)
                    }
                }
                else {
                    const newVariant = await this.variantService.createVariant(variant, saveProduct)
                    updatedVariants.push(newVariant)
                }
            }
            saveProduct.variants = updatedVariants
            await this.productsRepository.save(saveProduct)
        }

        if (productImageIds) {
            const newProductImageIds = productImageIds
            const oldProductImageIds = updateProduct.images.map((item) => item.id)
            const attachImageIds = newProductImageIds.filter(item => !oldProductImageIds.includes(item))
            const removeImageIds = oldProductImageIds.filter(item => !newProductImageIds.includes(item))
            if (attachImageIds && attachImageIds.length > 0) {
                for (let i = 0; i < newProductImageIds.length; i++) {
                    const imageId = newProductImageIds[i]
                    if (attachImageIds.includes(imageId)) {
                        await this.imageService.attachImageToProduct(
                            imageId,
                            saveProduct,
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
        return await this.productsRepository.findOne({ where: { id: saveProduct.id } })
    }
}


