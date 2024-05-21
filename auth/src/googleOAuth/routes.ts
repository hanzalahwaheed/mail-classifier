import express from "express";
import passport from "passport";
import axios from "axios";

const router = express.Router();

router.get(
  "/google",
  passport.authenticate("google", {
    scope: [
      "https://www.googleapis.com/auth/plus.login",
      "https://www.googleapis.com/auth/gmail.addons.current.message.readonly",
    ],
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    // Successful authentication, redirect to profile.
    res.redirect("/auth/profile");
  }
);

router.get("/profile", (req, res) => {
  if (!req.isAuthenticated()) {
    return res.redirect("/");
  }

  res.send(`<h1>Profile</h1><p>${JSON.stringify(req.user)}</p>
    <a href="/auth/unread-emails">Get Unread Emails</a>`);
});

router.get("/unread-emails", async (req, res) => {
  if (!req.isAuthenticated() || !req.user) {
    return res.redirect("/");
  }

  const accessToken = (req.user as any).accessToken;

  console.log("accesstoken", accessToken);

  try {
    const response = await axios.get(
      "https://www.googleapis.com/gmail/v1/users/me/messages",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          q: "is:unread",
        },
      }
    );
    console.log("emails api response", response);
    const messages = response.data.messages;
    res.send(`<h1>Unread Emails</h1><p>${JSON.stringify(messages)}</p>`);
  } catch (error) {
    res.status(500).send(`Error fetching unread emails: ${error}`);
  }
});

router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.redirect("/");
    }
    res.redirect("/");
  });
});

export default router;
