const User = require ("../models/user.js");
const bcrypt = require ("bcrypt");
const JWT = require ("jsonwebtoken");

// //generate token
// async function generateToken(userId){
//   const token = JWT.sign({id: userId}, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRATION}) 
//   return token;
// }


//function to update levels dynamically
const updateLevels = async (userId, referredUserId, currentLevel = 1) => {
  if (currentLevel > 5) return; // Stop at level 5

  const user = await User.findById(userId);
  if (!user) return;

  // Ensure levels object exists
  if (!user.levels) user.levels = {};

  // Add the referred user to the current level
  const levelKey = `level${currentLevel}`;
  if (!user.levels[levelKey]) user.levels[levelKey] = [];
  user.levels[levelKey].push(referredUserId);

  // Save the updated user
  await user.save();

  // Update the next level for the referrer
  if (user.refBy) {
    console.log(`Recursively updating levels for RefBy User ID: ${user.refBy}`);
    await updateLevels(user.refBy, referredUserId, currentLevel + 1);
  }
};


// User Signup
const signup = async (req, res) => {
  const { username, email, password, refBy } = req.body;

  // Validate input
  if (!username || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    let referrer;
    // Check for referral if provided
    if (refBy) {
      referrer = await User.findById(refBy);
      if (!referrer) {
        return res.status(400).json({ message: "Invalid reference ID" });
      }
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the new user
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      refBy: referrer ? referrer._id : null,
      referredUsers: [],
      levels: {},
    });

    

    // Update the referredUsers and levels if referral exists
    if (referrer) {
      referrer.referredUsers.push(user._id);
      await referrer.save();

      // Update the levels hierarchy for the referrer and their chain
      await updateLevels(referrer._id, user._id);
    }

    return res.status(201).json({ message: "User registered successfully!", user });
  } catch (err) {
    console.error("User registration failed!", err);
    return res.status(500).json({ message: "Server error during registration" });
  }
};



//Get UserDetails
const userDetails = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    .populate({
     path: "referredUsers",
     select: "username"
    }).select("-password");
    
    if (!user) {
      return res.status(400).json({ message: "User Not Found" });
    }
    
    res.json(user);

  } catch (error) {
    console.error("something went wrong", error);
  }
}

//user login
const login = async (req, res) => {
  try{
    const {email, password} = req.body;
    //check if user exist
    const user = await User.findOne({ email });
    if(!user) return res.status(400).json("email not found!");
    
    //validate password
    const validPassword = await bcrypt.compare(password, user.password);
    if(!validPassword) return res.status(400).json("Incorrect email or password!");

    const token = await generateToken(user.id); 
      return res.status(200).json({
        message: "Login Successful",
        token:token,
        user: user
      })


  }catch(err){
     console.log("Login faild!", err);
  }
 

}



module.exports = {
    signup,
    login,
    userDetails,
}