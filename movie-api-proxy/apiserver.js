const express = require('express');
const cors = require('cors');
const multer = require('multer');
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;
const API_BASE_URL = process.env.API_BASE_URL || 'https://localhost:44383/api';
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'; // added this to be able to call https api with self signed certificate

app.use(cors());
app.use(express.json());

// Get All API
app.get('/movies', async (req, res) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/Movies`);
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching movies:', error.message);
        res.status(500).send('Error fetching movies');
    }
});

// Search API
app.get('/movies/search', async (req, res) => {
    const { query } = req.query;
    try {

        const response = await axios.get(`${API_BASE_URL}/movies/search?query=${query}`);
        console.log(response.data);
        res.json(response.data);
    } catch (error) {
        console.error('Error searching movies:', error.message);
        res.status(500).send('Error searching movies');
    }
});

// Delete All Api
app.delete('/movies/deleteAll', async (req, res) => {
    try {
        process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'; // added this to be  able to call https api with self signed certificate

        const response = await axios.delete(`${API_BASE_URL}/movies/DeleteAll`);
        console.log(response.data);
        res.json(response.data);
    } catch (error) {
        console.error('Error deleting movies:', error.message);
        res.status(500).send('Error deleting movies');
    }
});

// Setup multer for file storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/') 
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
});

const upload = multer({ storage: storage });

// Upload File Api
app.post('/api/movies/upload', upload.single('file'), async (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    const formData = new FormData();
    formData.append('file', fs.createReadStream(req.file.path), req.file.filename);

    try {
        const response = await axios.post('https://localhost:44383/api/Movies/upload', formData, {
            headers: {
                ...formData.getHeaders(),
            },
        });
        // This deletes the file from my server after sendig it to the api
        fs.unlinkSync(req.file.path);
        res.send('File uploaded and processed successfully.');
    } catch (error) {
        console.error('Failed to forward file:', error);
        fs.unlinkSync(req.file.path);
        res.status(500).send('Failed to process file');
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
