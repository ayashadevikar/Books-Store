import express from 'express';
import  { Book } from '../models/bookModel.js';
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
        return response.status(200).json({ success: true, data: books }); // 200 is standard for GET
    } catch (error) {
        console.log(error.message);
        response.status(500).json({ success: false, message: error.message });
    }
});

// Route for Get One Book from database by id (Not protected)
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.status(200).json(book);
  } catch (error) {
    console.error('Fetch book error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// router.get('/:id', async (req, res) => {
//     try {
//         const { id } = req.params;

//         const book = await Book.findById(id);

//         if (!book) {
//             return res.status(404).json({ message: 'Book not found' });
//         }

//         return res.status(200).json({ success: true, data: book }); // 200 is standard for GET
//     } catch (error) {
//         console.error(error.message);
//         res.status(500).json({ message: 'Server Error' });
//     }
// });


// Route for Update a Book (Protected)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { title, author, publishYear } = req.body;

    // Validate if required fields are provided
    if (!title || !author || !publishYear) {
      console.log('Validation failed:', { title, author, publishYear });
      return res.status(400).json({
        message: "All fields (title, author, publishYear) are required",
        missingFields: {
          title: !title,
          author: !author,
          publishYear: !publishYear,
        }
      });
    }

    console.log('Request user:', req.user); // Log user information

    // Ensure the user is authenticated
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized: User not authenticated" });
    }

    // Find the book to be edited
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    // Check if the user owns the book before updating
    if (book.user.toString() !== req.user.id.toString()) {
      return res.status(403).json({ message: "Forbidden: You can't edit this book" });
    }

    // Update the book
    const updatedBook = await Book.findByIdAndUpdate(
      req.params.id,
      { title, author, publishYear },
      { new: true } // `new: true` ensures the updated document is returned
    );

    console.log('Updated book:', updatedBook); // Log updated book

    return res.status(200).json(updatedBook); // Return the updated book
  } catch (error) {
    console.error('Error during update:', error); // Log the error
    return res.status(500).json({ message: 'Server error while updating book' });
  }
});



  
// Route for Delete a Book (Protected)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    // Optional: Ensure that only the user who created the book can delete it
    if (book.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Forbidden: You can't delete this book" });
    }

    await book.remove();
    res.status(200).json({ message: "Book deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


export default router;
