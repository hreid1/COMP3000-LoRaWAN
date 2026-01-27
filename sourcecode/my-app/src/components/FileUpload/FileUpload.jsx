import { useState } from "react"
import axios from "axios";

const FileUpload = ({ onFileSelected }) => {
    const [file, setFile] = useState(null)

    const onFileChange = (event) => {
        const selectedFile = event.target.files[0];
        setFile(selectedFile);
        if (onFileSelected) {
            onFileSelected(selectedFile);
        }
    };

    const onFileUpload = () => {
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
            <input type="file" onChange={onFileChange} />
            <button onClick={onFileUpload}>Upload</button>
        </div>
    )
}

export default FileUpload