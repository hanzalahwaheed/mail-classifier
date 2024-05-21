import express from "express";
import passport from "passport";
import session from "express-session";
import dotenv from "dotenv";
import authRouter from "./routes";
import "./passportConfig";

dotenv.config();

const app = express();

// Express session configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET || "your-secret-key",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Routes
app.get("/", (req, res) => {
  res.send('<a href="/auth/google">Login with Google</a>');
});

app.use("/auth", authRouter);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
