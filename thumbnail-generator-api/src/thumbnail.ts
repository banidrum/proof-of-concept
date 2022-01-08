import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { Request, Response } from "express";
import sharp, { OutputInfo } from "sharp";
const s3Client = new S3Client({ region: "us-east-1" });

export class Thumbnail {
  private s3Client: S3Client;

  constructor() {
    this.s3Client = new S3Client({ region: "us-east-1" });
  }

  public async generateThumbnail(req: Request, res: Response) {
    // console.log(`REQ OBJECT -> ${req.body}`);

    // E se aqui dentro eu chamar 3 funções assíncronas e usar um Promise.all?

    const image = req.file?.path;

    const resizedImages = await this.resizeImage(image);

    this.uploadToS3(resizedImages);

    res.json("Image uploaded succesfully");
  }

  private async resizeImage(image: any, res?: Response) {
    // console.log(`IMAGEM -> ${JSON.stringify(image)}`);
    try {
      // await sharp(image)
      //   .resize(400, 300)
      //   .resize(160, 120)
      //   .resize(120, 120)
      //   .toFile("output.jpeg");

      //Mudar o nome desse array
      const sizes = [
        {
          path: "large.jpg",
          x: 400,
          y: 300,
        },
        {
          path: "medium.jpg",
          x: 160,
          y: 120,
        },
        {
          path: "small.jpg",
          x: 120,
          y: 120,
        },
      ];

      const resizedImages = await Promise.all(
        sizes.map((size) => {
          return sharp(image).resize(size.x, size.y).toFile(size.path);
        })
      );

      console.log(resizedImages);

      return resizedImages;
    } catch (error) {
      res?.status(400).json("An error occurred when resizing images");
    }

    //Retornar um array com as imagens?
  }

  private async uploadToS3(images: OutputInfo[] | undefined) {
    // Função pra enviar as imagens pro S3
    const s3BucketParams = { Bucket: "", Key: "", Body: "" };

    try {
      const data = await s3Client.send(new PutObjectCommand(s3BucketParams));
    } catch (err) {
      return "";
    }
  }
}
