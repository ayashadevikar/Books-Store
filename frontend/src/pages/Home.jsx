import React, { useEffect, useState } from 'react';
import axios from 'axios';
// import Spinner from '../Components/Spinner';
import { Link } from 'react-router-dom';
// import { AiOutlineEdit } from 'react-icons/ai';
import { BsInfoCircle } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';
// import { MdOutlineAddBox , MdOutlineDelete } from 'react-icons/md';

const Home = () => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

  

    useEffect(() => {
      setLoading(true);
      axios.get(`${import.meta.env.VITE_API_URL}/books`)
        .then((res) => {
          console.log('Fetched books:', res.data);
           if (res.data.success && Array.isArray(res.data.data))  {
            setBooks(res.data.data);
          } else {
            console.error('API did not return an array:', res.data);
            setBooks([]);
          }
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setBooks([]);
          setLoading(false);
        });
    }, []);
    
    const handleAddBookClick = () => {
      navigate('/booklist');
    };
    
  return (
    <>

  
<div className='d-flex justify-content-between align-items-center mb-3 p-2'>
        <h3>Book List</h3>
        <button className="btn btn-primary" onClick={handleAddBookClick}>CRUD Page</button>
        {/* <div className='d-flex gap-3'>
            <Link to='/books/create' className='btn btn-primary d-flex align-items-center'>
              <MdOutlineAddBox className='me-2' />
               Add Book
             </Link>
            <Link to='/login' type="button" className="btn btn-primary px-4">Login</Link>
            <Link to='/register' type="button" className="btn btn-primary px-4">Register</Link>
        </div> */}
       
      </div>

      {loading ? (
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <table className='table table-striped table-bordered'>
          <thead className='table-dark'>
            <tr className='text-center'>
              <th>No.</th>
              <th>Title</th>
              <th>Author</th>
              <th>Publish Year</th>
              <th>Operations</th>
            </tr>
          </thead>
          <tbody>
  {Array.isArray(books) && books.length > 0 ? (
    books.map((book, index) => (
      <tr className='text-center' key={book._id}>
        <td>{index + 1}</td>
        <td>{book.title}</td>
        <td>{book.author}</td>
        <td>{book.publishYear}</td>
        <td>
          <div className='text-center'>
            <Link to={`/books/details/${book._id}`} className='btn btn-sm btn-info text-white'>
              <BsInfoCircle />
            </Link>
          </div>
        </td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan="5" className="text-center">No books found.</td>
    </tr>
  )}
</tbody>
        </table>
            )}
    </>
  )
}

export default Home