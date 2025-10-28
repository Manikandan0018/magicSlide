import express from "express";
import passport from "passport";
import dotenv from "dotenv";

dotenv.config(); // ✅ Ensure env is available here too

const router = express.Router();

// ✅ Step 1: Google login
router.get(
  "/google",
  passport.authenticate("google", {
    scope: [
      "profile",
      "email",
      "https://www.googleapis.com/auth/gmail.readonly",
    ],
    accessType: "offline",
    prompt: "consent",
  })
);

// ✅ Step 2: Google callback
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${process.env.CLIENT_URL}/`,
  }),
  (req, res) => {
    console.log("✅ Login successful, redirecting...");
    res.redirect(`${process.env.CLIENT_URL}/dashboard`);
  }
);

// ✅ Step 3: Get current logged-in user
router.get("/user", (req, res) => {
  if (req.isAuthenticated()) {
    return res.json({ user: req.user });
  } else {
    return res.status(401).json({ message: "Unauthorized" });
  }
});

// ✅ Step 4: Logout
router.post("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    req.session.destroy(() => {
      res.clearCookie("connect.sid");
      res.json({ message: "Logged out" });
    });
  });
});

export default router;
