import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary'
import { CloudinaryResponse } from './cloudinary-response';
@Injectable()
export class CloudinaryService {
    async uploadFile(file: Express.Multer.File): Promise<CloudinaryResponse> {
        return new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream(
                { folder: 'ecommerce-be' },
                (error, result) => {
                    if (error) return reject(error)
                    resolve(result)
                }
            ).end(file.buffer)
        })
    }

    async deleteFile(publicID: string): Promise<any> {
        return new Promise((resolve, reject) => {
            cloudinary.uploader.destroy(publicID,
                (error, result) => {
                    if (error) return reject(error)
                    resolve(result)
                }
            )
        })
    }
}
