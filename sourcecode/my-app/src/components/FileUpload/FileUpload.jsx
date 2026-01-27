import { useState } from "react"
import axios from "axios";

// Recieved file from dashboard named file
const FileUpload = ({ file }) => {

    const onFileUpload = () => {
        if (!file) {
            console.error("no file")
            return;
        }

        const formData = new FormData();
        formData.append(
            "myFile",
            file,
            file.name
        );
        axios.post("http://localhost:8000/lorawan/test/", formData)
    };
    
    return (
        <div>
            <button onClick={onFileUpload} disabled={!file}>Upload</button>
        </div>
    )
}

export default FileUpload