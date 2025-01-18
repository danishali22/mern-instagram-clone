import { Post } from "../models/post.js";
import { User } from "../models/user.js";
import {
  ErrorHandler,
  sendToken,
  success,
  TryCatch,
  getDataUri,
  cookieOptions,
} from "../utils/features.js";
import bcrypt from "bcryptjs";
import { v2 as cloudinary } from "cloudinary";

export const register = TryCatch(async (req, res, next) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return next(new ErrorHandler("All required fields must be provided", 400));
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new ErrorHandler("User with this email already exists", 409));
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    username,
    email,
    password: hashedPassword,
  });

  sendToken(res, user, 201, "User created");
});

export const login = TryCatch(async (req, res, next) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username }).select("+password");
  if (!user) return next(new ErrorHandler("Invalid Username or Password", 404));

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch)
    return next(new ErrorHandler("Invalid Username or Password", 404));

  console.log("User Posts:", user.posts);

  const populatedPost = await Promise.all(
    user.posts.map(async(postId) => {
      const post = await Post.findById(postId);
      if(post.author.equals(user._id)){
        return post;
      }
      return null;
    })
  );

  user.posts = populatedPost;

  sendToken(res, user, 200, `Welcome back ${user.name}`);
});

export const logout = TryCatch(async (req, res, next) => {
  return res
    .status(200)
    .cookie("insta-token", "", { ...cookieOptions, maxAge: 0 })
    .json({
      success: true,
      message: "Logout Successfully!",
    });
});

export const getProfile = TryCatch(async (req, res, next) => {
  const user = await User.findById(req.params.id).select("-password");
  if (!user) return new ErrorHandler("User not Found", 404);
  return success(res, "Profile fetched successfully", 200, user);
});

export const editProfile = TryCatch(async (req, res, next) => {
  const userId = req.user;
  const {bio, gender} = req.body;
  const profilePicture = req.file;
  let cloudResponse;

  if(profilePicture){
    const fileUri = getDataUri(profilePicture);
    cloudResponse = await cloudinary.uploader.upload(fileUri);
  }

  const user = await User.findById(userId).select("-password");
  if(!user) return new ErrorHandler("User not Found", 404);

  if (bio) user.bio = bio;
  if (gender) user.gender = gender;
  if (profilePicture) user.profilePicture = cloudResponse.secure_url;

  await user.save();

  return success(res, "Profile updated successfully", 200, user);
});

export const getSuggestedUsers = TryCatch(async (req, res, next) => {
  const suggestedUsers = await User.find({ _id: {$ne: req.user} }).select("-password");
  if (!suggestedUsers) return new ErrorHandler("Currently do not have any users", 404);
  return success(res, "Suggested Users fetched successfully", 200, suggestedUsers);
});

export const followOrUnfollow = TryCatch(async (req, res, next) => {
  const loginUserId = req.user;
  const targetUserId = req.params.id;
  if(loginUserId === targetUserId) return new ErrorHandler("You cannot follow or unfollow yourself", 400);
  
  const loginUser = await User.findById(loginUserId);
  const targetUser = await User.findById(targetUserId);
  if(!loginUser || !targetUser) return new ErrorHandler("User not Found", 404);
  
  const isFollowing = loginUser.following.includes(targetUserId);

  if(isFollowing){
    await Promise.all([
      User.updateOne({_id: loginUserId}, {$pull: {following: targetUserId}}),
      User.updateOne({_id: targetUserId}, {$pull: {followers: loginUserId}}),
    ]);
  return success(
    res,
    "Unfollow user successfully",
    200,
  );
  }
  else{
    await Promise.all([
      User.updateOne(
        { _id: loginUserId },
        { $push: { following: targetUserId } }
      ),
      User.updateOne(
        { _id: targetUserId },
        { $push: { followers: loginUserId } }
      ),
    ]);
    return success(res, "Follow user successfully", 200);
  }
});
