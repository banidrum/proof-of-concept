import express from "express";
import multer from "multer";
import serverles from "serverless-http";
import { Thumbnail } from "./thumbnail";
import { imageFilter } from "./utils/imageFilter";

const thumbnail = new Thumbnail();

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

// module.exports.handler = serverles(app);
