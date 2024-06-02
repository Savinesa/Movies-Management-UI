import React, { useMemo, useEffect, useState } from 'react';
import { useTable, usePagination } from 'react-table';
import '../App.css';
import axios from 'axios';

function DataTableComponent({ movies }) {
    const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:3001/movies')
      .then(res => {
        setData(res.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });
  }, []);

  const columns = useMemo(() => [
    { Header: 'Name', accessor: 'name' },
    { Header: 'Genre', accessor: 'genreName' },
    { Header: 'Description', accessor: 'description' },
    { Header: 'Director', accessor: 'directorName' },
    { Header: 'Actors', accessor: 'actors' },
    { Header: 'Year', accessor: 'year' },
    { Header: 'Runtime', accessor: 'runtime' },
    { Header: 'Rating', accessor: 'rating' },
    { Header: 'Votes', accessor: 'votes' },
    { Header: 'Revenue', accessor: 'revenue' },
    { Header: 'Metascore', accessor: 'metascore' }
  ], []);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    nextPage,
    previousPage,
    pageOptions,
    gotoPage,
    state: { pageIndex }
  } = useTable({
    columns,
    data: movies,
    initialState: { pageIndex: 0 }
  },
  usePagination);

  if (loading) return <p>Loading...</p>;

  // Modify the JSX to include class names for styling
return (
    <>
      <div className="table-container">
        <table {...getTableProps()}>
            <thead>
                {headerGroups.map(headerGroup => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                        {headerGroup.headers.map(column => (
                            <th {...column.getHeaderProps()}>{column.render('Header')}</th>
                        ))}
                    </tr>
                ))}
            </thead>
            <tbody {...getTableBodyProps()}>
                {page.map(row => {
                    prepareRow(row);
                    return (
                        <tr {...row.getRowProps()}>
                            {row.cells.map(cell => {
                                return (
                                    <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                                )
                            })}
                        </tr>
                    );
                })}
            </tbody>
        </table>
        <div className="pagination">
            <button onClick={() => previousPage()} disabled={!canPreviousPage}>Previous</button>
            <button onClick={() => nextPage()} disabled={!canNextPage}>Next</button>
            <div>
                Page <strong>{pageIndex + 1} of {pageOptions.length}</strong>
            </div>
            <div>
                Go to page: <input type="number" defaultValue={pageIndex + 1}
                    onChange={e => {
                        const pageNumber = e.target.value ? Number(e.target.value) - 1 : 0;
                        gotoPage(pageNumber);
                    }} style={{width: '50px'}} />
            </div>
        </div>
      </div>
    </>
);
}

export default DataTableComponent;
