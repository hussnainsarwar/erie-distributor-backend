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
const Order = require('./database/models/Order');
const Cart = require('./database/models/cart.js');
const bcrypt = require('bcrypt');

const transporter = nodemailer.createTransport({
  service: 'gmail', // You can use any email service like Yahoo, Outlook, etc.
  auth: {
    user: 'eriedistributor@gmail.com', // Your Gmail account
    pass: 'tsmj pyby ijvr cfrx', // Your Gmail app password (not your normal password)
  },
}); 

function sendReceiptEmail(toEmail, cartItems, totalValue) {
  const htmlContent = formatHtmlReceipt(cartItems, totalValue);

  const mailOptions = {
    from: 'eriedistributor@gmail.com',
    to: toEmail,
    subject: 'Payment Receipt',
    html: htmlContent, // Use HTML for styled email
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.error('Error sending email:', error);
    }
    console.log('Email sent successfully:', info.response);
  });
}

// Helper function to format HTML receipt content
function formatHtmlReceipt(cartItems, totalValue) {
  let receiptItems = cartItems
    .map(item => `
      <tr>
        <td style="padding: 10px; text-align: center;">
          <img src="${item.path}" alt="${item.name}" style="max-width: 50px; max-height: 50px;">
        </td>
        <td style="padding: 10px; text-align: left;">${item.name} (x${item.quantity})</td>
        <td style="padding: 10px; text-align: right;">\$${(item.price * item.quantity).toFixed(2)}</td>
      </tr>
    `)
    .join('');

  return `
    <html>
      <body style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd;">
        <div style="text-align: center; padding-bottom: 20px;">
          <img src="https://firebasestorage.googleapis.com/v0/b/eriedistributor-28efa.appspot.com/o/erie_distributor_logo_splash.png?alt=media&token=b34f41c4-7320-437c-96a1-5a5e91e42cec" alt="Company Logo" style="max-width: 150px;">
        </div>
        <h2 style="text-align: center;">Thank you for your purchase!</h2>
        <p style="text-align: center;">Here is your payment receipt Please remit payment at your earliest convenience.Thank you for your purchase - we appreciate it very much:</p>
        <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
          <thead>
            <tr>
              <th style="border-bottom: 1px solid #ddd; padding: 8px; text-align: left;">Image</th>
              <th style="border-bottom: 1px solid #ddd; padding: 8px; text-align: left;">Product</th>
              <th style="border-bottom: 1px solid #ddd; padding: 8px; text-align: right;">Price</th>
            </tr>
          </thead>
          <tbody>
            ${receiptItems}
          </tbody>
        </table>
        <p style="text-align: right; font-weight: bold; margin-top: 20px;">
          Total: \$${totalValue.toFixed(2)}
        </p>
        <footer style="text-align: center; margin-top: 20px;">
          <p style="font-size: 12px;">Erie Distributor - All rights reserved</p>
          <p style="font-size: 12px;">141 E 26th ST Erie PA 16504</p>
          <p style="font-size: 12px;">Jahangir Cheema PH# 412-995-0913</p>
          <p style="font-size: 12px;">Junaid Bajwa PH# 330-843-6348</p>

        </footer>
      </body>
    </html>
  `;
}


function sendReceiptEmailAdmin(toEmail, cartItems, totalValue,userEmail) {
  const htmlContent = formatHtmlReceiptAdmin(cartItems, totalValue,userEmail);

  const mailOptions = {
    from: 'eriedistributor@gmail.com',
    to: toEmail,
    subject: 'New Order',
    html: htmlContent, // Use HTML for styled email
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.error('Error sending email:', error);
    }
    console.log('Email sent successfully:', info.response);
  });
}

// Helper function to format HTML receipt content
function formatHtmlReceiptAdmin(cartItems, totalValue,userEmail) {
  let receiptItems = cartItems
    .map(item => `
      <tr>
        <td style="padding: 10px; text-align: center;">
          <img src="${item.path}" alt="${item.name}" style="max-width: 50px; max-height: 50px;">
        </td>
        <td style="padding: 10px; text-align: left;">${item.name} (x${item.quantity})</td>
        <td style="padding: 10px; text-align: right;">\$${(item.price * item.quantity).toFixed(2)}</td>
      </tr>
    `)
    .join('');

  return `
    <html>
      <body style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd;">
        <div style="text-align: center; padding-bottom: 20px;">
          <img src="https://firebasestorage.googleapis.com/v0/b/eriedistributor-28efa.appspot.com/o/erie_distributor_logo_splash.png?alt=media&token=b34f41c4-7320-437c-96a1-5a5e91e42cec" alt="Company Logo" style="max-width: 150px;">
        </div>
        <h2 style="text-align: center;">New Order!</h2>
        <p style="text-align: center;">Here is your Order from ${userEmail}:</p>
        <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
          <thead>
            <tr>
              <th style="border-bottom: 1px solid #ddd; padding: 8px; text-align: left;">Image</th>
              <th style="border-bottom: 1px solid #ddd; padding: 8px; text-align: left;">Product</th>
              <th style="border-bottom: 1px solid #ddd; padding: 8px; text-align: right;">Price</th>
            </tr>
          </thead>
          <tbody>
            ${receiptItems}
          </tbody>
        </table>
        <p style="text-align: right; font-weight: bold; margin-top: 20px;">
          Total: \$${totalValue.toFixed(2)}
        </p>
        <footer style="text-align: center; margin-top: 20px;">
          <p style="font-size: 12px;">Erie Distributor - All rights reserved</p>
          <p style="font-size: 12px;">141 E 26th ST Erie PA 16504</p>

        </footer>
      </body>
    </html>
  `;
}


// API endpoint to send a receipt email
app.post('/send-receipt', async (req, res) => {
  const { userId, cartItems, totalValue } = req.body;
  try {
  const user = await User.findOne({ _id: userId });

  if (!user) {
    return res.status(404).send( {message:'User not found'});
  }

  const userEmail = user.email;
  // Assume that the email is fetched using userId from the database
  // const userEmail = userId; // Replace this with the actual user email logic
  const newOrder = new Order({
    userId: user._id,
    email: userEmail, // Store the user's email
    cartItems: cartItems,
    totalValue: totalValue,
  });

  await newOrder.save(); 
  // Call function to send an email
  sendReceiptEmail(userEmail, cartItems, totalValue);

  const adminEmail = 'eriedistributor@gmail.com'; // Replace with your admin email
  sendReceiptEmailAdmin(adminEmail, cartItems, totalValue,userEmail);

  res.status(200).send({
    message: 'Receipt email sent successfully',
    email: userEmail, // Include the user's email in the response
  });

} catch (error) {
  console.error('Error sending receipt email:', error); // Log the error
  res.status(500).send({
    message: 'An error occurred while sending the receipt email', // Handle any errors
    error: error.message, // Include error message in response for debugging
  });
}

});



// Add a new POST endpoint to handle contact form submissions
app.post('/contact-us', (req, res) => {
  const { name, email, phone, message } = req.body;

  // Email content
  const mailOptions = {
    from: 'eriedistributor@gmail.com', // Your Gmail account
    to: 'eriedistributor@gmail.com', // Where the contact form details will be sent
    subject: 'New Contact Us Message',
    html: `
      <h3>New Contact Us Message</h3>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>Message:</strong> ${message}</p>
    `,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending contact email:', error);
      return res.status(500).send({ message: 'Failed to send email' });
    }
    console.log('Contact email sent:', info.response);
    res.status(200).send({ message: 'Contact message sent successfully' });
  });
});



app.post('/check-user', async (req, res) => {
  const { email } = req.body;

  try {
    // Check if the user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(200).json({ message: 'User exists', userId: existingUser._id,usertype:existingUser.usertype });
    } else {
      return res.status(404).json({ message: 'User does not exist' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
});

app.post('/registerGoogleUser', async (req, res) => {
  const { name, email, contact,password,usertype } = req.body;

  try {
    // Check if the user already exists
    let existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create a new user
    const newUser = new User({
      name,
      email,
      contact,
      password: password || 'GoogleUserPassword', 
      usertype: usertype,
    });

    await newUser.save();
    return res.status(201).json({ message: 'User registered successfully', userId: newUser._id });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
}); 


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
app.get('/subcategories/:categoryId/:userId', async (req, res) => {
  const { userId, categoryId } = req.params;

  try {
    // Fetch all subcategories based on categoryId
    const subcategories = await SubCategory.find({ categoryId });

    if (userId) {
      // Fetch updated prices for the user
      const userPrices = await UserPrice.find({ userId });

      // Create a map for quick lookup of user prices by subcategoryId
      const userPriceMap = userPrices.reduce((map, price) => {
        map[price.subcategoryId] = price.updatedPrice;
        return map;
      }, {});

      // Merge the updated prices with subcategories
      const updatedSubcategories = subcategories.map((subcategory) => {
        return {
          ...subcategory._doc, // Use ._doc to get the raw subcategory data
          price: userPriceMap[subcategory._id.toString()] || subcategory.price, // Override price if updatedPrice exists
        };
      });

      return res.json(updatedSubcategories);
    } else {
      // If no user is logged in, return the default subcategories
      return res.json(subcategories);
    }
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
// API to fetch subcategories with user-specific prices
app.post('/subcategories/user', async (req, res) => {
  const { ids, userId } = req.body; // Expecting subcategory IDs and userId
  if (!userId) {
    return res.status(400).json({ message: 'User ID is required' });
  }

  try {
    // Fetch subcategories based on the provided IDs
    const subcategories = await SubCategory.find({ _id: { $in: ids } });

    // Fetch user-specific prices for the subcategories
    const userPrices = await UserPrice.find({ userId, subcategoryId: { $in: ids } });

    // Create a map for quick lookup of user prices by subcategoryId
    const userPriceMap = userPrices.reduce((map, price) => {
      map[price.subcategoryId] = price.updatedPrice;
      return map;
    }, {});

    // Merge user prices with subcategories
    const updatedSubcategories = subcategories.map((subcategory) => {
      return {
        ...subcategory._doc, // Use ._doc to get the raw subcategory data
        price: userPriceMap[subcategory._id.toString()] || subcategory.price, // Override price if user-specific price exists
      };
    });

    return res.status(200).json(updatedSubcategories);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error', error });
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



app.post('/update-profile', async (req, res) => {
  const { userId, name } = req.body;

  try {
    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update user name
    user.name = name || user.name; // Update name if provided
    await user.save(); // Save the updated user

    res.status(200).json({ message: 'Profile updated successfully', user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST endpoint to update user password without checking the old password
app.post('/update-password', async (req, res) => {
  const { userId, newPassword, confirmPassword } = req.body;

  try {
    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if the new password and confirm password match
    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: 'New password and confirm password do not match' });
    }

    // Hash the new password and update it
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedNewPassword;
    await user.save(); // Save the updated user

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});





// cart
app.post('/cart/add', async (req, res) => {
  const { userId, subcategoryId } = req.body;

  if (!userId || !subcategoryId) {
    return res.status(400).json({ error: 'userId and subcategoryId are required' });
  }

  try {
    const existingItem = await Cart.findOne({ userId, subcategoryId });

    if (existingItem) {
      // If the item is already in the cart, update the quantity
      existingItem.quantity += 1;
      await existingItem.save();
      return res.status(200).json({ message: 'Item quantity updated', cartItem: existingItem });
    }

    const cartItem = new Cart({ userId, subcategoryId });
    await cartItem.save();

    res.status(201).json({ message: 'Item added to cart successfully', cartItem });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add item to cart' });
  }
});

app.post('/cart/update-quantity', async (req, res) => {
  const { userId, subcategoryId, quantity } = req.body;

  console.log(userId,'userId',subcategoryId,'subcategoryId',quantity,'quantity')

  if (!userId || !subcategoryId || quantity == null) {
    return res.status(400).json({ error: 'userId, subcategoryId, and quantity are required' });
  }

  try {
    const cartItem = await Cart.findOne({ userId, subcategoryId });

    if (!cartItem) {
      return res.status(404).json({ error: 'Item not found in cart' });
    }

    cartItem.quantity = quantity;
    await cartItem.save();

    res.status(200).json({ message: 'Quantity updated successfully', cartItem });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update quantity' });
  }
});

// Get all Cart items for a user
// app.get('/cart/:userId', async (req, res) => {
//   const { userId } = req.params;
//   try {
//     const cartItems = await Cart.find({ userId });
//     console.log(cartItems,'items cart')
//     res.status(200).json(cartItems);
//   } catch (error) {
//     res.status(500).json({ error: 'Failed to fetch cart items' });
//   }
// });
app.get('/cart/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    // Fetch all cart items for the user
    const cartItems = await Cart.find({ userId });
    
    // Get all subcategory IDs in the cart
    const subcategoryIds = cartItems.map(item => item.subcategoryId);
    
    // Fetch all subcategories in the cart
    const subcategories = await SubCategory.find({ _id: { $in: subcategoryIds } });
    
    // Fetch user-specific prices for subcategories
    const userPrices = await UserPrice.find({ userId, subcategoryId: { $in: subcategoryIds } });
    
    // Merge updated prices into cart items
    const updatedCartItems = cartItems.map((cartItem) => {
      // Find the corresponding subcategory
      const subcategory = subcategories.find(sub => sub._id.toString() === cartItem.subcategoryId);

      // Find the updated price for the subcategory (if it exists)
      const userPrice = userPrices.find(price => price.subcategoryId === cartItem.subcategoryId);

      // Use the updated price if available, otherwise use the default subcategory price
      const price = userPrice ? userPrice.updatedPrice : subcategory.price;

      return {
        ...cartItem._doc, // Use ._doc to get the raw cart item data
        price, // Add the price field with updated or default price
        subcategoryName: subcategory.name, // Optionally add subcategory details
      };
    });
    // Return the updated cart items
    res.status(200).json(updatedCartItems);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch cart items' });
  }
});


app.delete('/cart/remove', async (req, res) => {
  const { userId, subcategoryId } = req.body;

  if (!userId || !subcategoryId) {
    return res.status(400).json({ error: 'userId and subcategoryId are required' });
  }

  try {
    const cartItem = await Cart.findOne({ userId, subcategoryId });

    if (!cartItem) {
      return res.status(404).json({ error: 'Item not found in cart' });
    }

    if (cartItem.quantity > 1) {
      // Decrease quantity
      cartItem.quantity -= 1;
      await cartItem.save();
    } else {
      // Remove item if quantity is 1
      await Cart.deleteOne({ userId, subcategoryId });
    }

    res.status(200).json({ message: 'Item removed from cart successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to remove item from cart' });
  }
});


app.delete('/cart/empty', async (req, res) => {
  const { userId } = req.body;
  try {
    await Cart.deleteMany({ userId }); // Assuming CartModel is your cart schema
    res.status(200).send('Cart emptied successfully');
  } catch (error) {
    res.status(500).send('Error emptying cart');
  }
});



// for order
app.get('/orders', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.status(200).json(orders); // Return orders in JSON format
  } catch (error) {
    res.status(500).json({ message: 'Error fetching orders', error: error.message });
  }
});

// API to update fulfillment status of an order
app.put('/orders/:id', async (req, res) => {
  const { id } = req.params;
  const { fulfilled } = req.body;

  try {
    const order = await Order.findById(id); // Find the order by ID
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Update the fulfillment status
    order.fulfilled = fulfilled;
    await order.save(); // Save the updated order

    res.status(200).json({ message: 'Order updated successfully', order });
  } catch (error) {
    res.status(500).json({ message: 'Error updating order', error: error.message });
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
