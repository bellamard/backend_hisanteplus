const express = require("express");
const patientControl = require("./Routes/patientControl");

exports.router = (() => {
  const apiRouter = express.Router();
  apiRouter.route("/patients/login").post(patientControl.login);
  apiRouter.route("/patients/registre").post(patientControl.registre);
  return apiRouter;
})();
