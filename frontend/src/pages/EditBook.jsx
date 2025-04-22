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

  useEffect(() => {
    setLoading(true);
    axios.get(`${import.meta.env.VITE_API_URL}/books/${id}`)
      .then((res) => {
        const { title, author, publishYear } = res.data;
        setTitle(title);
        setAuthor(author);
        setPublishYear(publishYear);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
        enqueueSnackbar('Failed to load book data', { variant: 'error' });
      });
  }, [id]);

  const handleEditBook = () => {
    if (!title || !author || !publishYear) {
      enqueueSnackbar('All fields are required!', { variant: 'warning' });
      return;
    }

    const updatedBook = {
      title,
      author,
      publishYear: parseInt(publishYear, 10),
    };

    const token = localStorage.getItem('token');
    if (!token) {
      enqueueSnackbar('Please log in to edit the book', { variant: 'warning' });
      navigate('/login');
      return;
    }
    console.log('Sending PUT request to: ', `${import.meta.env.VITE_API_URL}/books/${id}`);
    console.log('Updated book data: ', updatedBook);
    setLoading(true);
    axios.put(`${import.meta.env.VITE_API_URL}/books/${id}`, updatedBook, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        enqueueSnackbar('Book updated successfully!', { variant: 'success' });
        setLoading(false);
        setTitle('');  // Reset form fields after successful update
        setAuthor('');
        setPublishYear('');
        navigate('/');
      })
      .catch((err) => {
        console.log(err);
        const errorMessage = err.response?.data?.message || 'Failed to update book';
        enqueueSnackbar(errorMessage, { variant: 'error' });
        setLoading(false);
      });
  };

  return (
    <div className="container mt-4">
      <h2>Edit Book</h2>
      {loading && <div className="spinner-border text-primary" role="status"><span className="visually-hidden">Loading...</span></div>}
      {!loading && (
        <div className="card p-4 shadow-sm mt-3">
          <div className="mb-3">
            <label className="form-label">Title</label>
            <input
              className="form-control"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={loading}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Author</label>
            <input
              className="form-control"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              disabled={loading}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Publish Year</label>
            <input
              type="number"
              className="form-control"
              value={publishYear}
              onChange={(e) => setPublishYear(e.target.value)}
              disabled={loading}
            />
          </div>
          <button className="btn btn-success" onClick={handleEditBook} disabled={loading}>Save</button>
        </div>
      )}
    </div>
  );
};

export default EditBook;

