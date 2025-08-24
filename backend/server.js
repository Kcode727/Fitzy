require('dotenv').config();  

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Import User model 
const User = require('./models/user');

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173', // Vite default port
  credentials: true
}));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.error('MongoDB connection error:', err));

app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Fitness Tracker API Server</title>
        <style>
            body {
                color: #333;
                height: 100vh;
                display: flex;
                justify-content: center;
                align-items: center;
                margin: 0;
                padding: 20px;
            }
        </style>
    </head>
    <body>
      <div>
        <h1>Fitness Tracker API Server</h1>
        <div>
          <strong>Server is running on port ${process.env.PORT || 5000}</strong>
        </div>
      </div>
    </body>
    </html>
  `);
});

// Register route
app.post('/api/register', async (req, res) => {
  try {
    const { email, username, password, age, gender, height, weight } = req.body;

    if (!email || !username || !password || !age || !gender || !height || !weight) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    // Check if email already exists
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ success: false, message: "Email already in use" });
    }

    // Check if username already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "Username already in use" });
    }

    // Create new user 
    const newUser = new User({ email, username, password, age, gender, height, weight });
    await newUser.save();

    res.status(201).json({ success: true, message: "User registered successfully!" });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});


// Signin route
app.post('/api/signin', async (req, res) => {
  const { username, password } = req.body; 

  if (!username || !password) {
    return res.status(400).json({ success: false, message: "Username and password are required" });
  }

  const user = await User.findOne({ username });
  if (!user) {
    return res.status(400).json({ success: false, message: "User not found" });
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return res.status(400).json({ success: false, message: "Invalid credentials" });
  }

  res.status(200).json({ success: true, message: "Signed in successfully!" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
