const jwt = require("jsonwebtoken");

const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const verify = jwt.verify(token, "asdfghjkl");
    if (verify) {
      req.token = token;
      req.userId = verify.id;
      next();
    }
  } catch (e) {
    res
      .status(401)
      .send({ error: "YOUR SESSION HAS EXPIRED. PLEASE LOGIN AGAIN." });
  }
};

module.exports = auth;