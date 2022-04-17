const express = require("express");
const patientControl = require("./Routes/patientControl");

exports.router = (() => {
  const apiRouter = express.Router();
  apiRouter.route("/patients/login").post(patientControl.login);
  apiRouter.route("/patients/registre").post(patientControl.registre);
  apiRouter.route("/patients/me").get(patientControl.getPatientProfil);
  apiRouter.route("/patients/me").put(patientControl.updatePatientId);
  apiRouter
    .route("/patients/updatePassword")
    .put(patientControl.updatePasswordPatientId);
  return apiRouter;
})();
