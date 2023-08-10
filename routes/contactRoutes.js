const express = require("express");
const router = express.Router();
const validateToken = require("../middleware/validateTokenHandler");

const {getContact, createContact, updateContact, deleteContact, fetchContact} = require("../controllers/contactController");


router.use(validateToken)
router.route("/").get(fetchContact);
router.route("/:id").get(getContact);

router.route("/").post(createContact);

router.route("/:id").put(updateContact);
router.route("/:id").delete(deleteContact);

module.exports = router;

