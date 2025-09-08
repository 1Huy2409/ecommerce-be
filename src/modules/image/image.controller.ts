import { Controller, Get, Post, Query, SerializeOptions, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { ImageService } from './image.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { ImageResponseDto } from './dto/image-response.dto';
import { plainToInstance } from 'class-transformer';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
@ApiTags('Image')
@ApiBearerAuth()
@Controller('images')
@SerializeOptions({
    excludeExtraneousValues: true
})
export class ImageController {
    constructor(private imageService: ImageService) { }

    @Post('upload')
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                files: {
                    type: 'array',
                    items: {
                        type: 'string',
                        format: 'binary',
                    }
                },
            },
        },
    })
    @ApiOperation({ summary: 'Upload file (image, video)' })
    @ApiResponse({ status: 201, description: 'Upload file successfully!' })
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

    @Get('')
    @ApiOperation({ summary: 'Manage images base on owner' })
    @ApiResponse({ status: 200, description: 'Show image base on owner successfully!' })
    async getImagesByOwner(@Query('owner') owner: string): Promise<ImageResponseDto[]> {
        const images = await this.imageService.getImagesByOwner(owner)
        return plainToInstance(ImageResponseDto, images)
    }
}
