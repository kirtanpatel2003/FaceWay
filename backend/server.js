require("dotenv").config();
const express = require("express");
const session = require("express-session");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const fs = require("fs");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());

const DB_PATH = "./face_recognition.db";
if (!fs.existsSync(DB_PATH)) {
  console.log("Database not found, creating one...");
  fs.writeFileSync(DB_PATH, "");
}
const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) console.error("Database Error:", err);
  else console.log("Connected to database.");
});

db.run(`CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  visits INTEGER DEFAULT 0
)`);

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    (accessToken, refreshToken, profile, done) => {
      return done(null, profile);
    }
  )
);

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));


app.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));

app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    res.redirect("http://localhost:3000/dashboard");
  }
);

app.get("/logout", (req, res) => {
  req.logout(() => {
    res.redirect("/");
  });
});

app.get("/auth/status", (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ authenticated: true, user: req.user });
  } else {
    res.json({ authenticated: false });
  }
});

const FACE_STORAGE_DIR = path.join(__dirname, "public/known_faces/");
if (!fs.existsSync(FACE_STORAGE_DIR)) fs.mkdirSync(FACE_STORAGE_DIR, { recursive: true });

app.post("/register", (req, res) => {
  const { name, email, descriptor } = req.body;

  if (!email || !descriptor) {
    return res.status(400).json({ success: false, message: "Missing email or face descriptor." });
  }

  const faceDataPath = path.join(FACE_STORAGE_DIR, `${email}.json`);
  fs.writeFileSync(faceDataPath, JSON.stringify(descriptor));

  db.run(
    "INSERT INTO users (name, email, visits) VALUES (?, ?, 0) ON CONFLICT(email) DO NOTHING",
    [name, email],
    (err) => {
      if (err) return res.json({ success: false, error: err.message });
      res.json({ success: true, message: "User registered and face data saved!" });
    }
  );
});

app.post("/recognize", (req, res) => {
  const { descriptor } = req.body;

  if (!descriptor) {
    return res.status(400).json({ success: false, message: "Missing face descriptor." });
  }

  const userDescriptor = Array.isArray(descriptor) ? descriptor : Object.values(descriptor);

  const faceFiles = fs.readdirSync(FACE_STORAGE_DIR);
  let bestMatch = null;
  let bestDistance = Infinity;

  faceFiles.forEach((file) => {
    const faceDataPath = path.join(FACE_STORAGE_DIR, file);
    const savedDescriptor = JSON.parse(fs.readFileSync(faceDataPath, "utf-8"));

    const savedArray = Array.isArray(savedDescriptor) ? savedDescriptor : Object.values(savedDescriptor);

    let distance = calculateDistance(userDescriptor, savedArray);
    if (distance < bestDistance) {
      bestDistance = distance;
      bestMatch = file.replace(".json", "");
    }
  });

  if (bestMatch && bestDistance < 0.6) {
    db.run("UPDATE users SET visits = visits + 1 WHERE email = ?", [bestMatch]);
    return res.json({ success: true, message: `Welcome back, ${bestMatch}!`, email: bestMatch });
  } else {
    return res.json({ success: false, message: "User not recognized." });
  }
});


function calculateDistance(desc1, desc2) {
    const array1 = Array.isArray(desc1) ? desc1 : Object.values(desc1);
    const array2 = Array.isArray(desc2) ? desc2 : Object.values(desc2);
  
    return Math.sqrt(array1.reduce((sum, val, i) => sum + (val - array2[i]) ** 2, 0));
  }
  
app.get("/", (req, res) => {
  res.send("Server is running!");
});

const PORT = process.env.PORT || 1234;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
