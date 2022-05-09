const express = require("express");
const patientControl = require("./Routes/patientControl");
const medecinControl = require("./Routes/medecinControl");
const consultatControl = require("./Routes/consultatControl");

exports.router = (() => {
  const apiRouter = express.Router();
  //route patients
  apiRouter.route("/patients/login").post(patientControl.login);
  apiRouter.route("/patients/registre").post(patientControl.registre);
  apiRouter.route("/patients/me").get(patientControl.getPatientProfil);
  apiRouter.route("/patients/all").get(patientControl.getPatients);
  apiRouter.route("/patients/me").put(patientControl.updatePatientId);
  apiRouter
    .route("/patients/updatePassword")
    .put(patientControl.updatePasswordPatientId);
  // route medecin
  apiRouter.route("/medecins/login").post(medecinControl.login);
  apiRouter.route("/medecins/registre").post(medecinControl.registre);
  apiRouter.route("/medecins/me").get(medecinControl.getMedecinProfil);
  apiRouter.route("/medecins/me").put(medecinControl.updateMedecinId);
  apiRouter
    .route("/medecins/updatePassword")
    .put(medecinControl.updatePasswordMedecinId);
  //route consultation
  apiRouter
    .route("/consultations/new")
    .post(consultatControl.createConsultation);
  apiRouter.route("/consultations").get(consultatControl.listConsult);
  apiRouter
    .route("/consultations/:consultationId/edit")
    .put(consultatControl.updateConsult);
  apiRouter
    .route("/consultations/:consultationId/del")
    .delete(consultatControl.deleteConsult);

  return apiRouter;
})();
