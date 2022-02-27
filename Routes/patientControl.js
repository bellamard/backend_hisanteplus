const bcrypt = require("bcrypt");
const jwtUtils = require("../Utils/jwt.utils");
const models = require("../models");

module.exports = {
  login: (req, res) => {
    const { email, password } = req.body;

    if (email === null || password === null) {
      res.status(400).json({ error: "les informations incompletes" });
    }
    models.patient
      .findOne({
        where: { mail_patient: email },
      })
      .then((patient) => {
        if (patient) {
          bcrypt.compare(
            password,
            patient.motpasse_patient,
            (errBcrypt, resBcrypt) => {
              if (resBcrypt) {
                return res.status(200).json({
                  patientId: patient.id,
                  token: jwtUtils.generateTokenForPatient(patient),
                });
              } else {
                return res.status(403).json({ error: "Mot de passe invalide" });
              }
            }
          );
        } else {
          return res.status(404).json({ error: "le Patient n'existe pas" });
        }
      })
      .catch((err) => {
        return res.status(500).json({ error: `${err}. verifier la connexion` });
      });
  },
  registre: (req, res) => {
    const {
      nom_patient,
      phone_patient,
      motpasse_patient,
      adresse_patient,
      sexe_patient,
      mail_patient,
    } = req.body;

    if (
      nom_patient === null ||
      phone_patient === null ||
      motpasse_patient === null ||
      adresse_patient === null ||
      sexe_patient === null ||
      mail_patient === null
    ) {
      res.status(400).json({
        error: "Veuillez remplir tous les champs",
      });
    }
    //
    models.patient
      .findOne({
        attributes: ["phone_patient"],
        where: { phone_patient: phone_patient },
      })
      .then((patient) => {
        if (!patient) {
          bcrypt.hash(motpasse_patient, 10, (error, bcryptPass) => {
            const new_patient = models.patient
              .create({
                nom_patient: nom_patient,
                phone_patient: phone_patient,
                motpasse_patient: motpasse_patient,
                adresse_patient: adresse_patient,
                sexe_patient: sexe_patient,
                mail_patient: mail_patient,
              })
              .then((new_patient) => {
                return res.status(201).json({
                  patientId: new_patient.id,
                  mailPatient: new_patient.mail_patient,
                });
              })
              .catch((err) => {
                return res
                  .status(500)
                  .json({ error: `${err}. le patient n'est pas ajouter` });
              });
          });
        } else {
          return res
            .status(409)
            .json({ error: "le numéro du patient existe déjà " });
        }
      })
      .catch((err) => {
        return res
          .status(500)
          .json({ error: "Une erreur est survenue dans le serveur" });
      });
    //
  },
};
