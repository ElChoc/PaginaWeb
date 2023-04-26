const express = require("express");
const logincontroller = require("../controllers/logincontroller");

const router = express.Router();

router.get("/login", logincontroller.login);

router.post("/login", logincontroller.auth);

router.get("/register", logincontroller.register);

router.post("/register", logincontroller.storeUser);

router.get("/logout", logincontroller.logout);

router.get("/", logincontroller.showPhrases);

router.post("/", logincontroller.uploadPhrase);

router.get("/gallery", logincontroller.gallery);

router.get("/vip", logincontroller.vip);

router.get("/partyroom", logincontroller.partyRoom);

router.post("/partyroom", logincontroller.sendTable);

router.post("/del", logincontroller.delTable);

router.post("/hom", logincontroller.uploadOrder);

module.exports = router;
