import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';

const DeleteBook = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();
  const { enqueueSnackbar } = useSnackbar();

  const handleDeleteBook = () => {
    const token = localStorage.getItem('token'); // Get JWT from localStorage
  
    setLoading(true);
    axios
      .delete(`${import.meta.env.VITE_API_URL}/books/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`, // include token in header
        },
      })
      .then(() => {
        setLoading(false);
        enqueueSnackbar('Book deleted successfully', { variant: 'success' });
        navigate('/');
      })
      .catch((error) => {
        setLoading(false);
        enqueueSnackbar('Error deleting book', { variant: 'error' });
        console.error(error);
      });
  };
  

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Delete Book</h2>
      <div className="card p-4 text-center">
        <p className="fs-5">Are you sure you want to delete this book?</p>
        <button
          className="btn btn-danger"
          onClick={handleDeleteBook}
          disabled={loading}
        >
          {loading ? 'Deleting...' : 'Yes, Delete'}
        </button>
      </div>
    </div>
  );
};

export default DeleteBook;
