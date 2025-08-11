import { Controller, Get, Post, Query, SerializeOptions, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { ImageService } from './image.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { ImageResponseDto } from './dto/image-response.dto';
import { plainToInstance } from 'class-transformer';
@Controller('images')
@SerializeOptions({
    excludeExtraneousValues: true
})
export class ImageController {
    constructor(private imageService: ImageService) { }

    @Post('upload')
    @UseInterceptors(FilesInterceptor('files', 10, { storage: memoryStorage() }))
    async uploadFile(
        @UploadedFiles() files: Array<Express.Multer.File>
    ): Promise<{ id: string, url: string, publicId: string }[]> {
        const uploadImages: { id: string, url: string, publicId: string }[] = []
        for (const file of files) {
            const image: any = await this.imageService.uploadFileAndCreateEntity(file)
            uploadImages.push({
                id: image.id,
                url: image.url,
                publicId: image.publicId
            })
        }
        return uploadImages
    }

    // show images base on producr || variant || nothing
    @Get('')
    async getImagesByOwner(@Query('owner') owner: string): Promise<ImageResponseDto[]> {
        const images = await this.imageService.getImagesByOwner(owner)
        return plainToInstance(ImageResponseDto, images)
    }
}
