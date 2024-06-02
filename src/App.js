import React, { useState, useEffect } from 'react';
import './App.css';
import DataTableComponent from './Components/DataTableComponent';
import SearchComponent from './Components/SearchComponent';
import DeleteButtonComponent from './Components/DeleteButtonComponent';
import FileImportComponent from './Components/FileImportComponent';
import axios from 'axios';

function App() {
    const [movies, setMovies] = useState([]);  // State to hold movies

    // Function to fetch all movies
    const fetchMovies = async () => {
        try {
            const response = await axios.get('http://localhost:3001/movies');  // Adjust this to match your actual endpoint for fetching all movies
            setMovies(response.data);
        } catch (error) {
            console.error('Error fetching all movies:', error);
        }
    };

    const deleteAllMovies = async () => {
      if (movies.length === 0) {
        alert('No movies to delete.');
        return;
      } else{
        try {
          await axios.delete('http://localhost:3001/movies/deleteall');
          setMovies([]);  // Clear the movies state as all movies are deleted
          alert('All movies have been deleted successfully.');
      } catch (error) {
          console.error('Failed to delete movies:', error);
          alert('Failed to delete all movies.');
      }
      }
  };

  const handleFileUpload = () => {
    fetchMovies(); // Refresh the movies list after a file upload
  };

    // Load all movies initially
    useEffect(() => {
        fetchMovies();
    }, []);

    return (
        <div className="App">
                  <div className="controls-container">
                  <SearchComponent setMovies={setMovies} fetchMovies={fetchMovies} />
                  <DeleteButtonComponent deleteAllMovies={deleteAllMovies} />

</div>
            <FileImportComponent onFileUpload={handleFileUpload}/>
            <DataTableComponent movies={movies} />
        </div>
    );
}

export default App;
