import React, { useState } from 'react';
import axios from 'axios';
import '../App.css';

function FileImportComponent({onFileUpload }) {
    const [file, setFile] = useState(null); 
    const [uploading, setUploading] = useState(false); 

    const handleFileChange = (event) => {
        setFile(event.target.files[0]); 
    };

    const handleUpload = async () => {
      if (!file) {
          alert('Please select a file to upload.'); 
          return;
      }

      const formData = new FormData();  
      formData.append('file', file);  


      setUploading(true); // to indicate that upload started
      try {
          const response = await axios.post('http://localhost:3001/api/movies/upload', formData);
          alert('File uploaded successfully');
          onFileUpload(); 
          console.log(response.data); 
      } catch (error) {
          console.error('Error uploading file:', error);
          alert('Error uploading file');
          if (error.response) {
              console.error('Detailed error:', error.response.data);
          }
      }
      setUploading(false);  

      
    };



    return (
        <div  className="import-container">
            <input type="file" onChange={handleFileChange} accept=".csv" />
            <button className="button" onClick={handleUpload} disabled={uploading}>
                {uploading ? 'Uploading...' : 'Upload File'} 
            </button>
        </div>
    );
}


export default FileImportComponent;
