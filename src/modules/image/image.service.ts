import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CloudinaryService } from '../storage/cloudinary/cloudinary.service';
import { Image } from 'src/database/entities/image.entity';
import { Repository } from 'typeorm';
import { Product } from 'src/database/entities/product.entity';
import { ProductVariant } from 'src/database/entities/product-variant.entity';
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
    async attachImageToProduct(imageId: string, product: Product, isThumbnail: boolean, order: number) {
        const image = await this.imagesRepository.findOne({ where: { id: imageId } })
        if (!image) {
            throw new NotFoundException(`Image with ID ${imageId} is not found!`)
        }
        image.isThumbnail = isThumbnail ? isThumbnail : false
        image.order = order ? order : 0
        image.product = product
    }
    async attachImageToVariant(imageId: string, variant: ProductVariant, isThumbnail: boolean, order: number) {
        const image = await this.imagesRepository.findOne({ where: { id: imageId } })
        if (!image) {
            throw new NotFoundException(`Image with ID ${imageId} is not found!`)
        }
        image.isThumbnail = isThumbnail ? isThumbnail : false
        image.order = order ? order : 0
        image.product_variant = variant
    }
}
