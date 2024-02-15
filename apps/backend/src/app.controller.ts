import { Body, Controller, Post } from '@nestjs/common';
import { Public } from './decorators/public.decorator';
import { UploaderService } from './uploader/uploader.service';

@Controller('image')
export class AppController {
  constructor(private uploader: UploaderService) {}

  @Post('/s3_download')
  @Public()
  async s3Download(@Body() data: { user_id: number }) {
    const tmp = await this.uploader.getPreSignedURLToViewObject(
      process.env.S3_BUCKET_NAME,
      `profile_image/${data.user_id}.png`,
    );

    const data_downloaded = await fetch(tmp);
    console.log('data_downloaded: ', data_downloaded);

    const serialized_data = await data_downloaded.arrayBuffer();
    const base64 = Buffer.from(serialized_data).toString('base64');

    return base64;
  }

  @Post('/s3_upload')
  @Public()
  async s3Upload(
    @Body() data: { user_id: number; profile_photo_in_base64: string },
  ) {
    const tmp = await this.uploader.uploadFileToS3(
      process.env.S3_BUCKET_NAME,
      `profile_image/${data.user_id}.png`,
      data.profile_photo_in_base64,
    );

    return 'ok';
  }
}
