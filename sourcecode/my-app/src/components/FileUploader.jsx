import { useState } from "react"
import axios from "axios";

const FileUpload = () => {
    const [file, setFile] = useState(null)

    const onFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const onFileUpload = () => {
        const formData = new FormData();
        formData.append(
            "myFile",
            file,
            file.name
        );
        console.log(file)
        axios.post("http://localhost:8000/lorawan/test/", formData)
    };
    
    const fileData = () => {
        if (file) {
            return(
                <div>
                    <h2>File Details</h2>
                    <p>File Name: {file.name}</p>
                    <p>File Type: {file.type}</p>
                </div>
            )
        } else {
            return(
                <div>

                </div>
            )
        }
    }

    return (
        <div>
            <input type="file" onChange={onFileChange} />
            <button onClick={onFileUpload}>Upload</button>
            {fileData()}
        </div>
    )
}

export default FileUpload