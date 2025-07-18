import { Controller, Post, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { ImageService } from './image.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
@Controller('images')
export class ImageController {
    constructor(private imageService: ImageService) { }

    @Post('upload')
    @UseInterceptors(FileInterceptor('files', { storage: memoryStorage() }))
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
}
