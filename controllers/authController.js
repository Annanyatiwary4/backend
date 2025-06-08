import { User } from "../models/User.models.js";
import bcrypt from "bcrypt";
import { generateTokenAndSetCookie } from "../utils/Tokengenerate.js";
import crypto from "crypto";
import dotenv from "dotenv";
import { sendPasswordResetEmail, sendVerificationEmail } from "../utils/emails.js";
dotenv.config();
 


//register user
export const register = async (req, res) => {
  const { email, password, name } = req.body;

  try{
    if(!email || !password || !name) {
      throw new Error("All fields are required");
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ msg: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10); //hashing the password  
    const verificationToken = Math.floor(100000 + Math.random() * 900000).toString(); //generate a random token
    const user = new User({
      email,
      password: hashedPassword,
      name,
      verificationToken,
      verificationExpiresAt: Date.now() + 24 * 60 * 60 * 1000, //token valid for 24 hours
    });

    await user.save();

    //jwt token generation
    generateTokenAndSetCookie(res, user._id);



    //send verification email
  await  sendVerificationEmail(user.email, user.verificationToken, user.name);
   
    res.status(201).json({
      success: true,
      msg: "User registered successfully. Please check your email to verify your account.",
      user: {...user._doc, password: undefined }, // Exclude password from response
    });

  }
  catch (error) {
    console.error("❌ Error during registration:", error);
    return res.status(500).json({ msg: "Internal server error" });
  }
  
};

//verify email
export const verifyEmail = async (req, res) => {
  const {code} = req.body;
  try {

    const user = await User.findOne({
    verificationToken : code,
    verificationExpiresAt:   { $gt: Date.now()}
  })

  if(!user){
    return res.status(400).json({success:false,message:"Invalid or expired verification code"});
  }
  user.isVerified = true;
  user.verificationToken = undefined; // Clear the verification token
  user.verificationExpiresAt = undefined; // Clear the expiration time
  await user.save();

  res.status(200).json({
    success: true,
    msg: "Email verified successfully. You can now log in.",
  });
}
catch (error) {
    console.error("❌ Error during email verification:", error);
    return res.status(500).json({ msg: "Internal server error" });
}
};

//login user
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      throw new Error("Email and password are required");
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ msg: "Invalid email or password" });
    }

    if (!user.isVerified) {
      return res.status(403).json({ msg: "Please verify your email before logging in" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({ msg: "Invalid email or password" });
    }

    // Update last login time
    user.lastlogin = new Date();
    await user.save();

    // Generate JWT token and set cookie
    generateTokenAndSetCookie(res, user._id);

    res.status(200).json({
      success: true,
      msg: "Login successful",
      user: { ...user._doc, password: undefined }, // Exclude password from response
    });
  } catch (error) {
    console.error("❌ Error during login:", error);
    return res.status(500).json({ msg: "Internal server error" });
  }
};

//logout user
export const logout = (req, res) => {
  try {
    res.clearCookie("token"); // Clear the authentication cookie
    res.status(200).json({ success: true, msg: "Logged out successfully" });
  } catch (error) {
    console.error("❌ Error during logout:", error);
    return res.status(500).json({ msg: "Internal server error" });
  }
};

//forgot password

export const forgotPassword = async (req, res) => {
  const {email} = req.body;
  try {
    if (!email) {
      return res.status(400).json({ msg: "Email is required" });
    }
  
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    //generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetExpiresAt = Date.now() + 15 * 60 * 1000; // Token valid for 15 minutes
    user.resetpasswordToken = resetToken;
    user.resetpasswordExpiresAt = resetExpiresAt;
    await user.save();
  


  //send reset password email

  await sendPasswordResetEmail(user.email, `${process.env.CLIENT_URL}/reset-password/${resetToken}`, user.name);

  }catch (error) {
    console.error("❌ Error during forgot password:", error);
    return res.status(500).json({ msg: "Internal server error" });
  }
};


//reset password
export const ResetPassword = async (req, res) => {
  

  try {
    const { token} = req.params; // Get token from URL parameters
    const { newPassword } = req.body; // Get new password from request body
    if (!token || !newPassword) {
      return res.status(400).json({ msg: "Token and new password are required" });
    }

    const user = await User.findOne({
      resetpasswordToken: token,
      resetpasswordExpiresAt: { $gt: Date.now() }, // Check if token is still valid
    });

    if (!user) {
      return res.status(400).json({ msg: "Invalid or expired reset token" });
    }

    // Hash the new password
    user.password = await bcrypt.hash(newPassword, 10);
    user.resetpasswordToken = undefined; // Clear the reset token
    user.resetpasswordExpiresAt = undefined; // Clear the expiration time
    await user.save();

    res.status(200).json({ success: true, msg: "Password reset successfully" });
  } catch (error) {
    console.error("❌ Error during password reset:", error);
    return res.status(500).json({ msg: "Internal server error" });
  }
};


//check auth
export const checkAuth = async (req, res) => {
	try {
		const user = await User.findById(req.userId).select("-password");
		if (!user) {
			return res.status(400).json({ success: false, message: "User not found" });
		}

		res.status(200).json({ success: true, user });
	} catch (error) {
		console.log("Error in checkAuth ", error);
		res.status(400).json({ success: false, message: error.message });
	}
};