import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';

const EditBook = () => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [publishYear, setPublishYear] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();
  const { enqueueSnackbar } = useSnackbar();

  // Get token from localStorage
  const token = localStorage.getItem('token');
  
  useEffect(() => {
    if (!token) {
      enqueueSnackbar('Unauthorized: Please log in', { variant: 'error' });
      navigate('/login');
      return;
    }

    setLoading(true);
    
    // Fetch book data by ID
    axios.get(`${import.meta.env.VITE_API_URL}/books/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((res) => {
      console.log('API Response:', res.data);  // Log the response here for debugging
      const { title, author, publishYear } = res.data;
      setTitle(title || '');
      setAuthor(author || '');
      setPublishYear(publishYear || '');
      setLoading(false);
    })
    .catch((err) => {
      console.error('Error fetching book data:', err);
      enqueueSnackbar('Failed to load book data', { variant: 'error' });
      setLoading(false);
    });
  }, [id, token, navigate, enqueueSnackbar]);
  console.log('Title:', title, 'Author:', author, 'Publish Year:', publishYear);

  const handleEditBook = (event) => {
    event.preventDefault(); // Prevent the default form submission behavior

    if (!title || !author || !publishYear) {
      enqueueSnackbar('All fields are required', { variant: 'error' });
      return;
    }

    // Ensure publishYear is a valid number
    if (isNaN(publishYear) || publishYear < 1000 || publishYear > new Date().getFullYear()) {
      enqueueSnackbar('Invalid publish year', { variant: 'error' });
      return;
    }

    const updatedBook = { title, author, publishYear: Number(publishYear) };

    setLoading(true);

    // Update book data
    axios
      .put(`${import.meta.env.VITE_API_URL}/books/${id}`, updatedBook, {
        headers: {
          Authorization: `Bearer ${token}`, // Include token in header
        },
      })
      .then((res) => {
        enqueueSnackbar('Book updated successfully!', { variant: 'success' });
        navigate('/booklist'); // Navigate back to the homepage or another page
      })
      .catch((err) => {
        setLoading(false);
        if (err.response) {
          console.error('Error response:', err.response.data);
          enqueueSnackbar(`Error: ${err.response.data.message || 'Failed to update book'}`, { variant: 'error' });
        } else {
          console.error('Error:', err.message);
          enqueueSnackbar('Failed to update book', { variant: 'error' });
        }
      });
  };

  // Log state before rendering the form for debugging purposes
  console.log('Form State:', { title, author, publishYear });

  return (
    <div className="container mt-4">
      <h2>Edit Book</h2>
      {loading && (
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      )}
      {!loading && (
        <div className="card p-4 shadow-sm mt-3">
          <div className="mb-3">
            <label className="form-label">Title</label>
            <input
              className="form-control"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter book title"
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Author</label>
            <input
              className="form-control"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="Enter author name"
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Publish Year</label>
            <input
              type="number"
              className="form-control"
              value={publishYear}
              onChange={(e) => setPublishYear(e.target.value)}
              placeholder="Enter publish year"
            />
          </div>
          <button className="btn btn-success" onClick={handleEditBook}>
            Save
          </button>
        </div>
      )}
    </div>
  );
};

export default EditBook;
