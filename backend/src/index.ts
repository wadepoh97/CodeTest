import bodyParser from "body-parser";
import cors from "cors";
import express, { Request, Response } from "express";
import mongoose, { Schema } from "mongoose";

const UserProfileSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  age: {
    type: Number,
  },
  tags: {
    type: [String],
    default: "",
  },
});

const UserProfile = mongoose.model("UserProfile", UserProfileSchema);

export interface IUserProfile {
  _id?: string;
  name: string;
  email: string;
  age?: number;
  tags?: string[];
}
const router = express.Router();

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/userProfileDB");
    console.log("MongoDB Connected...");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

const getAllProfiles = async (req?: Request, res?: Response) => {
  const profiles = await UserProfile.find();
  res.json(profiles);
  return profiles;
};

const getProfileById = async (req: Request, res?: Response) => {
  const allProfiles = await getAllProfiles();
  if (allProfiles.some((profile) => profile._id === req.params.id)) {
    return allProfiles.some((profile) => profile._id === req.params.id);
  }
  return "Hello world";
};

const createProfile = async (req: Request, res: Response) => {
  const newProfile = new UserProfile(req.body);
  const profile = await newProfile.save();
  res.json(profile);
}

const updateProfile = async (req: Request, res: Response) => {
  const profile = (await UserProfile.findById(req.params.id)) as any;
  for (const key of Object.keys(req.body)) {
    profile[key] = req.body[key];
  }
  await profile.save();
  res.json(profile);

  return profile;
};

const deleteProfile = async (req: Request, res: Response) => {
  const profile: any = await getProfileById(req);
  await profile.deleteOne();
  res.json({ msg: "Profile removed" });
  return profile;
};

router.get("/", getAllProfiles);
router.get("/:id", getProfileById);
router.post("/create-user", createProfile);
router.put("/:id", updateProfile);
router.delete("/:id", deleteProfile);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

connectDB();

app.use("/api/users", router);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

export { UserProfile };
