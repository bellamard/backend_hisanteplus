const express = require("express");
const patientControl = require("./Routes/patientControl");
const medecinControl = require("./Routes/medecinControl");
const consultatControl = require("./Routes/consultatControl");
const maladieControl = require("./Routes/maladiControl");
const interventionControl = require("./Routes/interventionControl");

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
    .route("/consultations/:consultationId")
    .get(consultatControl.getConsult);

  apiRouter
    .route("/consultations/:consultationId/del")
    .delete(consultatControl.deleteConsult);

  //route malade
  apiRouter.route("/malades/:consultationId/").get(maladieControl.getMalade);
  apiRouter
    .route("/malades/:consultationId/")
    .post(maladieControl.createMalade);
  apiRouter.route("/malades/:consultationId/").put(maladieControl.updateMalady);
  apiRouter.route("/malades/:consultationId/");

  //route intervention
  apiRouter
    .route("/interventions/:interventionId")
    .get(interventionControl.getIntervention);

  apiRouter
    .route("/interventions/")
    .get(interventionControl.listMedecinIntervention);
  //les interventions d'un consultation
  apiRouter
    .route("/interventions/consultation/:consultationId")
    .get(interventionControl.listConsultationIntervention);
  //intervention vue par un medecin
  apiRouter
    .route("/interventions/medecin/:interventionId")
    .get(interventionControl.getMedecinIntervention);
  apiRouter
    .route("/interventions/:consultationId")
    .post(interventionControl.createIntervention);
  // apiRouter
  //   .route("/interventions/:interventionId")
  //   .put(interventionControl.updateIntervention);
  // apiRouter
  //   .route("interventions/:interventionId")
  //   .delete(interventionControl.deleteIntervention);

  return apiRouter;
})();
