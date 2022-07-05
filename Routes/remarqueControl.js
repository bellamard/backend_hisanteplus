const jwtUtils = require("../Utils/jwt.utils");
const models = require("../models");
const async_Lib = require("async");
const { Op } = require("sequelize");

module.exports = {
  createRemarque: (req, res) => {
    const headerAuth = req.headers["authorization"];
    const userId = jwtUtils.getPatientId(headerAuth);
    const patientId = parseInt(req.params.patientId);
    const remarque = req.body.remarque;

    if (userId < 0) {
      return res
        .status(401)
        .json({ error: "vous avez un probleme de token!!! " });
    }
    if (
      patientId == "" ||
      patientId == null ||
      remarque == "" ||
      remarque == null
    ) {
      return res.status(403).json({ error: "parametre incorrecte" });
    }

    async_Lib.waterfall(
      [
        (data) => {
          models.medecin
            .findOne({
              attributes: ["id", "monMedecin"],
              where: { id: userId },
            })
            .then((medecinFound) => {
              data(null, medecinFound);
            })
            .catch((err) => {
              console.warn(err);
              return res
                .status(500)
                .json({ error: "probleme de verification du medecin" });
            });
        },
        (medecinFound, data) => {
          models.patient
            .findOne({
              attributes: ["id", "nomPatient"],
              where: { id: patientId },
            })
            .then((patientFound) => {
              data(null, patientFound, medecinFound);
            })
            .catch((err) => {
              console.warn(err);
              return res
                .status(500)
                .json({ error: "probleme de verification du patient" });
            });
        },
        (patientFound, medecinFound, data) => {
          if (patientFound && medecinFound) {
            const createRemarque = models.Remarque.create({
              userId: patientFound.id,
              nameRemarque: remarque,
            })
              .then((remarque) => {
                data(remarque);
              })
              .catch((err) => {
                console.warn(err);
                return res.status(500).json({
                  error: "l'operation de creation n'a pas aboutir",
                });
              });
          } else {
            return res.status(403).json({
              error: `vous avez pas tout les informations necessaire pour créer une remarque`,
            });
          }
        },
      ],
      (remarque) => {
        if (remarque) {
          return res.status(201).json(remarque);
        } else {
          return res.status(500).json({
            error: "la creation de la remarsque n'a pas aboutir",
          });
        }
      }
    );
  },
  listRemarque: (req, res) => {
    const fields = req.query.fields;
    const limit = parseInt(req.query.limit);
    const offset = parseInt(req.query.offset);
    const order = req.query.order;
    const headerAuth = req.headers["authorization"];
    const userId = jwtUtils.getPatientId(headerAuth);
    const patientId = parseInt(req.params.patientId);
    if (userId < 0) {
      return res
        .status(401)
        .json({ error: "vous avez un probleme de token!!! " });
    }
    if (patientId == "" || patientId == null) {
      return res.status(403).json({ error: "parametre incorrecte" });
    }
    async_Lib.waterfall(
      [
        (data) => {
          models.medecin
            .findOne({
              attributes: ["id", "nomMedecin"],
              where: { id: userId },
            })
            .then((medecinFound) => {
              data(null, medecinFound);
            })
            .catch((err) => {
              console.warn(err);
              return res
                .status(500)
                .json({ error: "probleme de verification du medecin" });
            });
        },
        (medecinFound, data) => {
          models.patient
            .findOne({
              attributes: ["id", "nomPatient"],
              id: patientId,
            })
            .then((patientFound) => {
              data(null, patientFound, medecinFound);
            })
            .catch((err) => {
              console.warn(err);
              return res
                .status(500)
                .json({ error: "probleme de verification du patient" });
            });
        },
        (patientFound, medecinFound, data) => {
          models.Remarque.findAll({
            order: [order != null ? order.split(":") : ["createdAt", "DESC"]],
            attributes:
              fields !== "*" && fields != null ? fields.split(",") : null,
            limit: !isNaN(limit) ? limit : null,
            offset: !isNaN(offset) ? offset : null,
            where: {
              userId: patientFound.id,
            },
          })
            .then((remarque) => {
              data(remarque);
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
      (remarque) => {
        if (remarque) {
          return res.status(200).json(remarque);
        } else {
          return res
            .status(500)
            .json({ error: "vous n'avez pas des remarques" });
        }
      }
    );
  },
  deleteRemarque: (req, res) => {
    const headerAuth = req.headers["authorization"];
    const userId = jwtUtils.getPatientId(headerAuth);
    const patientId = parseInt(req.params.patientId);
    const remarqueId = parseInt(req.params.remarqueId);
    if (userId < 0) {
      return res
        .status(401)
        .json({ error: "vous avez un probleme de token!!! " });
    }
    if (
      patientId == "" ||
      patientId == null ||
      remarqueId == "" ||
      remarqueId == null
    ) {
      return res.status(403).json({ error: "parametre incorrecte" });
    }
    async_Lib.waterfall([
      (data) => {
        models.medecin
          .findOne({
            attributes: ["id", "nomMedecin"],
            where: { id: userId },
          })
          .then((medecinFound) => {
            data(null, medecinFound);
          })
          .catch((err) => {
            console.warn(err);
            return res
              .status(500)
              .json({ error: "probleme de verification du medecin" });
          });
      },
      (medecinFound, data) => {
        models.patient
          .findOne({
            attributes: ["id", "nomPatient"],
            id: patientId,
          })
          .then((patientFound) => {
            data(null, patientFound, medecinFound);
          })
          .catch((err) => {
            console.warn(err);
            return res
              .status(500)
              .json({ error: "probleme de verification du patient" });
          });
      },
      (patientFound, medecinFound, data) => {
        models.Remarque.findOne({
          attributes: ["id"],
          where: { id: remarqueId, userId: patientId },
        })
          .then((remarqueFound) => {
            data(null, remarqueFound, patientFound, medecinFound);
          })
          .catch((err) => {
            console.warn(err);
            return res
              .status(500)
              .json({ error: "probleme de verification du remarque" });
          });
      },
      (remarqueFound, patientFound, medecinFound, data) => {
        remarqueFound
          .destroy()
          .then((remarqueDelete) => {
            data(remarqueDelete);
          })
          .catch((err) => {
            console.warn(err);
            return res.status(500).json({
              error:
                "l'operation de la suppression de le remarque n'a pas aboutir",
            });
          });
      },
    ]);
  },
};
