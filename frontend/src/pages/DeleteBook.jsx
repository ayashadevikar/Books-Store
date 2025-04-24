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
    if (!token) {
      enqueueSnackbar('No token found. Please log in again.', { variant: 'error' });
      navigate('/login');
      return;
    }

    setLoading(true);
    axios
      .delete(`${import.meta.env.VITE_API_URL}/books/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Include token in header
        },
      })
      .then(() => {
        setLoading(false);
        enqueueSnackbar('Book deleted successfully', { variant: 'success' });
        navigate('/'); // Navigate back to the homepage or another page
      })
      .catch((error) => {
        setLoading(false);
        // Handle possible error messages gracefully
        const errorMessage =
          error.response?.data?.message ||
          'Error deleting book. Please try again later.';
        if (error.response?.status === 401) {
          // If unauthorized, redirect to login
          enqueueSnackbar('Unauthorized. Please log in again.', { variant: 'error' });
          navigate('/login');
        } else {
          enqueueSnackbar(errorMessage, { variant: 'error' });
        }
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
