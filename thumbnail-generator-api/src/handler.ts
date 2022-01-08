import express from "express";
import multer from "multer";
import { Thumbnail } from "./thumbnail";

const thumbnail = new Thumbnail();

const imageFilter = (req: any, file: any, cb: any) => {
  console.log(`FILE -> ${JSON.stringify(file)}`);
  if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
    return cb(new Error("Only JPG and PNG formats are allowed"));
  }
  cb(null, true);
};

const upload = multer({ dest: "tmp/", fileFilter: imageFilter });

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false, limit: "5mb" }));

app.post(
  "/upload",
  upload.single("image"),
  thumbnail.generateThumbnail.bind(thumbnail)
);

app.listen(3000, () => {
  console.log("Server is up and running");
});
