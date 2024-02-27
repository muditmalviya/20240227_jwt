const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
const port = 3002;

// Connect to MongoDB
mongoose.connect('mongodb+srv://malviyamudit7:12345@cluster0.6jivug7.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define User schema
const userSchema = new mongoose.Schema({
  userId: String,
  password: String,
  personName: String,
  city: String,
});

const User = mongoose.model('User', userSchema);

app.use(express.json());

// POST endpoint for user authentication
app.post('/login', async (req, res) => {
  const { userId, password } = req.body;

  try {
    const user = await User.findOne({ userId });

    if (!user) {
      return res.status(401).json({ message: 'Invalid user' });
    }

    // Ensure user has a password
    if (!user.password) {
      return res.status(401).json({ message: 'User does not have a password set' });
    }

    // Compare password
    if (password === user.password) {
      const token = jwt.sign({ userId: user.userId }, "your_secret_key_here", { expiresIn: '1h' });
      res.json({ token });
    } else {
      res.status(401).json({ message: 'Invalid password' });
    }

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
})