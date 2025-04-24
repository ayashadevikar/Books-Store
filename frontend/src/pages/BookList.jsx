import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { AiOutlineEdit } from 'react-icons/ai';
import { BsInfoCircle } from 'react-icons/bs';
import { MdOutlineAddBox, MdOutlineDelete } from 'react-icons/md';

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const userName = localStorage.getItem('userName');

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${import.meta.env.VITE_API_URL}/books`)
      .then((res) => {
        console.log('Fetched books:', res.data);
        // Ensure the response contains the expected structure
        if (res.data && Array.isArray(res.data.data)) {
          setBooks(res.data.data); // Set books if the response is valid
        } else {
          console.error('Unexpected response structure:', res.data);
          setBooks([]); // Fallback to empty array in case of unexpected structure
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching books:', err);
        setBooks([]); // Fallback to empty array on error
        setLoading(false);
      });
  }, []);

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3 p-2">
        <h1>Book List</h1>
        <h3>Welcome, {userName} 👋</h3>
        <div className="d-flex gap-3">
          <Link to="/books/create" className="btn btn-primary d-flex align-items-center">
            <MdOutlineAddBox className="me-2" />
            Add Book
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : books.length === 0 ? (
        <div className="text-center">No books found.</div>
      ) : (
        <table className="table table-striped table-bordered">
          <thead className="table-dark">
            <tr>
              <th>No.</th>
              <th>Title</th>
              <th>Author</th>
              <th>Publish Year</th>
              <th>Operations</th>
            </tr>
          </thead>
          <tbody>
            {books.map((book, index) => (
              <tr key={book._id}>
                <td>{index + 1}</td>
                <td>{book.title}</td>
                <td>{book.author}</td>
                <td>{book.publishYear}</td>
                <td>
                  <div className="d-flex gap-2">
                    <Link to={`/books/details/${book._id}`} className="btn btn-sm btn-info text-white">
                      <BsInfoCircle />
                    </Link>
                    <Link to={`/books/edit/${book._id}`} className="btn btn-sm btn-warning">
                      <AiOutlineEdit />
                    </Link>
                    <Link to={`/books/delete/${book._id}`} className="btn btn-sm btn-danger">
                      <MdOutlineDelete />
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
};

export default BookList;
