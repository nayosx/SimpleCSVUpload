const multer = require('multer');
const express = require('express');
const cors = require('cors');
const app = express();
const path = require('path');
const port = 3000;

global.__basedir = __dirname;

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, __basedir + '/uploads/');
    },
    filename: (req, file, callback) => {
        callback(null, file.fieldname + "-" + Date.now() + "-" + file.originalname);
    }
});

const filterCSV = (req, file, callback) => {
    let ext = path.extname(file.originalname);
    if(ext === '.csv') {
        callback(null, true);
    } else {
        callback('File format is not a CSV', false);
    }
}

const upload = multer({
    storage: storage,
    fileFilter: filterCSV
});

app.use(cors())

app.post('/upload/', upload.single('uploadFile'), (req, res) => {
    try{
        if(req.file == undefined) {
            res.status(400).send({
                message: "Please upload a CSV file: "
            });
        } else {
            res.status(200).send({
                message: "File Upload: "
            });
        }
    } catch(error) {
        res.status(500).send({
            message: "Could not upload the file: " + req.file.originalname
        });
    }
});

app.get('/upload/', (req, res) => {
    res.send("Hello from Node") ;
});


app.listen(port, '0.0.0.0', () => {
    console.log(`App listening port ${port}`);
});