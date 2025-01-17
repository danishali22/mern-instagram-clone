import { User } from "../models/user.js";
import {
  ErrorHandler,
  sendToken,
  success,
  TryCatch,
  getDataUri,
} from "../utils/features.js";
import bcrypt from "bcryptjs";

export const register = TryCatch(async (req, res, next) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return next(new ErrorHandler("All required fields must be provided", 400));
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new ErrorHandler("User with this email already exists", 409));
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  sendToken(res, user, 201, "User created");
});

export const login = TryCatch(async (req, res, next) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username }).select("+password");
  if (!user) return next(new ErrorHandler("Invalid Username or Password", 404));

  const isMatch = await compare(password, user.password);
  if (!isMatch)
    return next(new ErrorHandler("Invalid Username or Password", 404));

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
  const userId = req.params.id;
  const user = User.findById({userId});
  return success(res, "Profile fetched successfully", 200, req.user);
});

export const editProfile = TryCatch(async (req, res, next) => {
  const userId = req.user.id;
  const {bio, gender} = req.body;
  const profilePicture = req.file;
  let cloudResponse;

  if(profilePicture){
    const fileUri = getDataUri(profilePicture);
    cloudResponse = await cloudinary.uploader.upload(fileUri);
  }

  const user = User.findById({userId});
  if(!user) return new ErrorHandler("User not Found", 404);

  if (bio) user.bio = bio;
  if (gender) user.gender = gender;
  if (profilePicture) user.profilePicture = cloudResponse.secure_url;

  await user.save();

  return success(res, "Profile updated successfully", 200, user);
});

export const getSuggestedUsers = TryCatch(async (req, res, next) => {
  const suggestedUsers = User.find({ _id: {$ne: req.user.id} }).select("-password");
  if (!suggestedUsers) return new ErrorHandler("Currently do not have any users", 404);
  return success(res, "Suggested Users fetched successfully", 200, suggestedUsers);
});

export const followOrUnfollow = TryCatch(async (req, res, next) => {
  const loginUserId = req.user.id;
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
