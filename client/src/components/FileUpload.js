import React, { Fragment, useState } from 'react'
import axios from 'axios';

export const FileUpload = () => {
    const [file, setFile] = useState({});
    const [fileName, setFilename] = useState('Choose file');
    const [uploadedFile, setUploadedFile] = useState({})
    
    const onChange = (e) => {
        console.log(e.target.files);
        setFile(e.target.files[0]);
        setFilename(e.target.files[0].name);
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await axios.post('/upload', formData, {
                
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.log(res);
            const { fileName, filePath } = res.data;

            setUploadedFile({ fileName, filePath });
        }catch(err) {
            // console.log("resp"+JSON.stringify(err.response));
            if(err.response.status === 500){
                console.log('There was a problem with the server');
            }else{
                console.log(err.response.data.msg);
            }
        }
    }
    return (
        <Fragment>
            <form onSubmit={onSubmit}>
                <div className="custom-file mb-4">
                    <input 
                        type="file" 
                        className="custom-file-input" 
                        id="customFile"
                        onChange={onChange} 
                    />
                    <label className="custom-file-label" htmlFor="customFile">{fileName}</label>
                </div>
                <input 
                    type="submit" 
                    value="upload" 
                    className="btn btn-primary btn-block mt-4" 
                />
            </form>
            { uploadedFile ? 
                <div className="row mt-5">
                    <h3 className="text-center">{ uploadedFile.fileName }</h3>
                    <img style={{ width: '100%' }} src={uploadedFile.filePath} alt="" />
                </div> 
                : null
            }
        </Fragment>
    )
}

export default FileUpload;