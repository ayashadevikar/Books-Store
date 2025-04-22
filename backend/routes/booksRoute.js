import express from 'express';
import { Book } from '../models/bookModel.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// Route for Save a new Book (Protected)
router.post('/', authMiddleware, async (request, response) => {
    try {
        if (!request.body.title || !request.body.author || !request.body.publishYear) {
            return response.status(400).send({
                message: 'Send all required fields: title, author, publishYear',
            });
        }

        const newBook = {
            title: request.body.title,
            author: request.body.author,
            publishYear: request.body.publishYear,
            user: request.user.id, // Associate the book with the logged-in user
        };

        const book = await Book.create(newBook);

        return response.status(201).send(book);
    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
});

// Route for Get All Books from database (Not protected, since viewing books can be public)
router.get('/', async (request, response) => {
    try {
        const books = await Book.find({});
        return response.status(200).json(books); // 200 is standard for GET
    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
});

// Route for Get One Book from database by id (Not protected)
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const book = await Book.findById(id);

        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }

        return res.status(200).json(book); // 200 is standard for GET
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server Error' });
    }
});


// Route for Update a Book (Protected)
router.put('/:id', authMiddleware, async (request, response) => {
    try {
        // Validate required fields
        if (!request.body.title || !request.body.author || !request.body.publishYear) {
            return response.status(400).send({
                message: 'Send all required fields: title, author, publishYear',
            });
        }

        const { id } = req.params;

        // Find the book by ID
        const book = await Book.findById(id);
        if (!book) {
            return response.status(404).json({ message: 'Book not found' });
        }

        // Check if the book belongs to the authenticated user
        if (book.user.toString() !== request.user.id) {
            return response.status(403).json({ message: 'You are not authorized to edit this book' });
        }

        

        // Update the book
        const updatedBook = await Book.findByIdAndUpdate(id, request.body, { new: true });

        return response.status(200).send({ message: 'Book updated successfully', book: updatedBook });
    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
});



// Route for Delete a Book (Protected)
router.delete('/:id', authMiddleware, async (request, response) => {
    try {
        const { id } = request.params;

        const book = await Book.findOne({ _id: id, user: request.user.id });
        if (!book) {
            return response.status(404).json({ message: 'Book not found or not authorized to delete' });
        }

        await Book.findByIdAndDelete(id);

        return response.status(200).send({ message: 'Book deleted successfully' });
    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
});


export default router;
