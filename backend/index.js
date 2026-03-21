require("dotenv").config();

const config = require("./config.json");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const upload = require("./multer");
const path = require("path");
const fs = require("fs");

const { authenticateToken } = require("./utilities");
const User = require("./models/user.model");
const TravelStory = require("./models/travelStory.model");

const app = express();

app.use(express.json());
app.use(cors({ origin: "*" }));

// Serve uploaded images
app.use("/uploads", express.static(path.join(__dirname, "uploads")));






// ================= MONGODB =================

mongoose.connect(config.connectionString)
.then(() => {
  console.log("MongoDB connected");
})
.catch((err) => {
  console.log("MongoDB connection error:", err);
});


// ================= CREATE ACCOUNT =================

app.post("/api/auth/create-account", async (req, res) => {
  try {

    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({
        error: true,
        message: "All fields are required"
      });
    }

    const isUser = await User.findOne({ email });

    if (isUser) {
      return res.status(400).json({
        error: true,
        message: "User already exists"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      fullName,
      email,
      password: hashedPassword,
    });

    await user.save();

    const accessToken = jwt.sign(
      { userId: user._id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "72h" }
    );

    return res.status(201).json({
      error: false,
      user: {
        fullName: user.fullName,
        email: user.email,
      },
      accessToken,
      message: "Account created successfully",
    });

  } catch (error) {
    res.status(500).json({
      error: true,
      message: "Server error",
    });
  }

});


// ================= LOGIN =================

app.post("/api/auth/login", async (req, res) => {

  try {

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: true,
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        error: true,
        message: "Invalid email or password",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({
        error: true,
        message: "Invalid email or password",
      });
    }

    const accessToken = jwt.sign(
      { userId: user._id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "72h" }
    );

    return res.status(200).json({
      error: false,
      user: {
        fullName: user.fullName,
        email: user.email,
      },
      accessToken,
      message: "Login successful",
    });

  } catch (error) {
    res.status(500).json({
      error: true,
      message: "Server error",
    });
  }

});


// ================= GET USER =================

app.get("/api/auth/get-user", authenticateToken, async (req, res) => {

  try {

    const { userId } = req.user;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        error: true,
        message: "User not found",
      });
    }

    return res.json({
      error: false,
      user,
    });

  } catch (error) {
    res.status(500).json({
      error: true,
      message: "Server error",
    });
  }

});


// ================= ADD TRAVEL STORY =================

app.post("/add-travel-story", authenticateToken, async (req, res) => {

  const { title, story, visitedLocation, imageUrl, visitedDate } = req.body;
  const { userId } = req.user;

  if (!title || !story) {
    return res.status(400).json({
      error: true,
      message: "Title and story are required"
    });
  }

  const travelStory = new TravelStory({
    userId,
    title,
    story,
    visitedLocation,
    imageUrl,
    visitedDate
  });

  await travelStory.save();

  res.json({
    error: false,
    message: "Travel story added successfully",
    story: travelStory
  });

});


// ================= GET ALL STORIES =================

app.get("/get-all-travel-stories", authenticateToken, async (req, res) => {

  const { userId } = req.user;

  try {

    const travelStories = await TravelStory.find({ userId }).sort({ createdOn: -1 });

    return res.json({
      error: false,
      stories: travelStories
    });

  } catch (error) {

    return res.status(500).json({
      error: true,
      message: "Server error"
    });

  }

});


// ================= IMAGE UPLOAD =================
app.post("/image-upload", upload.single("image"), (req,res)=>{
  if(!req.file){
    return res.status(400).json({
      error:true,
      message:"No image uploaded"
    });
  }

  const imageUrl = `http://localhost:8000/uploads/${req.file.filename}`;

  res.json({
    error:false,
    imageUrl
  });
});



// Delete image
app.delete("/delete-image", (req, res) => {
  const { imageUrl } = req.body;

  if (!imageUrl) {
    return res.status(400).json({
      error: true,
      message: "Image URL required"
    });
  }

  // Extract filename from URL
  const filename = imageUrl.split("/uploads/")[1];

  const filepath = `uploads/${filename}`;

  fs.unlink(filepath, (err) => {
    if (err) {
      return res.status(500).json({
        error: true,
        message: "Error deleting image"
      });
    }

    res.json({
      error: false,
      message: "Image deleted successfully"
    });
  });
});
//server static files from uploads folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/assets", express.static(path.join(__dirname, "assets")));

// Update Travel Story
app.put("/edit-travel-story/:id", authenticateToken, async (req, res) => {
  try {

    const { id } = req.params;
    const { title, story, visitedLocation, imageUrl, visitedDate } = req.body;
    const { userId } = req.user;

    if (!title || !story || !visitedLocation || !visitedDate) {
      return res.status(400).json({
        error: true,
        message: "All fields are required"
      });
    }

    const travelStory = await TravelStory.findOne({ _id: id, userId });

    if (!travelStory) {
      return res.status(404).json({
        error: true,
        message: "Travel story not found"
      });
    }

    travelStory.title = title;
    travelStory.story = story;
    travelStory.visitedLocation = visitedLocation;
    travelStory.imageUrl = imageUrl;
    travelStory.visitedDate = visitedDate;

    await travelStory.save();

    res.json({
      error: false,
      message: "Travel story updated successfully",
      story: travelStory
    });

  } catch (error) {
    res.status(500).json({
      error: true,
      message: "Server error"
    });
  }
});



// Delete Travel Story
app.delete("/delete-story/:id", authenticateToken, async (req, res) => {
  try {

    const { id } = req.params;
    const { userId } = req.user;

    // Find story
    const travelStory = await TravelStory.findOne({
      _id: id,
      userId: userId
    });

    if (!travelStory) {
      return res.status(404).json({
        error: true,
        message: "Travel story not found"
      });
    }

    // Delete story from DB
    await TravelStory.deleteOne({
      _id: id,
      userId: userId
    });

    // Delete image file if exists
    if (travelStory.imageUrl) {

      const imageUrl = travelStory.imageUrl;
      const filename = path.basename(imageUrl);

      const filePath = path.join(__dirname, "uploads", filename);

      fs.unlink(filePath, (err) => {
        if (err) {
          console.log("Image delete error:", err);
        }
      });

    }

    res.status(200).json({
      error: false,
      message: "Travel story deleted successfully"
    });

  } catch (error) {

    res.status(500).json({
      error: true,
      message: "Server error"
    });

  }
});


// Update isFavorite status
app.put("/update-isFavorite/:id", authenticateToken, async (req, res) => {
  try {

    const { id } = req.params;
    const { isFavorite } = req.body;
    const { userId } = req.user;

    const travelStory = await TravelStory.findOne({
      _id: id,
      userId: userId
    });

    if (!travelStory) {
      return res.status(404).json({
        error: true,
        message: "Travel story not found"
      });
    }

    travelStory.isFavorite = isFavorite;

    await travelStory.save();

    res.json({
      error: false,
      message: "Favorite status updated successfully",
      story: travelStory
    });

  } catch (error) {

    res.status(500).json({
      error: true,
      message: "Server error"
    });

  }
});

//search travel stories
app.get("/search-travel-stories", authenticateToken, async (req, res) => {
  try {

    const { query } = req.query;
    const { userId } = req.user;

    if (!query) {
      return res.status(400).json({
        error: true,
        message: "Search query required"
      });
    }

    const searchResults = await TravelStory.find({
      userId: userId,
      $or: [
        { title: { $regex: query, $options: "i" } },
        { story: { $regex: query, $options: "i" } },
        { visitedLocation: { $regex: query, $options: "i" } }
      ]
    }).sort({ createdOn: -1 });

    res.json({
      error: false,
      stories: searchResults
    });

  } catch (error) {

    res.status(500).json({
      error: true,
      message: "Server error"
    });

  }
});

//filter travel stories by date
app.get("/filter-sort-stories", authenticateToken, async (req, res) => {

  const { startDate, endDate, sort } = req.query;
  const { userId } = req.user;

  const filter = { userId };

  if (startDate && endDate) {
    filter.visitedDate = {
      $gte: new Date(startDate),
      $lte: new Date(endDate)
    };
  }

  const sortOption = sort === "asc" ? 1 : -1;

  const stories = await TravelStory
    .find(filter)
    .sort({ visitedDate: sortOption });

  res.json({
    error: false,
    stories
  });

});


const PORT = 8000;

app.listen(PORT, ()=>{
 console.log("Server running on port " + PORT);
});