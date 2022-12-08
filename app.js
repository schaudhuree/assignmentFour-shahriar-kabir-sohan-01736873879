const express = require('express')
const app = express()
const path = require('path')
const multer = require('multer')
// For parsing application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
// middlewares
app.use(express.json())
// 1. make a POST API with URL Query ,Body & Header properties 
app.post('/', (req, res) => {
  // req query part
  const name = req.query.name;

  // req header  part
  const email = req.header('email');
  const password = req.header('password');

  // req body part

  // json data passed from body 
  //   {
  //     "age": 27,
  //     "gender":"Male"
  // }
  const { age, gender } = req.body;

  const data = {
    name,
    email,
    password,
    age,
    gender
  }

  res.status(200).json({status:"success",data:data});
});

// 2. upload assignment: create an api that can only upload image file with jpg and png format 
// uploaded path
const UPLOAD_PATH = './uploads'
// static file
app.use(express.static(path.join(__dirname, './public')))

// storage path: file name
const storage = multer.diskStorage({
  // set the destination
  destination: (req, file, cb) => {
    cb(null, UPLOAD_PATH);
  },
  // generate a nice file name
  filename: (req, file, cb) => {
    console.log("▶ ➡ file: app.js:35 ➡ file", file);
    //note: we will get: fieldname,originalname,encoding,mimeType 
    // get the file extension
    const fileExtension = path.extname(file.originalname);
    // generate file name
    const fileName =
      file.originalname
        .replace(fileExtension, "")  //replace the extension with black
        .toLowerCase() //lowarcase the name
        .split(" ") //split accordint to the space and convert into array
        .join("-") +  //join them using dash
      "-" +
      Math.floor((Math.random() * 100) + 1)

    cb(null, fileName + fileExtension); //return the callback and proper file name
  },
});


// upload middleware
var upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {

    // support fileType only png and jpg
    if (
      file.mimetype === "image/png" ||
      file.mimetype === "image/jpg"
    ) {
      cb(null, true);
    } else {
      cb(new Error("Only .jpg or .png  format allowed!"));
    }
  },
});

app.post('/upload', upload.single('imgNameFromInputField'), (req, res) => {

  res.send('Uploaded')
})



// 3. downlad api create 
app.get('/download', (req, res) => {
res.download('./file/image.jpg')
})
app.listen(5000, () => console.log('server is running on port 5000'))