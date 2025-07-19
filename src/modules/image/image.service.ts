import { InjectRepository } from '@nestjs/typeorm';
import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CloudinaryService } from '../storage/cloudinary/cloudinary.service';
import { Image } from 'src/database/entities/image.entity';
import { DeleteResult, Repository } from 'typeorm';
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
        if (image.product || image.product_variant) {
            throw new ConflictException("This image has its owner")
        }
        image.isThumbnail = isThumbnail
        image.order = order ? order : 0
        image.product = product
        const savedImage = await this.imagesRepository.save(image)
        console.log(savedImage)
    }
    async attachImageToVariant(imageId: string, variant: ProductVariant, isThumbnail: boolean, order: number) {
        const image = await this.imagesRepository.findOne({ where: { id: imageId } })
        if (!image) {
            throw new NotFoundException(`Image with ID ${imageId} is not found!`)
        }
        if (image.product || image.product_variant) {
            throw new ConflictException("This image has its owner")
        }
        image.isThumbnail = isThumbnail ? isThumbnail : false
        image.order = order ? order : 0
        image.product_variant = variant
        await this.imagesRepository.save(image)
    }
    async removeImageFromProduct(imageId: string) {
        const result: DeleteResult = await this.imagesRepository.delete({ id: imageId })
        if (result.affected === 0) {
            throw new NotFoundException(`Image with ID ${imageId} not found!`)
        }
    }
}
