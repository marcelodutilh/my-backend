const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// Replace with your MongoDB URI
const mongoURI = 'mongodb+srv://dutilh95:rCuWHkr6GLxkksUd@cluster0.dixyh.mongodb.net/commentsDB?retryWrites=true&w=majority';

// Connect to MongoDB
mongoose.connect(mongoURI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('Error connecting to MongoDB:', error));

// Define a Comment schema and model
const commentSchema = new mongoose.Schema({
  userId: { type: Number, required: true },
  comment: { type: String, required: true },
  timestamp: { type: Date, default: Date.now } // To keep track of when each comment was added
});

const Comment = mongoose.model('Comment', commentSchema);

// API endpoint to get all comments
app.get('/comments', async (req, res) => {
  try {
    const comments = await Comment.find(); // Fetch all comments
    res.json(comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ error: 'Error fetching comments' });
  }
});

// API endpoint to get comments by userId
app.get('/comments/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const comments = await Comment.find({ userId }); // Fetch all comments for a specific user
    res.json(comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ error: 'Error fetching comments' });
  }
});

// API endpoint to add a new comment
app.post('/comments', async (req, res) => {
  const { userId, comment } = req.body;
  try {
    // Create a new comment for the user
    const newComment = new Comment({ userId, comment });
    await newComment.save();
    res.json(newComment);
  } catch (error) {
    console.error('Error saving comment:', error);
    res.status(500).json({ error: 'Error saving comment' });
  }
});

// Start the server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
