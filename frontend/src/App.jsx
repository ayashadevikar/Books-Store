import { useState } from 'react'
import {Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import CreateBook from './pages/CreateBook.jsx'
import ShowBook from './pages/ShowBook.jsx'
import EditBook from './pages/EditBook.jsx'
import DeleteBook from './pages/DeleteBook.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Navbar from './pages/Navbar.jsx'
import BookList from './pages/BookList.jsx'


function App() {
  
  const [token, setToken] = useState(localStorage.getItem('token'));

  return (
    <>
    <Navbar token={token} setToken={setToken} />

    <Routes>

       <Route path="/login" element={<Login setToken={setToken} />} />
        <Route path="/books" element={token ? <Home token={token} /> : <Navigate to="/login" />} />
          <Route path='/register' element={<Register /> } />
          <Route path='/' element={<Home />} />
          <Route path='/booklist' element={<BookList />} />
          <Route path='/books/create' element={<CreateBook />} />
          <Route path='/books/details/:id' element={<ShowBook /> } />
          <Route path='/books/edit/:id' element={<EditBook /> } />
          <Route path='/books/delete/:id' element={<DeleteBook /> } />
  
    </Routes>


    </>
  )
}

export default App
