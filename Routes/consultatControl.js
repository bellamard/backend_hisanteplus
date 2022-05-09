const jwtUtils = require("../Utils/jwt.utils");
const models = require("../models");
const async_Lib = require("async");
const { Op } = require("sequelize");

module.exports = {
  createConsultation: (req, res) => {
    const headerAuth = req.headers["authorization"];
    const userId = jwtUtils.getPatientId(headerAuth);
    const { patientId, typeConsultation, dateConsultation } = req.body;
    const now = new Date();
    if (
      patientId === "" ||
      typeConsultation === "" ||
      dateConsultation === "" ||
      patientId == null ||
      typeConsultation == null ||
      dateConsultation == null
    ) {
      return res.status(400).json({ error: "parametre incorrecte" });
    }
    if (typeConsultation.lengh < 3) {
      return res.status(400).json({ error: "motif invalide" });
    }
    if (dateConsultation <= now) {
      return res.status(400).json({ error: "date invalide" });
    }
    if (userId < 0) {
      return res
        .status(401)
        .json({ error: "vous avez un probleme de token!!! " });
    }
    async_Lib.waterfall(
      [
        (data) => {
          models.medecin
            .findOne({
              attributes: ["id", "numOrdreMedecin"],
              where: { id: userId },
            })
            .then((medecinFound) => {
              data(null, medecinFound);
            })
            .catch((err) => {
              return res
                .status(500)
                .json({ error: "probleme de verification du medecin" });
            });
        },
        (medecinFound, data) => {
          if (medecinFound) {
            models.patient
              .findOne({
                attributes: ["id", "nomPatient"],
                where: { id: patientId },
              })
              .then((patientFound) => {
                data(null, medecinFound, patientFound);
              })
              .catch((err) => {
                return res.status(500).json({
                  error: "le Problème de verification du patient",
                });
              });
          } else {
            return res
              .status(403)
              .json({ error: "probleme d'identification du medecin" });
          }
        },
        (medecinFound, patientFound, data) => {
          if (medecinFound || patientFound) {
            const createConsultation = models.Consultation.create({
              medecinId: medecinFound.id,
              patientId: patientFound.id,
              type: typeConsultation,
              valider: 0,
              dateConsultation,
            })
              .then((consultation) => {
                data(consultation);
              })
              .catch((err) => {
                return res.status(500).json({
                  error: "l'operation de creation n'a pas aboutir ",
                });
              });
          } else {
            return res.status(403).json({
              error: `vous avez pas tout les information necessaire pour créer une consultation`,
            });
          }
        },
      ],
      (createConsultation) => {
        if (createConsultation) {
          return res.status(201).json(createConsultation);
        } else {
          return res.status(500).json({
            error: "la creation de la consultation n'a pas aboutir",
          });
        }
      }
    );
  },
  listConsult: (req, res) => {
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
          models.Consultation.findAll({
            order: [order != null ? order.split(":") : ["createdAt", "DESC"]],
            attributes:
              fields !== "*" && fields != null ? fields.split(",") : null,
            limit: !isNaN(limit) ? limit : null,
            offset: !isNaN(offset) ? offset : null,
            where: {
              [Op.or]: [{ medecinId: userId }, { patientId: userId }],
            },
            include: [
              {
                model: models.patient,
                attributes: ["nomPatient"],
              },
              {
                model: models.medecin,
                attributes: ["nomMedecin"],
              },
            ],
          })
            .then((consultations) => {
              data(consultations);
            })
            .catch((Err) => {
              return res.status(500).json({
                error: "probleme lors de l'operation de recuperation " + Err,
              });
            });
        },
      ],
      (consultations) => {
        if (consultations) {
          return res.status(200).json(consultations);
        } else {
          return res.status(500).json({ error: "pas des consultations" });
        }
      }
    );
  },
  updateConsult: (req, res) => {
    const headerAuth = req.headers["authorization"];
    const userId = jwtUtils.getPatientId(headerAuth);
    const { dateConsultation, typeConsultation, validerConsultation } =
      req.body;
    const consultationId = parseInt(req.params.consultationId);

    if (consultationId <= 0 || consultationId === null) {
      return res
        .status(403)
        .json({ error: "la consultation n' a pas été trouve" });
    }
    if (userId <= 0) {
      return res.status(403).json({ error: "L'utilisateur n'est pas trouvée" });
    }
    async_Lib.waterfall(
      [
        (data) => {
          models.Consultation.findOne({
            include: [
              {
                model: models.patient,
                attributes: ["nomPatient"],
              },
              {
                model: models.medecin,
                attributes: ["nomMedecin"],
              },
            ],
            where: {
              id: consultationId,
              [Op.or]: [{ medecinId: userId }, { patientId: userId }],
            },
          })
            .then((consultationFound) => {
              data(null, consultationFound);
            })
            .catch((err) => {
              return res.status(500).json({
                error: "probleme d'execution de la requetes" + err,
              });
            });
        },
        (consultationFound, data) => {
          if (consultationFound) {
            consultationFound
              .update({
                type: typeConsultation
                  ? typeConsultation
                  : consultationFound.type,
                dateConsultation: dateConsultation
                  ? dateConsultation
                  : consultationFound.dateConsultation,
                valider: validerConsultation
                  ? validerConsultation
                  : consultationFound.valider,
              })
              .then((consultationUpdate) => {
                data(consultationUpdate);
              })
              .catch((err) => {
                return res.status(500).json({
                  error: "probleme d'execution de la modification: " + err,
                });
              });
          } else {
            return res
              .status(403)
              .json({ error: "la consultation n'est pas trouvée" });
          }
        },
      ],
      (consultationUpdate) => {
        if (consultationUpdate) {
          return res.status(201).json(consultationUpdate);
        } else {
          return res
            .status(403)
            .json({ error: "la consultation n'est pas trouvée" });
        }
      }
    );
  },
  deleteConsult: (req, res) => {
    const headerAuth = req.headers["authorization"];
    const userId = jwtUtils.getPatientId(headerAuth);
    const consultationId = parseInt(req.params.consultationId);

    if (consultationId <= 0 || consultationId === null) {
      return res
        .status(403)
        .json({ error: "la consultation n' a pas été trouve" });
    }
    if (userId <= 0) {
      return res.status(403).json({ error: "L'utilisateur n'est pas trouvée" });
    }
    async_Lib.waterfall(
      [
        (data) => {
          models.Consultation.findOne({
            attributes: ["id"],
            include: [
              {
                model: models.patient,
                attributes: ["nomPatient"],
              },
              {
                model: models.medecin,
                attributes: ["nomMedecin"],
              },
            ],
            where: {
              id: consultationId,
              [Op.or]: [{ medecinId: userId }, { patientId: userId }],
            },
          })
            .then((consultationFound) => {
              data(null, consultationFound);
            })
            .catch((err) => {
              return res.status(500).json({
                error: "probleme d'execution de la requetes" + err,
              });
            });
        },
        (consultationFound, data) => {
          if (consultationFound) {
            consultationFound
              .destroy()
              .then((consultationUpdate) => {
                data(consultationUpdate);
              })
              .catch((err) => {
                return res.status(500).json({
                  error: "probleme d'execution de la modification: " + err,
                });
              });
          } else {
            return res
              .status(403)
              .json({ error: "la consultation n'est pas trouvée" });
          }
        },
      ],
      (consultationUpdate) => {
        if (consultationUpdate) {
          return res.status(201).json(consultationUpdate);
        } else {
          return res
            .status(403)
            .json({ error: "la consultation n'est pas trouvée" });
        }
      }
    );
  },
};
