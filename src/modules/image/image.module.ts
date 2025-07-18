import { Module } from '@nestjs/common';
import { ImageController } from './image.controller';
import { ImageService } from './image.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Image } from 'src/database/entities/image.entity';
import { CloudinaryModule } from '../storage/cloudinary/cloudinary.module';
@Module({
  imports: [
    TypeOrmModule.forFeature([Image]),
    CloudinaryModule
  ],
  controllers: [ImageController],
  providers: [ImageService],
  exports: [ImageService]
})
export class ImageModule { }
