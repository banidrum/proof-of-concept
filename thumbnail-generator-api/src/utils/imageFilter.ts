const imageFilter = (req: any, file: any, cb: any) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
    return cb(new Error("Only JPG and PNG formats are allowed"));
  }
  cb(null, true);
};

export { imageFilter };
