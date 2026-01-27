const DisplayFile = ({ file }) => {

    if (!file) {
        return <div>No File selected</div>
    }
    else {
        console.log(file)
    }
    
    return(
        <>
            <h2>File Details</h2>
            <p>File Name: {file.name}</p>
            <p>File Type: {file.type}</p>
            <p>File Size: {file.size}</p>
        </>
    )
}

export default DisplayFile;