import { useState } from 'react';
import axios from 'axios';
import Papa from 'papaparse';

export default function useNetworkTraffic() {
    const [data, setData] = useState([]);
    const [error, setError] = useState("");
    const [file, setFile] = useState("");
    const [loading, setLoading] = useState(false);
    const [data2, setData2] = useState(false);
    const allowedExtensions = ["csv"];
    const [fileUploaded, setFileUploaded] = useState(false);

    const handleFileChange = (e) => {
        setError("");
        if (e.target.files.length) {
            const inputFile = e.target.files[0];
            const fileName = inputFile.name;
            const fileExtension = fileName.slice(((fileName.lastIndexOf(".") - 1) >>> 0) + 2).toLowerCase();
            if (!allowedExtensions.includes(fileExtension)){
                setError("Input a csv file");
                return;
            }
            setFile(inputFile);
        }
    }

    const handleParse = () => {
        if (!file) return alert("Enter a valid file");
        const reader = new FileReader();
        reader.onload = async({ target }) => {
            const csv = Papa.parse(target.result, {
                header: true,
                skipEmptyLines: true,
            });
            setData(csv.data)
        };
        reader.readAsText(file);
    };

    const model = async () => {
        setLoading(true);
        setError("");
        if (!file) {
            setError("Please select a CSV file first");
            setLoading(false);
            return;
        }
        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await axios.post(
                "http://127.0.0.1:8000/api/run/",
                formData,
                { headers: { "Content-Type": "multipart/form-data" }}
            );
            setData2(response.data);
            setFileUploaded(true); // Set fileUploaded to true after successful upload
        } catch (error) {
            setError("Error loading model");
            console.error(error);
        } finally {
            setLoading(false)
        }
    };

    return {
        data, 
        error,
        file,
        loading,
        data2,
        fileUploaded,
        handleFileChange,
        handleParse,
        model,
    };

}