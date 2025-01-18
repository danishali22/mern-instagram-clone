import cookieParser from "cookie-parser";
import express, { urlencoded } from "express"
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./utils/db.js";
import { v2 as cloudinary } from "cloudinary";

// routes
import userRoutes from "./routes/user.js";
import postRoutes from "./routes/post.js";
import messageRoutes from "./routes/message.js";

// Load environment variables
dotenv.config({ path: "./.env" });
const mongoUri = process.env.MONGO_URI;
const port = process.env.PORT || 4000;

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(urlencoded({extended: true}));
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

app.use("/api/user", userRoutes);
app.use("/api/post", postRoutes);
app.use("/api/message", messageRoutes);

app.get("/", (req, res) => {
  res.send("Home Route");
});

app.listen(port, ()=> {
    connectDB(mongoUri);
    console.log(`Server listen at port ${port}`)
});
