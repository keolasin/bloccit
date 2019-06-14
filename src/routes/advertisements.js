const express = require("express");
const router = express.Router();

const advertisementController = require("../controllers/advertisementController");

router.get("/advertisements", advertisementController.index);
router.get("/advertisements/:id", advertisementController.show);

router.post("/advertisements/create", advertisementController.create);
router.post("/advertisements/:id/destroy", advertisementController.destroy);
router.post("/advertisements/:id/update", advertisementController.update);

module.exports = router;
