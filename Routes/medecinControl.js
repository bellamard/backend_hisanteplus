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
      nom_medecin,
      phone_medecin,
      password_medecin,
      num_ordre_medecin,
      specialisation_medecin,
      mail_medecin,
    } = req.body;

    if (
      nom_medecin == null ||
      phone_medecin == null ||
      password_medecin == null ||
      num_ordre_medecin == null ||
      specialisation_medecin == null ||
      mail_medecin == "" ||
      nom_medecin == "" ||
      phone_medecin == "" ||
      password_medecin == "" ||
      num_ordre_medecin == "" ||
      specialisation_medecin == "" ||
      mail_medecin == ""
    ) {
      res.status(400).json({
        error: "Veuillez remplir tous les champs",
      });
    } //
    if (nom_medecin.length <= 2) {
      res.status(400).json({
        error: "remplissez correctement les noms",
      });
    }
    //
    if (!EMAIL_REGEX.test(mail_medecin)) {
      res.status(400).json({
        error: "remplissez correctement l'email",
      });
    }
    if (!PASSWORD_REGEX.test(password_medecin)) {
      res.status(400).json({
        error: "le mot de passe n'est repond pas au norme de securité requis ",
      });
    }

    if (phone_medecin.length > 10 || phone_medecin.length < 9) {
      res.status(400).json({
        error: "le numéro de téléphone est incorrect",
      });
    }
    //

    async_Lib.waterfall([
      (done) => {
        models.medecin
          .findOne({
            attributes: ["numOrdreMedecin"],
            where: { numOrdreMedecin: num_ordre_medecin },
          })
          .then((medecin) => {
            done(null, medecin);
          })
          .catch((err) => {
            return res
              .status(500)
              .json({ error: "Une erreur est survenue dans le serveur" });
          });
      },
      (medecin, done) => {
        if (!medecin) {
          bcrypt.hash(password_medecin, 10, (error, bcryptPass) => {
            done(null, medecin, bcryptPass);
          });
        } else {
          res.status(403).json({ error: "un probleme de Hashing" });
        }
      },
    ]);

    models.medecin
      .findOne({
        attributes: ["numOrdreMedecin"],
        where: { numOrdreMedecin: num_ordre_medecin },
      })
      .then((medecin) => {
        if (!medecin) {
          bcrypt.hash(password_medecin, 10, (error, bcryptPass) => {
            const new_medecin = models.medecin
              .create({
                nomMedecin: nom_medecin,
                phoneMedecin: phone_medecin,
                passwordMedecin: bcryptPass,
                numOrdreMedecin: num_ordre_medecin,
                specialisationMedecin: specialisation_medecin,
                mailMedecin: mail_medecin,
              })
              .then((new_medecin) => {
                return res.status(201).json({
                  medecinId: new_medecin.id,
                  mailMedecin: new_medecin.mailMedecin,
                });
              })
              .catch((err) => {
                return res
                  .status(500)
                  .json({ error: `${err}. le medecin n'est pas ajouter` });
              });
          });
        } else {
          return res
            .status(409)
            .json({ error: "le numéro du medecin existe déjà " });
        }
      })
      .catch((err) => {
        console.warn(err);
        return res
          .status(500)
          .json({ error: "Une erreur est survenue dans le serveur" });
      });
    //
  },
  login: (req, res) => {
    const { numberOrdre, password } = req.body;

    if (
      numberOrdre === "" ||
      password === "" ||
      numberOrdre == null ||
      password == null
    ) {
      return res
        .status(400)
        .json({ error: "les informations sont incompletes" });
    }
    models.medecin
      .findOne({
        where: { numOrdreMedecin: numberOrdre },
      })
      .then((medecin) => {
        if (medecin) {
          bcrypt.compare(
            password,
            medecin.passwordMedecin,
            (errBcrypt, resBcrypt) => {
              if (resBcrypt) {
                return res.status(200).json({
                  medecinId: medecin.id,
                  token: jwtUtils.generateTokenForPatient(medecin),
                });
              } else {
                return res
                  .status(403)
                  .json({ error: "Mot de passe invalide  _ " + resBcrypt });
              }
            }
          );
        } else {
          return res.status(404).json({ error: "le medecin n'existe pas" });
        }
      })
      .catch((err) => {
        return res.status(500).json({ error: `${err}. verifier la connexion` });
      });
  },

  getMedecinProfil: (req, res) => {
    const headerAuth = req.headers["authorization"];
    const userId = jwtUtils.getPatientId(headerAuth);

    if (userId < 0) {
      return res
        .status(400)
        .json({ error: "vous avez un probleme de token!!! " });
    }

    models.medecin
      .findOne({
        attributes: ["id", "nomMedecin", "phoneMedecin"],
        where: { id: userId },
      })
      .then((medecin) => {
        if (medecin) {
          res.status(201).json(medecin);
        } else {
          res.status(404).json({ error: "le patient n'existe pas" });
        }
      })
      .catch((err) => {
        res.status(500).json({ error: "l'operation n'a pas aboutir" });
      });
  },
  updateMedecinId: (req, res) => {
    const headerAuth = req.headers["authorization"];
    const userId = jwtUtils.getPatientId(headerAuth);
    const { phone, specialisation } = req.body;
    async_Lib.waterfall(
      [
        (data) => {
          models.medecin
            .findOne({
              attributes: ["id", "phoneMedecin, specialisationMedecin"],
              where: { id: userId },
            })
            .then((medecinfound) => data(null, medecinfound))
            .catch((err) => {
              return res
                .status(500)
                .json({ error: "un probleme de verification du medecin" });
            });
        },
        (medecinfound, data) => {
          if (medecinfound) {
            medecinfound
              .update({
                phoneMedecin: phone ? phone : medecinfound.phoneMedecin,
                specialisationMedecin: specialisation
                  ? specialisation
                  : medecinfound.specialisationMedecin,
              })
              .then(() => data(medecinfound))
              .catch((err) =>
                res
                  .status(500)
                  .json({ error: "ne peut pas modifier les informations" })
              );
          } else {
            res.status(404).json({ error: "le medecin n'existe pas" });
          }
        },
      ],
      (medecinfound) => {
        if (medecinfound) {
          return res.status(201).json(medecinfound);
        } else {
          return res
            .status(500)
            .json({ error: "tu ne peux modifier les informations du medecin" });
        }
      }
    );
  },
  updatePasswordMedecinId: (req, res) => {
    const headerAuth = req.headers["authorization"];
    const userId = jwtUtils.getPatientId(headerAuth);
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
    if (!PASSWORD_REGEX.test(confirmPassword)) {
      res.status(400).json({
        error:
          "votre nouveau mot de passe n'est repond pas au norme de securité requis ",
      });
    }
    async_Lib.waterfall(
      [
        (data) => {
          models.medecin
            .findOne({
              where: { id: userId },
            })
            .then((medecinfound) => {
              if (medecinfound) {
                bcrypt.compare(
                  password,
                  medecinfound.passwordMedecin,
                  (errBcrypt, resBcrypt) => {
                    if (resBcrypt) {
                      return data(null, medecinfound);
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
        (medecinfound, data) => {
          if (patientfound) {
            bcrypt.hash(confirmPassword, 10, (error, bcryptPass) => {
              patientfound
                .update({
                  password_medecin: bcryptPass
                    ? bcryptPass
                    : medecinfound.passwordMedecin,
                })
                .then(() => {
                  return data(medecinfound);
                })
                .catch((err) =>
                  res.status(500).json({
                    error: "ne peut pas modifier le mot de passe. ressayer!!!",
                  })
                );
            });
          } else {
            res.status(404).json({ error: "le patient n'existe pas" });
          }
        },
      ],
      (medecinfound) => {
        if (medecinfound) {
          const id = medecinfound.id;
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
  },
};
