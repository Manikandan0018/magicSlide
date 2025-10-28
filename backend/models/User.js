import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    googleId: { type: String, required: true, unique: true },
    displayName: String,
    email: String,
    accessToken: String, // refreshable token data
    refreshToken: String, // refresh token (use with caution)
    tokenExpiryDate: Date,
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
