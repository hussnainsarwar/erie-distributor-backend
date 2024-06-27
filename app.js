const express = require('express');
// const mongoose = require('./database/mongoose.js');
// const cors = require('cors'); 
// const bcrypt = require('bcrypt');

// const User = require('./database/models/User.js');
// const Category = require('./database/models/Category.js');

const app = express();

// Middleware
app.use(express.json());
// app.use(cors());

// // POST endpoint to handle user signup
// app.post('/signup', async (req, res) => {
//   try {
//     const { name, email, contact, password } = req.body;
//     const hashedPassword = await bcrypt.hash(password, 10);
//     const user = new User({ name, email, contact, password: hashedPassword, usertype: "user" });
//     await user.save();
//     const userId = user._id;
//     res.status(201).send({ userId, name, usertype: "user" });
//   } catch (error) {
//     console.error(error);
//     res.status(500).send('Internal Server Error');
//   }
// });

// // POST endpoint to handle user login
// app.post('/login', async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(404).send('User not found');
//     }

//     const isPasswordValid = await bcrypt.compare(password, user.password);
//     if (!isPasswordValid) {
//       return res.status(401).send('Invalid password');
//     }
//     res.status(200).send({
//       id: user._id,
//       name: user.name,
//       usertype: user.usertype
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).send('Internal Server Error');
//   }
// });

// // POST endpoint to check if user exists by email
// app.post('/checkuser', async (req, res) => {
//   try {
//     const { email } = req.body;
//     const user = await User.findOne({ email });
//     if (user) {
//       res.status(200).send({ exists: true });
//     } else {
//       res.status(200).send({ exists: false });
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).send('Internal Server Error');
//   }
// });

// // POST endpoint to add a category
// app.post('/addCategory', async (req, res) => {
//   try {
//     const { name, path } = req.body;
//     const category = new Category({ name, path });
//     await category.save();
//     res.status(201).json(category);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Failed to add category', error });
//   }
// });

// // GET endpoint to fetch categories
// app.get('/categories', async (req, res) => {
//   try {
//     const categories = await Category.find();
//     res.status(200).json(categories);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Failed to fetch categories', error });
//   }
// });

// Root endpoint
app.get("/", (req, res) => res.send("Express on Vercel"));

// Use dynamic port for Vercel
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server ready on port ${port}.`));

module.exports = app;
