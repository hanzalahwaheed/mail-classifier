import passport from "passport";
import { Strategy as GoogleStrategy, Profile } from "passport-google-oauth20";
import dotenv from "dotenv";

dotenv.config();

interface User {
  id: string;
  displayName: string;
  name: {
    familyName: string;
    givenName: string;
  };
  emails: Array<{ value: string }>;
  photos: Array<{ value: string }>;
  accessToken: string;
}

// Passport configuration
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      callbackURL: "http://localhost:3000/auth/google/callback",
    },
    (accessToken, refreshToken, profile: Profile, done) => {
      // Create a new User object with properties from the Profile object
      const user: User = {
        id: profile.id,
        displayName: profile.displayName,
        name: profile.name
          ? {
              familyName: profile.name.familyName || "",
              givenName: profile.name.givenName || "",
            }
          : { familyName: "", givenName: "" },
        emails: profile.emails || [],
        photos: profile.photos || [],
        accessToken,
      };
      return done(null, user);
    }
  )
);

passport.serializeUser((user: any, done) => {
  done(null, user);
});

passport.deserializeUser((obj: any, done) => {
  done(null, obj);
});
