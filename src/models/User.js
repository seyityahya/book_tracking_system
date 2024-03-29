import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    location: {
      type: String,
    },
    website: {
      type: String,
    },
    birthday: {
      type: Date,
    },
    word: {
      type: String,
    },
    story: {
      type: String,
    },
    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    following: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    profilImage: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose?.models?.User || mongoose.model("User", UserSchema);
