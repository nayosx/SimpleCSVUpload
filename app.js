const multer = require('multer');
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const app = express();
const port = 3000;

global.__basedir = __dirname;

let uploads = __dirname + '/uploads';
if (!fs.existsSync(uploads)) {
    console.log('trying for create the directory "upload"');
    fs.mkdirSync(uploads);
}

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
            console.log('File upload');
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


require('dns').lookup(require('os').hostname(), (err, add, fam) => {
    console.log('addr: ' + add);
});

app.listen(port, '0.0.0.0', () => {
    console.log(`App listening port ${port}`);
});