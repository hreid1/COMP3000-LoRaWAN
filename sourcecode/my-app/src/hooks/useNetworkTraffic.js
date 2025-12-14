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
        setData([]);           
        setData2(false);       
        setFileUploaded(false);
        setLoading(false);
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
            setData(csv.data);
            // Optionally clear the file input so the same file can be selected again
            const input = document.getElementById('csvInput');
            if (input) input.value = '';
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
            setFileUploaded(true);
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