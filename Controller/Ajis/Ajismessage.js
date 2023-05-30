const ajisSiteSchema = require("../../Schema/ajissite");

const getVistorsMsg = async (req, res) => {
  //   const { visitorname, visitoremail, visitorphonenumber, message } = req.body;

  try {
    let msg = await ajisSiteSchema.find({});

    res.status(200).json({ status: "SUCCESS", data: msg });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const vistorsMsg = async (req, res) => {
  const { visitorname, visitoremail, visitorphonenumber, message } = req.body;

  try {
    let msg = new ajisSiteSchema({
      visitorname,
      visitoremail,
      visitorphonenumber,
      message,
    });
    console.log(msg);
    await msg.save();

    res.status(200).json({ status: "SUCCESS", data: msg });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { vistorsMsg, getVistorsMsg };
