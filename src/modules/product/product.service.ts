import { BadRequestException, ConflictException, Injectable, NotFoundException, Req } from '@nestjs/common';
import { CreateProductDto } from './dto/product/create-product.dto';
import { Product } from 'src/database/entities/product.entity';
import { Category } from 'src/database/entities/category.entity';
import { Brand } from 'src/database/entities/brand.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Like, Not, Repository, DataSource, EntityManager } from 'typeorm';
import { ImageService } from '../image/image.service';
import { ProductVariantService } from './product-variant.service';
import { ProductVariant } from 'src/database/entities/product-variant.entity';
import { UpdateProductDto } from './dto/product/update-product.dto';
import e, { Request } from 'express';
import { User } from 'src/database/entities/user.entity';
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
        private variantService: ProductVariantService,
        private dataSource: DataSource
    ) { }

    async findAllProduct(@Req() req: Request): Promise<Product[]> {
        const user: User = req.user as User
        const whereCondition: any = {}
        if (user.role.name === 'customer') {
            whereCondition.isLocked = false
        }
        const products = await this.productsRepository.find({ where: whereCondition, relations: ['variants', 'images'] })
        return products
    }

    async findProductById(id: string, req: Request): Promise<Product> {
        const user: User = req.user as User
        const whereCondition: any = {}
        if (user.role.name === 'customer') {
            whereCondition.isLocked = false
        }
        const product = await this.productsRepository.findOne({ where: { id, ...whereCondition } })
        if (!product) {
            throw new NotFoundException(`Product with ID ${id} is not found!`)
        }
        return product
    }

    async findProductsByCategory(id: string, req: Request): Promise<Product[]> {
        let products: Product[] = []
        const user: User = req.user as User
        const whereCondition: any = {}
        if (user.role.name === 'customer') {
            whereCondition.isLocked = false
        }
        const existingCategory = await this.categoriesRepository.findOne({ where: { id } })
        if (!existingCategory) {
            throw new NotFoundException(`Category with ID ${id} is not found!`)
        }
        products = await this.productsRepository.find({ where: { category: existingCategory, ...whereCondition } })
        return products
    }

    async findProductsByBrand(id: string, req: Request): Promise<Product[]> {
        let products: Product[] = []
        const user: User = req.user as User
        const whereCondition: any = {}
        if (user.role.name === 'customer') {
            whereCondition.isLocked = false
        }
        const existingBrand = await this.brandsRepository.findOne({ where: { id } })
        if (!existingBrand) {
            throw new NotFoundException(`Brand with ID ${id} is not found!`)
        }
        products = await this.productsRepository.find({ where: { brand: existingBrand, ...whereCondition } })
        return products
    }

    async searchProduct(searchName: string, req: Request): Promise<Product[]> {
        const user: User = req.user as User
        const whereCondition: any = {}
        if (user.role.name === 'customer') {
            whereCondition.isLocked = false
        }
        const products = await this.productsRepository.find({
            where: {
                name: ILike(`%${searchName}%`),
                ...whereCondition
            }
        })
        return products
    }

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

        return await this.dataSource.transaction(async (manager: EntityManager) => {
            try {
                const newProduct = manager.create(Product, {
                    name,
                    description,
                    basePrice,
                    gender,
                    brand: existingBrand,
                    category: existingCategory,
                })
                const saveProduct = await manager.save(Product, newProduct)
                if (productImageIds && productImageIds.length > 0) {
                    for (let i = 0; i < productImageIds.length; i++) {
                        const imageId = productImageIds[i]
                        await this.imageService.attachImageToProductTransaction(
                            manager,
                            imageId,
                            saveProduct,
                            i === 0,
                            i
                        )
                    }
                }

                const productVariants: ProductVariant[] = []
                if (variants && variants.length > 0) {
                    for (let i = 0; i < variants.length; i++) {
                        const variant = variants[i]
                        const newVariant: ProductVariant | null = await this.variantService.createVariantTransaction(manager, variant, saveProduct)
                        if (newVariant) {
                            productVariants.push(newVariant)
                        }
                    }
                }
                saveProduct.variants = productVariants
                const finalProduct = await manager.findOne(Product, {
                    where: { id: saveProduct.id },
                    relations: {
                        variants: true,
                        images: true,
                        brand: true,
                        category: true
                    }
                })
                return finalProduct
            }
            catch (error) {
                console.log("error: ", error)
                throw error
            }
        })
    }

    async updateProduct(productData: UpdateProductDto, id: string): Promise<Product | null> {
        const { name, brandId, categoryId, productImageIds, variants, ...restData } = productData
        console.log("PRODUCT REST DATA: ", restData)
        const updateProduct = await this.productsRepository.findOne({ where: { id }, relations: ['variants', 'images'] })
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
        if (name !== undefined) {
            const existingProduct = await this.productsRepository.findOne({ where: { name: name, id: Not(id) } })
            if (existingProduct) {
                throw new ConflictException("This product have already exist!")
            }
            updateProduct.name = name
        }
        updateProduct.brand = existingBrand
        updateProduct.category = existingCategory
        return await this.dataSource.transaction(async (manager: EntityManager) => {
            try {
                const saveProduct = await manager.save(Product, {
                    ...updateProduct,
                    ...restData
                })
                const updatedVariants: ProductVariant[] = []
                if (variants) {
                    const currentVariantIds = updateProduct.variants.map(v => v.id)
                    const incomingVariantIds = variants.filter(v => v.id).map(v => v.id!)

                    const variantsToDeleteIds = currentVariantIds.filter((id) => !incomingVariantIds.includes(id))
                    for (const variantId of variantsToDeleteIds) {
                        await this.variantService.deleteVariant(variantId)
                    }
                    for (const variant of variants) {
                        if (variant.id) {
                            const existingVariant = updateProduct.variants.find((v) => v.id === variant.id)
                            if (existingVariant) {
                                const updateVariant = await this.variantService.updateVariantTransaction(manager, variant.id, variant)
                                updatedVariants.push(updateVariant)
                            }
                            else {
                                throw new BadRequestException(`Variant with ID ${variant.id} not found for update`)
                            }
                        }
                        else {
                            const newVariant: ProductVariant | null = await this.variantService.createVariantTransaction(manager, variant, saveProduct)
                            if (newVariant) {
                                updatedVariants.push(newVariant)
                            }
                        }
                    }
                    saveProduct.variants = updatedVariants
                    await manager.save(Product, saveProduct)
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
                                await this.imageService.attachImageToProductTransaction(
                                    manager,
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
                return await manager.findOne(Product, {
                    where: { id: saveProduct.id },
                    relations: {
                        images: true,
                        variants: true,
                        brand: true,
                        category: true
                    }
                })
            }
            catch (error) {
                console.log("Update product error: ", error)
                throw error
            }
        })
    }

    async deleteProduct(id: string): Promise<{ message: string }> {
        const deleteProduct = await this.productsRepository.findOne({
            where: { id }
        })
        if (!deleteProduct) {
            throw new NotFoundException(`Product with ID ${id} is not found!`)
        }
        await this.productsRepository.remove(deleteProduct)
        return {
            message: "Delete product successfully!"
        }
    }
}


