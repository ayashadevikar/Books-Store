import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';



const CreateBook = () => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [publishYear, setPublishYear] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

 
  const handleSaveBook = () => {
    if (!title || !author || !publishYear) {
      enqueueSnackbar('Please fill all fields', { variant: 'warning' });
      return;
    }
  
    const token = localStorage.getItem('token'); // Get token from localStorage
  
    const data = {
      title,
      author,
      publishYear: Number(publishYear),
    };
  
    setLoading(true);
    axios
      .post(`${import.meta.env.VITE_API_URL}/books`, data, {
        headers: {
          Authorization: `Bearer ${token}`, // Add token to headers
        },
      })
      .then(() => {
        enqueueSnackbar('Book created successfully!', { variant: 'success' });
        navigate('/');    
      })
      .catch((err) => {
        enqueueSnackbar('Something went wrong.', { variant: 'error' });
        console.error(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };


  return (
    <div className="container mt-4">
      <h2>Create Book</h2>

      <form>
        <div className="mb-3">
          <label className="form-label">Title</label>
          <input
            type="text"
            className="form-control"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter book title"
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Author</label>
          <input
            type="text"
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
            placeholder="Enter year"
          />
        </div>

        <button
          type="button"
          className="btn btn-primary"
          onClick={handleSaveBook}
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Save Book'}
        </button>
      </form>
    </div>
  );
};

export default CreateBook;
