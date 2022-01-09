import { Thumbnail } from "../src/thumbnail";
import { Request, Response } from "express";
import {
  SUCCESFULL_THUMBNAIL_GENERATION,
  REQUEST_IMAGE_FILE,
} from "./mocks/responses";
const thumbnail = new Thumbnail();
const request = { file: REQUEST_IMAGE_FILE };
const failedRequest = { file: { path: "" } };
const response: Partial<Response> = {
  status: jest.fn().mockImplementation((status: number) => response),
  json: jest.fn().mockImplementation((parameters: any) => parameters),
};

describe("This suite tests the thumbnail generation feature", () => {
  beforeAll((done) => {
    done();
  });

  afterAll((done) => {
    done();
  });

  it("Should generate the thumbnail succesfully", async () => {
    const generateThumbnailSpy = jest.spyOn(thumbnail, "generateThumbnail");

    const result = await thumbnail.generateThumbnail(
      request as Request,
      response as Response
    );

    expect(generateThumbnailSpy).toHaveBeenCalled();
    expect(result).toStrictEqual(SUCCESFULL_THUMBNAIL_GENERATION);
  });

  it("Should return an error when the thumbnail generation fails", async () => {
    try {
      const generateThumbnailSpy = jest.spyOn(thumbnail, "generateThumbnail");

      await thumbnail.generateThumbnail(
        failedRequest as Request,
        response as Response
      );

      generateThumbnailSpy.mockImplementation(() => {
        throw new Error();
      });
    } catch (error: any) {
      expect(error).toEqual(new Error());
    }
  });
});
