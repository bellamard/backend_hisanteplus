const jwtUtils = require("../Utils/jwt.utils");
const models = require("../models");
const async_Lib = require("async");
const { Op } = require("sequelize");

module.exports = {
  createEtat: (req, res) => {
    const headerAuth = req.headers["authorization"];
    const userId = jwtUtils.getPatientId(headerAuth);
    const { systole, diastole, temperature, weight, height } = req.body;
    if (userId < 0) {
      return res
        .status(401)
        .json({ error: "vous avez un probleme de token!!! " });
    }
    if (
      (systole == "" || systole == null) &&
      (diastole == "" || diastole == null) &&
      (temperature == "" || temperature == null) &&
      (weight == "" || weight == null) &&
      (height == "" || height == null)
    ) {
      return res.status(403).json({ error: "parametre incorrecte" });
    }
    async_Lib.waterfall(
      [
        (data) => {
          models.patient
            .findOne({
              attributes: ["id", "nomPatient"],
              where: { id: userId },
            })
            .then((patientFound) => {
              data(null, patientFound);
            })
            .catch((err) => {
              console.warn(err);
              return res
                .status(500)
                .json({ error: "probleme de verification du patient" });
            });
        },
        (patientFound, data) => {
          if (patientFound) {
            const createEtat = models.etat
              .create({
                userId: patientFound.id,
                systole: systole ? systole : "",
                diastole: diastole ? diastole : "",
                temperature: temperature ? temperature : "",
                weight: weight ? weight : "",
                height: height ? height : "",
              })
              .then((etat) => {
                data(etat);
              })
              .catch((err) => {
                console.warn(err);
                return res.status(500).json({
                  error: "l'operation de creation n'a pas aboutir",
                });
              });
          } else {
            return res.status(403).json({
              error: `vous avez pas tout les information necessaire pour créer un etat`,
            });
          }
        },
      ],
      (createEtat) => {
        if (createEtat) {
          return res.status(201).json(createEtat);
        } else {
          return res.status(500).json({
            error: "la creation de l'etat n'a pas aboutir",
          });
        }
      }
    );
  },
  listEtat: (req, res) => {
    const fields = req.query.fields;
    const limit = parseInt(req.query.limit);
    const offset = parseInt(req.query.offset);
    const order = req.query.order;
    const headerAuth = req.headers["authorization"];
    const userId = jwtUtils.getPatientId(headerAuth);
    if (userId < 0) {
      return res.status(403).json({ error: "utilisateur non trouver" });
    }
    async_Lib.waterfall(
      [
        (data) => {
          models.patient
            .findOne({
              attributes: ["id", "nomPatient"],
              where: { id: userId },
            })
            .then((patientFound) => {
              data(null, patientFound);
            })
            .catch((err) => {
              console.warn(err);
              return res
                .status(500)
                .json({ error: "probleme de verification du patient" });
            });
        },
        (patientFound, data) => {
          models.etat
            .findAll({
              order: [order != null ? order.split(":") : ["createdAt", "DESC"]],
              attributes:
                fields !== "*" && fields != null ? fields.split(",") : null,
              limit: !isNaN(limit) ? limit : null,
              offset: !isNaN(offset) ? offset : null,
              where: {
                userId: patientFound.id,
              },
              include: [
                {
                  model: models.patient,
                  attributes: ["nomPatient"],
                },
              ],
            })
            .then((etats) => {
              data(etats);
            })
            .catch((err) => {
              console.warn(err);
              return res.status(500).json({
                error:
                  "probleme de connexion lors de l'operation de recuperation",
              });
            });
        },
      ],
      (etats) => {
        if (etats) {
          return res.status(200).json(etats);
        } else {
          return res.status(500).json({ error: "pas des consultations" });
        }
      }
    );
  },
  getEtat: (req, res) => {
    const headerAuth = req.headers["authorization"];
    const userId = jwtUtils.getPatientId(headerAuth);
    const etatId = parseInt(req.params.etatId);
    const fields = req.query.fields;
    if (userId < 0) {
      return res.status(403).json({ error: "utilisateur non trouver" });
    }
    async_Lib.waterfall(
      [
        (data) => {
          models.patient
            .findOne({
              attributes: ["id", "nomPatient"],
              where: { id: userId },
            })
            .then((patientFound) => {
              data(null, patientFound);
            })
            .catch((err) => {
              console.warn(err);
              return res
                .status(500)
                .json({ error: "probleme de verification du patient" });
            });
        },
        (patientFound, data) => {
          models.etat
            .findOne({
              attributes:
                fields !== "*" && fields != null ? fields.split(",") : null,
              where: { id: etatId, userId: patientFound.id },
            })
            .then((etatFound) => {
              data(etatFound);
            })
            .catch((err) => {
              console.warn(err);
              return res.status(500).json({
                error:
                  "l'operation de verification de consultation n'a pas aboutir",
              });
            });
        },
      ],
      (etatFound) => {
        if (etatFound.length > 0) {
          return res.status(200).json(etatFound);
        } else {
          return res.status(403).json({ error: "etats non trouver" });
        }
      }
    );
  },
  updateEtat: (req, res) => {
    const headerAuth = req.headers["authorization"];
    const userId = jwtUtils.getPatientId(headerAuth);
    const etatId = parseInt(req.params.etatId);
    const { systole, diastole, temperature, weight, height } = req.body;
    if (userId < 0) {
      return res
        .status(401)
        .json({ error: "vous avez un probleme de token!!! " });
    }
    if (
      systole == "" ||
      systole == null ||
      diastole == "" ||
      diastole == null ||
      temperature == "" ||
      temperature == null ||
      weight == "" ||
      weight == null ||
      height == "" ||
      height == null
    ) {
      return res.status(403).json({ error: "parametre incorrecte" });
    }
    async_Lib.waterfall(
      [
        (data) => {
          models.patient
            .findOne({
              attributes: ["id", "nomPatient"],
              where: { id: userId },
            })
            .then((patientFound) => {
              data(null, patientFound);
            })
            .catch((err) => {
              console.warn(err);
              return res
                .status(500)
                .json({ error: "probleme de verification du patient" });
            });
        },
        (patientFound, data) => {
          models.etat
            .findOne({
              where: {
                id: etatId,
                userId: patientFound.id,
              },
            })
            .then((etatFound) => {
              if (etatFound) {
                data(null, etatFound, patientFound);
              } else {
                return res
                  .status(403)
                  .json({ error: "l'etat n'est pas trouvé" });
              }
            })
            .catch((err) => {
              console.warn(err);
              return res.status(500).json({
                error: "operation de verification de l'etat n'a pas aboutir ",
              });
            });
        },
        (etatFound, patientFound, data) => {
          etatFound
            .update({
              systole: systole ? systole : etatFound.systole,
              diastole: diastole ? diastole : etatFound.diastole,
              temperature: temperature ? temperature : etatFound.temperature,
              weight: weight ? weight : etatFound.weight,
              height: height ? height : etatFound.height,
            })
            .then((etatUpdate) => {
              data(etatUpdate);
            })
            .catch((err) => {
              console.warn(err);
              return res.status(500).json({
                error:
                  "l'operation de la modification de l'etat n' a pas aboutir",
              });
            });
        },
      ],
      (etatUpdate) => {
        if (etatUpdate) {
          return res.status(201).json(maladyUpdate);
        } else {
          return res
            .status(403)
            .json({ error: " la modification n'a pas aboutir" });
        }
      }
    );
  },
  delete: (req, res) => {
    const headerAuth = req.headers["authorization"];
    const userId = jwtUtils.getPatientId(headerAuth);
    const etatId = parseInt(req.params.etatId);
    if (userId < 0) {
      return res
        .status(401)
        .json({ error: "vous avez un probleme de token!!! " });
    }
    async_Lib.waterfall(
      [
        (data) => {
          models.patient
            .findOne({
              attributes: ["id", "nomPatient"],
              where: { id: userId },
            })
            .then((patientFound) => {
              data(null, patientFound);
            })
            .catch((err) => {
              console.warn(err);
              return res
                .status(500)
                .json({ error: "probleme de verification du patient" });
            });
        },
        (patientFound, data) => {
          models.etat
            .findOne({
              where: {
                id: etatId,
                userId: patientFound.id,
              },
            })
            .then((etatFound) => {
              if (etatFound) {
                data(null, etatFound, patientFound);
              } else {
                return res
                  .status(403)
                  .json({ error: "l'etat n'est pas trouvé" });
              }
            })
            .catch((err) => {
              console.warn(err);
              return res.status(500).json({
                error: "operation de verification de l'etat n'a pas aboutir ",
              });
            });
        },
        (etatFound, patientFound, data) => {
          etatFound
            .destroy()
            .then((etatDelete) => {
              data(etatDelete);
            })
            .catch((err) => {
              console.warn(err);
              return res.status(500).json({
                error:
                  "l'operation de la suppression de l'etat n'a pas aboutir",
              });
            });
        },
      ],
      (etatDelete) => {
        if (etatDelete) {
          return res.status(200).json(etatDelete);
        } else {
          return res.status(500).json({
            error: "la suppression de l'etat n'a pas aboutir",
          });
        }
      }
    );
  },
};
