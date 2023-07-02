const jwt = require("jsonwebtoken");


class Helper {

    genToken = (userInfo) => {
      const token = jwt.sign({id: userInfo.id,email: userInfo.email }, "asdfghjkl", {
        expiresIn: "24h",
      });
      userInfo.token = token;
      return token;
    };
}

module.exports = new Helper();