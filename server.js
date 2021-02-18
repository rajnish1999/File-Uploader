const path = require('path');
const express = require('express');
const fileUpload = require('express-fileupload');

const app = express();

app.use(express.urlencoded({extended: true}));
app.use(express.json());


app.use(fileUpload());

const publicPath = path.join(__dirname, './client/public');

app.use(express.static(publicPath));

app.get('*', (req, res) => {
    res.sendFile(path.join(publicPath, 'index.html'));
})

//Upload Endpoint
app.post('/upload', (req, res) => {
    // console.log(req.files);
    // console.log(req.data);

    if(req.files === null){
        return res.status(400).json({msg: 'No file uploaded'});
    }

    const file = req.files.file;

    file.mv(`${__dirname}/client/public/uploads/${file.name}`, (err) => {
        if(err) {
            
            return res.status(500).send(err);
        }

        res.json({ fileName: file.name, filePath: `/uploads/${file.name}`});
    })
    
})

const port = process.env.PORT || 3500;

app.listen(port, () => {
    console.log(`server started at: localhost:${port}`);
})