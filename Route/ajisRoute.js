const express = require("express");
const router = express.Router();

const { vistorsMsg, getVistorsMsg } = require("../Controller/Ajis/Ajismessage");

router.post("/vistorsmsg", vistorsMsg);
router.get("/getvistorsmsg", getVistorsMsg);

module.exports = router;
