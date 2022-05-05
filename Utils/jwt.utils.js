const jwt = require("jsonwebtoken");

const JWT_SIGN_TOKEN =
  "$2a$10$JXGRs/1BBCtpwtwBjvlBKOfMnHOkG7cNfzYaieYss3xaOPDRDa2n.";

module.exports = {
  generateTokenForPatient: (patientData) => {
    return jwt.sign(
      {
        patientId: patientData.id,
      },
      JWT_SIGN_TOKEN,
      {
        expiresIn: "24h",
      }
    );
  },
  parseAuthorization: (authorization) => {
    return authorization != null ? authorization.replace("Bearer ", "") : null;
  },
  getPatientId: (authorization) => {
    let patId = -1;
    const token = module.exports.parseAuthorization(authorization);
    if (token != null) {
      try {
        const jwtToken = jwt.verify(token, JWT_SIGN_TOKEN);

        if (jwtToken != null) {
          patId = jwtToken.patientId;
        }
      } catch (e) {}
    }

    return patId;
  },
};
