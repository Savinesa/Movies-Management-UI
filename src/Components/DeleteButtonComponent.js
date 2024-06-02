import React from 'react';
import '../App.css'

function DeleteButtonComponent({deleteAllMovies}) {
    return (
        <div>
           
            <button style={{ backgroundColor: 'red' }} className="button" onClick={() => {
                        if (window.confirm('Are you sure you want to delete ALL movies? This action cannot be undone.')) {
                            deleteAllMovies();
                        }
                    }} >Delete All Records</button>
        </div>
    );

}
export default DeleteButtonComponent;
