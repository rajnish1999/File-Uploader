const express = require('express');
const fileUpload = require('express-fileupload');

const app = express();

app.use(fileUpload);

//Upload Endpoint
app.post('/upload', (req, res) => {
    if(req.files === null){
        return res.status(400).json({msg: 'No file uploaded'});
    }

    const file = req.files.file;

    file.mv(`${__dirname}/client/public/uploads/${file.name}`, (err) => {
        if(err) {
            console.log(err);
            return res.status(500).send(err);
        }

        res.json({ fileName: file.name, filePath: `/uploads/${file.name}`});
    })
})

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`server started at: localhost:${port}`);
})