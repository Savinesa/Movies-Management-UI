import React, { useState } from 'react';
import axios from 'axios';

function SearchComponent({ setMovies, fetchMovies }) {
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSearch = async () => {
        if (!query) {
            fetchMovies(); 
        }else{

            setLoading(true);
            setError('');
            try {
                const response = await axios.get(`http://localhost:3001/movies/search?query=${query}`);
                setMovies(response.data);  
            } catch (err) {
                setError('Failed to fetch results');
                console.error(err);
            }
            setLoading(false);
        }
    };

    return (
        <div>
            <input
                type="text"
                placeholder="Search for movies..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={(event) => {
                    if (event.key === "Enter") {
                        handleSearch();
                    }
                }}
            />
            <button className="button" onClick={handleSearch} disabled={loading}>Search</button>
            {loading && <p>Loading...</p>}
            {error && <p>{error}</p>}
        </div>
    );
}

export default SearchComponent;
