import React, { Fragment, useState } from 'react'
import axios from 'axios';
import Message from './Message';
import Progress from './Progress'

export const FileUpload = () => {
    const [file, setFile] = useState('');
    const [fileName, setFilename] = useState('Choose file');
    const [uploadedFile, setUploadedFile] = useState('');
    const [message, setMessage] = useState('');
    const [uploadPercentage, setUploadPercentage] = useState(0);
    
    const onChange = (e) => {
        // console.log(e.target.files);
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
                },
                onUploadProgress: (progressEvent) => {
                    // console.log(progressEvent);
                    setUploadPercentage(
                        parseInt(
                            Math.round((progressEvent.loaded * 100) / progressEvent.total)
                        )
                    )

                    //clear percentage
                    setTimeout(() => setUploadPercentage(0), 10000);
                }
            });
            // console.log(res);
            const { fileName, filePath } = res.data;

            setUploadedFile({ fileName, filePath });
            setMessage('File Uploaded');
        }catch(err) {
            // console.log("resp"+JSON.stringify(err.response));
            if(err.response.status === 500){
                setMessage('There was a problem with the server');
            }else{
                setMessage(err.response.data.msg);
            }
        }
    }
    return (
        <Fragment>
            {message ? <Message msg={ message }/> : null}
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

                <Progress percentage={uploadPercentage} />

                <input 
                    type="submit" 
                    value="upload" 
                    className="btn btn-primary btn-block mt-4" 
                />
            </form>
            {/* {console.log(uploadedFile)} */}
            { uploadedFile ? 
                <div className='row mt-5'>
                <div className='col-md-6 m-auto'>
                  <h3 className='text-center'>{uploadedFile.fileName}</h3>
                  <img style={{ width: '100%' }} src={uploadedFile.filePath} alt='' />
                </div>
              </div>
                : null
            }
        </Fragment>
    )
}

export default FileUpload;