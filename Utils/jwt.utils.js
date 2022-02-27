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
        expiresIn: "1h",
      }
    );
  },
};
