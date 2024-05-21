"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const passport_1 = __importDefault(require("passport"));
const axios_1 = __importDefault(require("axios"));
const router = express_1.default.Router();
router.get("/google", passport_1.default.authenticate("google", {
    scope: [
        "https://www.googleapis.com/auth/plus.login",
        "https://www.googleapis.com/auth/gmail.addons.current.message.readonly",
    ],
}));
router.get("/google/callback", passport_1.default.authenticate("google", { failureRedirect: "/" }), (req, res) => {
    // Successful authentication, redirect to profile.
    res.redirect("/auth/profile");
});
router.get("/profile", (req, res) => {
    if (!req.isAuthenticated()) {
        return res.redirect("/");
    }
    res.send(`<h1>Profile</h1><p>${JSON.stringify(req.user)}</p>
    <a href="/auth/unread-emails">Get Unread Emails</a>`);
});
router.get("/unread-emails", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.isAuthenticated() || !req.user) {
        return res.redirect("/");
    }
    const accessToken = req.user.accessToken;
    console.log("accesstoken", accessToken);
    try {
        const response = yield axios_1.default.get("https://www.googleapis.com/gmail/v1/users/me/messages", {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            params: {
                q: "is:unread",
            },
        });
        console.log("emails api response", response);
        const messages = response.data.messages;
        res.send(`<h1>Unread Emails</h1><p>${JSON.stringify(messages)}</p>`);
    }
    catch (error) {
        res.status(500).send(`Error fetching unread emails: ${error}`);
    }
}));
router.get("/logout", (req, res) => {
    req.logout((err) => {
        if (err) {
            return res.redirect("/");
        }
        res.redirect("/");
    });
});
exports.default = router;
