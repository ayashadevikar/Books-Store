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
    axios.get(`${process.env.REACT_APP_API_URL}/api/books/${id}`, data)
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
    const updatedBook = { title, author, publishYear };
    setLoading(true);
    axios.put(`http://localhost:5555/books/${id}`, updatedBook)
      .then(() => {
        enqueueSnackbar('Book updated successfully!', { variant: 'success' });
        navigate('/');
      })
      .catch((err) => {
        console.log(err);
        enqueueSnackbar('Failed to update book', { variant: 'error' });
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
            <input className="form-control" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div className="mb-3">
            <label className="form-label">Author</label>
            <input className="form-control" value={author} onChange={(e) => setAuthor(e.target.value)} />
          </div>
          <div className="mb-3">
            <label className="form-label">Publish Year</label>
            <input type="number" className="form-control" value={publishYear} onChange={(e) => setPublishYear(e.target.value)} />
          </div>
          <button className="btn btn-success" onClick={handleEditBook}>Save</button>
        </div>
      )}
    </div>
  );
};

export default EditBook;
