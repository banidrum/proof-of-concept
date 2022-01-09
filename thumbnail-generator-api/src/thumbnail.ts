import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { NextFunction, Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import sharp, { OutputInfo } from "sharp";
const s3Client = new S3Client({ region: "us-east-1" });

export class Thumbnail {
  private s3Client: S3Client;

  constructor() {
    this.s3Client = new S3Client({ region: "us-east-1" });
  }

  public async generateThumbnail(req: Request, res: Response) {
    try {
      const image = req.file?.path;

      const resizedImages = await this.resizeImage(image, res);

      this.uploadToS3(resizedImages, res);

      return res.status(200).json("Images uploaded succesfully");
    } catch (error) {
      return res
        .status(400)
        .json("An error occurred when uploading the images");
    }
  }

  private async resizeImage(image: any, res?: Response) {
    const sizes = [
      {
        x: 400,
        y: 300,
      },
      {
        x: 160,
        y: 120,
      },
      {
        x: 120,
        y: 120,
      },
    ];

    const resizedImages = await Promise.all(
      sizes.map((size) => {
        return sharp(image).toFormat("png").resize(size.x, size.y).toBuffer();
      })
    );

    return resizedImages;
  }

  private async uploadToS3(images: any, res?: Response) {
    try {
      for (const resizedImage of images) {
        const s3BucketParams = {
          Bucket: "bucketnail",
          Key: `thumbnail/${uuidv4()}.png`,
          Body: resizedImage,
          ContentType: "image",
        };
        const data = await s3Client.send(new PutObjectCommand(s3BucketParams));
      }
    } catch (err) {
      return res?.status(400).json("An error occurred when uploading to S3");
    }
  }
}
