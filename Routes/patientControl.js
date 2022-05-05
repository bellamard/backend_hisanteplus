const bcrypt = require("bcrypt");
const jwtUtils = require("../Utils/jwt.utils");
const models = require("../models");
const async_Lib = require("async");

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
      return res.status(400).json({
        error: "Veuillez remplir tous les champs",
      });
    } //
    if (nom_patient.length <= 2) {
      return res.status(400).json({
        error: "remplissez correctement les noms",
      });
    }
    //
    if (!EMAIL_REGEX.test(mail_patient)) {
      return res.status(400).json({
        error: "remplissez correctement l'email",
      });
    }
    if (!PASSWORD_REGEX.test(motpasse_patient)) {
      return res.status(400).json({
        error: "le mot de passe n'est repond pas au norme de securité requis ",
      });
    }

    if (phone_patient.length > 10 || phone_patient.length < 9) {
      return res.status(400).json({
        error: "le numéro de téléphone est incorrect",
      });
    }
    //

    async_Lib.waterfall([
      (done) => {
        models.patient
          .findOne({
            attributes: ["phonePatient"],
            where: { phonePatient: phone_Patient },
          })
          .then((patient) => {
            done(null, patient);
          })
          .catch((err) => {
            return res.status(500).json({
              error: "Une erreur est survenue dans le serveur!!! " + err,
            });
          });
      },
      (patient, done) => {
        if (!patient) {
          bcrypt.hash(motpasse_patient, 10, (error, bcryptPass) => {
            done(null, patient, bcryptPass);
          });
        } else {
          return res.status(403).json({ error: "un probleme de Hashing" });
        }
      },
    ]);

    models.patient
      .findOne({
        attributes: ["phonePatient"],
        where: { phonePatient: phone_patient },
      })
      .then((patient) => {
        if (!patient) {
          bcrypt.hash(motpasse_patient, 10, (error, bcryptPass) => {
            const new_patient = models.patient
              .create({
                nomPatient: nom_patient,
                phonePatient: phone_patient,
                passwordPatient: bcryptPass,
                adressPatient: adresse_patient,
                sexePatient: sexe_patient,
                mailPatient: mail_patient,
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
          .json({ error: "Une erreur est survenue dans le serveur " + err });
      });
    //
  },
  login: (req, res) => {
    const { telephone, motpasse } = req.body;

    if (telephone === "" || motpasse === "") {
      res.status(400).json({ error: "les informations incompletes" });
    }
    models.patient
      .findOne({
        where: { phonePatient: telephone },
      })
      .then((patient) => {
        if (patient) {
          bcrypt.compare(
            motpasse,
            patient.passwordPatient,
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

  getPatientProfil: (req, res) => {
    const headerAuth = req.headers["authorization"];
    const userId = jwtUtils.getPatientId(headerAuth);

    if (userId < 0) {
      return res
        .status(400)
        .json({ error: "vous avez un probleme de token!!! " });
    }

    models.patient
      .findOne({
        attributes: ["id", "nomPatient", "phonePatient"],
        where: { id: userId },
      })
      .then((patient) => {
        if (patient) {
          res.status(201).json(patient);
        } else {
          res.status(404).json({ error: "le patient n'existe pas" });
        }
      })
      .catch((err) => {
        res.status(500).json({ error: "l'operation n'a pas aboutir" });
      });
  },
  updatePatientId: (req, res) => {
    const headerAuth = req.headers["authorization"];
    const userId = jwtUtils.getPatientId(headerAuth);
    const adress = req.body.adress;
    async_Lib.waterfall(
      [
        (data) => {
          models.patient
            .findOne({
              attributes: ["id", "adressPatient"],
              where: { id: userId },
            })
            .then((patientfound) => data(null, patientfound))
            .catch((err) => {
              return res
                .status(500)
                .json({ error: "un probleme de verification du patient" });
            });
        },
        (patientfound, data) => {
          if (patientfound) {
            patientfound
              .update({
                adressPatient: adress ? adress : patientfound.adressPatient,
              })
              .then(() => data(patientfound))
              .catch((err) =>
                res
                  .status(500)
                  .json({ error: "ne peut pas modifier l'adresse" })
              );
          } else {
            res.status(404).json({ error: "le patient n'existe pas" });
          }
        },
      ],
      (patientfound) => {
        if (patientfound) {
          return res.status(201).json(patientfound);
        } else {
          return res
            .status(500)
            .json({ error: "tu ne peux modifier l'adresse du patient" });
        }
      }
    );
  },
  updatePasswordPatientId: (req, res) => {
    const headerAuth = req.headers["authorization"];
    const userId = jwtUtils.getPatientId(headerAuth);

    const { password, confirmPassword } = req.body;
    if (!PASSWORD_REGEX.test(confirmPassword)) {
      return res.status(400).json({
        error:
          "votre nouveau mot de passe n'est repond pas au norme de securité requis ",
      });
    } else {
      async_Lib.waterfall(
        [
          (data) => {
            models.patient
              .findOne({
                where: { id: userId },
              })
              .then((patientfound) => {
                if (patientfound) {
                  bcrypt.compare(
                    password,
                    patientfound.passwordPatient,
                    (errBcrypt, resBcrypt) => {
                      if (resBcrypt) {
                        return data(null, patientfound);
                      } else {
                        return res
                          .status(403)
                          .json({ error: " Mot de passe actuel invalide" });
                      }
                    }
                  );
                }
              })
              .catch((err) => {
                return res
                  .status(500)
                  .json({ error: "un probleme de verification du patient" });
              });
          },
          (patientfound, data) => {
            if (patientfound) {
              bcrypt.hash(confirmPassword, 10, (error, bcryptPass) => {
                patientfound
                  .update({
                    passwordPatient: bcryptPass
                      ? bcryptPass
                      : patientfound.passwordPatient,
                  })
                  .then(() => {
                    return data(patientfound);
                  })
                  .catch((err) =>
                    res.status(500).json({
                      error:
                        "ne peut pas modifier le mot de passe. ressayer!!!",
                    })
                  );
              });
            } else {
              res.status(404).json({ error: "le patient n'existe pas" });
            }
          },
        ],
        (patientfound) => {
          if (patientfound) {
            const id = patientfound.id;
            return res
              .status(201)
              .json([{ id, message: " mot de passe modifier" }]);
          } else {
            return res
              .status(500)
              .json({ error: "tu ne peux modifier l'adresse du patient" });
          }
        }
      );
    }
  },
};
