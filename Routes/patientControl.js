const bcrypt = require("bcrypt");
const jwtUtils = require("../Utils/jwt.utils");
const models = require("../models");

const EMAIL_REGEX =
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const PASSWORD_REGEX = /^(?=.*\d).{4,8}$/;
module.exports = {
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
    if (!EMAIL_REGEX.test(mail_patient)) {
      res.status(400).json({
        error: "remplissez correctement l'email",
      });
    }
    if (!PASSWORD_REGEX.test(motpasse_patient)) {
      res.status(400).json({
        error: "le mot de passe n'est repond pas au norme de securité requis ",
      });
    }

    if (phone_patient.length >= 10 || phone_patient.length <= 9) {
      res.status(400).json({
        error: "le numéro de téléphone est incorrect",
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
                motpasse_patient: bcryptPass,
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
  login: (req, res) => {
    const { telephone, motpasse } = req.body;

    if (telephone === null || motpasse === null) {
      res.status(400).json({ error: "les informations incompletes" });
    }
    models.patient
      .findOne({
        where: { phone_patient: telephone },
      })
      .then((patient) => {
        if (patient) {
          bcrypt.compare(
            motpasse,
            patient.motpasse_patient,
            (errBcrypt, resBcrypt) => {
              if (resBcrypt) {
                return res.status(200).json({
                  patientId: patient.id,
                  token: jwtUtils.generateTokenForPatient(patient),
                });
              } else {
                return res
                  .status(403)
                  .json({ error: "Mot de passe invalide  _ " + resBcrypt });
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
};
