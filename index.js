const express= require('express');//look for express in node module and load it
const app=express();
app.use(express.json());
const cors = require('cors'); // Import CORS middleware
app.use(cors());

const nodemailer = require('nodemailer');

// app.listen(3000, ()=>{
//     console.log("server started at port 3000");
// });


const mongoose=require('./database/mongoose.js');
const SubCategory=require('./database/models/SubCategory.js');

const User = require('./database/models/User.js');
const Category = require('./database/models/Category.js');
const Favourite = require('./database/models/Favourites.js');
const UserPrice = require('./database/models/UserPrice');

const bcrypt = require('bcrypt');

// POST endpoint to handle user signup
// POST endpoint to handle user signup
app.post('/signup', async (req, res) => {
  try {
      const { name, email, contact, password } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10); // Hash the password
      const user = new User({ name, email, contact, password: hashedPassword ,usertype: "user"}); // Store the hashed password
      await user.save();
      const userId = user._id;
      res.status(201).send({ userId, name ,usertype: "user"});
  } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
  }
});


app.post('/login', async (req, res) => {
  try {
      const { email, password } = req.body;
     
      
      const user = await User.findOne({ email }); // Find user by email
      if (!user) {
          return res.status(404).send('User not found');
      }
      
      // console.log(user,'user')
      const isPasswordValid = await bcrypt.compare(password, user.password); // Compare passwords
      if (!isPasswordValid) {
        console.log('password npt comparing')
          return res.status(401).send('Invalid password');
      }
      res.status(200).send({
        id: user._id,
        name: user.name,
        usertype:user.usertype
      })
     
    //   res.status(200).send('Login successful');
  } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
  }
});


// POST endpoint to check if user exists by email
app.post('/checkuser', async (req, res) => {
  try {
      const { email } = req.body;
      const user = await User.findOne({ email });
      if (user) {
          res.status(200).send({ exists: true });
      } else {
          res.status(200).send({ exists: false });
      }
  } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
  }
});


app.post('/addCategory', async (req, res) => {
  try {
    const { name, path } = req.body;
    const category = new Category({ name, path });
    await category.save();
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: 'Failed to add category', error });
  }
});


app.get('/categories', async (req, res) => {
  try { 
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch categories', error });
  }
}); 

app.get('/allsubcategories', async (req, res) => {
  try {
    const subcategories = await SubCategory.find();
    res.status(200).json(subcategories);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch categories', error });
  }
}); 
 
app.post('/addSubCategory', async (req, res) => {
  try {
    const { name, path, price, flavors, categoryId, isFavourite, brand ,quantity,description } = req.body;
    const subCategory = new SubCategory({
      name,
      path,
      price,
      flavors,
      categoryId,
      isFavourite: isFavourite !== undefined ? isFavourite : false,
      brand: brand || null,
      quantity,
      description,
    });
    await subCategory.save();
    res.status(201).json(subCategory);
  } catch (error) {
    res.status(500).json({ message: 'Failed to add subcategory', error });
  }
});


app.get('/subcategories/:categoryId', async (req, res) => {
  try {
    const categoryId = req.params.categoryId.trim(); // Trim whitespace and newlines

    // Convert categoryId to ObjectId using 'new'
    const objectId = new mongoose.Types.ObjectId(categoryId);

    // Fetch subcategories based on categoryId
    const subcategories = await SubCategory.find({ categoryId: objectId });

    if (subcategories.length === 0) {
      return res.status(404).json({ message: 'No subcategories found for this categoryId' });
    }

    res.status(200).json(subcategories);
  } catch (error) {
    console.error('Error fetching subcategories:', error); // Log the error details to the console
    res.status(500).json({ message: 'Failed to fetch subcategories', error: error.message });
  }
});

app.post('/subcategories/batch', async (req, res) => {
  const { ids } = req.body; // Expecting an array of IDs

  try {
    const subcategories = await SubCategory.find({ _id: { $in: ids } });
    res.status(200).json(subcategories);
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Server error', error });
  }
});

app.get('/category/:id/name', async (req, res) => {
  try {
    const category = await Category.findById(req.params.id).select('name');
    if (!category) {
      return res.status(404).send({ message: 'Category not found' });
    }
    res.send({ name: category.name });
  } catch (error) {
    res.status(500).send({ message: 'Server error' });
  }
});


app.get('/favorites/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const favorites = await Favourite.find({ userId });
   res.status(200).json(favorites);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});


app.post('/favorites/toggle', async (req, res) => {
  try {
    const { userId, subcategoryId } = req.body;

    let favorite = await Favourite.findOne({ userId, subcategoryId });

    if (favorite) {
      // If favorite exists, remove it
      await Favourite.deleteOne({ userId, subcategoryId });
      res.status(200).json({ message: 'Removed from favorites' });
    } else {
      // If favorite does not exist, add it
      favorite = new Favourite({ userId, subcategoryId });
      await favorite.save();
      res.status(200).json({ message: 'Added to favorites' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

app.get('/users', async (req, res) => {
  try {
    const users = await User.find(); // Assuming you have a User model
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch users', error });
  }
});
app.get('/user/:userId/subcategories', async (req, res) => {
  try { 
    const { userId } = req.params;
    const subcategories = await SubCategory.find(); // Fetch all subcategories

    const subcategoriesWithPrices = await Promise.all(
      subcategories.map(async (subcategory) => {
        const userPrice = await UserPrice.findOne({ userId, subcategoryId: subcategory._id });
        
        if (userPrice) {
          // If user has updated the price, replace the price field with the updated price
          return {
            ...subcategory.toObject(),
            price: userPrice.updatedPrice, // Replace the price field
          };
        } else {
          // If no updated price, return the subcategory as is (with its default price field)
          return subcategory.toObject();
        }
      })
    );
    res.status(200).json(subcategoriesWithPrices);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch subcategories', error });
  }
});


app.post('/user/:userId/subcategory/:subcategoryId/updatePrice', async (req, res) => {
  try {
    const { userId, subcategoryId } = req.params;
    // const { updatedPrice } = req.body;
    const updatedPrice = String(req.body.updatedPrice); 
    await UserPrice.findOneAndUpdate(
      { userId, subcategoryId },
      { updatedPrice },
      { upsert: true, new: true }
    );

    res.status(200).json({ message: 'Price updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update price', error });
  }
});



app.get('/', async (req, res) => {
    res.send({message : "server working"});

}); 

app.get('/',  (req, res) => {
  res.send("server working");

}); 



const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server started at port ${PORT}`);
});

module.exports = app;
