import { Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk';

@Injectable()
export class UploaderService {
  constructor() {}

  async getPreSignedURL(bucketName: string, key: string, contentType: string) {
    const region = process.env.AWS_BUCKET_REGION;
    const accessKey = process.env.AWS_ACCESS_KEY;
    const secretKey = process.env.AWS_SECRET_KEY;

    try {
      const s3 = new S3({
        region,
        accessKeyId: accessKey,
        secretAccessKey: secretKey,
      });

      const params = {
        Bucket: bucketName,
        Key: key,
        ContentType: contentType,
        Expires: 1800,
      };

      return await s3.getSignedUrlPromise('putObject', params);
    } catch (error) {
      console.log(error);
    }
  }

  async getPreSignedURLToViewObject(bucketName: string, key: string) {
    const region = process.env.AWS_BUCKET_REGION;
    const accessKey = process.env.AWS_ACCESS_KEY;
    const secretKey = process.env.AWS_SECRET_KEY;

    try {
      const s3 = new S3({
        region,
        accessKeyId: accessKey,
        secretAccessKey: secretKey,
      });

      const params = {
        Bucket: bucketName,
        Key: key,
        Expires: 300,
      };

      return await s3.getSignedUrlPromise('getObject', params);
    } catch (error) {
      console.log(error);
    }
  }

  async uploadFileToS3(
    bucketName: string,
    key: string,
    file_in_base64_string: string,
  ) {
    const region = process.env.AWS_BUCKET_REGION;
    const accessKey = process.env.AWS_ACCESS_KEY;
    const secretKey = process.env.AWS_SECRET_KEY;

    try {
      const s3 = new S3({
        region,
        accessKeyId: accessKey,
        secretAccessKey: secretKey,
      });

      const base64Data = Buffer.from(file_in_base64_string, 'base64');

      const params = {
        Bucket: bucketName,
        Key: key,
        Body: base64Data,
        ContentEncoding: 'base64',
        ContentType: 'image/jpeg',
      };

      return await s3.upload(params).promise();
    } catch (error) {
      console.log(error);
    }
  }

  async deleteFileFromS3(bucketName: string, key: string) {
    const region = process.env.AWS_BUCKET_REGION;
    const accessKey = process.env.AWS_ACCESS_KEY;
    const secretKey = process.env.AWS_SECRET_KEY;

    try {
      const s3 = new S3({
        region,
        accessKeyId: accessKey,
        secretAccessKey: secretKey,
      });

      const params = {
        Bucket: bucketName,
        Key: key,
      };

      console.log('Made it through delete function');

      return await s3.deleteObject(params).promise();
    } catch (error) {
      console.log('Error deleting profile picture: ', error);
    }
  }
}
