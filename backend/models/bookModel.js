import mongoose from "mongoose";

const bookSchema = mongoose.Schema(
    {
        title:{
            type: String,
            required: true,
            trim: true,
        },
        author: {
            type: String,
            required: true,
            trim: true,
        },
        publishYear: {
            type: Number,
            required: true,
            min: 0, // No negative years
            max: new Date().getFullYear(), // Not beyond the current year
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User', // Reference to the User model
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

export const Book = mongoose.model('Book', bookSchema);