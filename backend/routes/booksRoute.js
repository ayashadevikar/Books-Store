import express from 'express';
import { Book } from '../models/bookModel.js';

const router = express.Router();



// Route for Save a new Book
router.post('/', async (request, response) => {
    try {
        if(
            !request.body.title ||
            !request.body.author ||
            !request.body.publishYear 
        ) {
            return response.status(400).send({
                message: 'Send all required fields: title, author, publishYear',
            });
        }
        const newBook = {
            title: request.body.title,
            author: request.body.author,
            publishYear: request.body.publishYear,
        };

        const book = await Book.create(newBook);

        return response.status(201).send(book);
    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
})


// Route for Get All Books from database

router.get('/', async (request, response) => {
    try {
        const books = await Book.find({});

        return response.status(201).json(books);
        // return response.status(201).json({
        //     count: books.length,
        //     data: books
        // });
    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
})

// Route for Get One Book from database by id

router.get('/:id', async (req, res) => {
    try {
      const { id } = req.params;
  
      const book = await Book.findById(id);
  
      if (!book) {
        return res.status(404).json({ message: 'Book not found' });
      }
  
      return res.status(200).json(book); // 🔧 201 changed to 200 (standard for GET)
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ message: 'Server Error' });
    }
  });
  

// Route for Update a Book
router.put('/:id', async (request, response) => {
    try {
        if(
            !request.body.title ||
            !request.body.author ||
            !request.body.publishYear 
        ) {
            return response.status(400).send({
                message: 'Send all required fields: title, author, publishYear'
            });
        }
        

        const { id } = request.params;

        const result = await Book.findByIdAndUpdate(id, request.body);

        if (!result){
            return response.status(404).json({ message: 'Book not found' });
        }
        return response.status(200).send({ message: 'Book updates sucessfully' });
    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
})

// Route for Delete a book
router.delete('/:id', async (request, response) => {
    try {
        const { id } = request.params;

        const result = await Book.findByIdAndDelete(id);

        if (!result) {
            return response.status(404).json({ message: 'Book not found' });
        }
        return response.status(200).send({ message: 'Book deleted sucessfully' });
        
    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
}) 

export default router;