const jwtUtils = require("../Utils/jwt.utils");
const models = require("../models");
const async_Lib = require("async");
const { Op } = require("sequelize");

module.exports = {
  createIntervention: (req, res) => {
    const headerAuth = req.headers["authorization"];
    const userId = jwtUtils.getPatientId(headerAuth);
    const consultationId = req.params.consultationId;
    const { dateIntervention, typeIntervention, nameIntervention } = req.body;
    if (
      dateIntervention === "" ||
      typeIntervention === "" ||
      nameIntervention === "" ||
      consultationId === ""
    ) {
      return res
        .status(401)
        .json({ error: "les informations sont incorrects" });
    }
    if (consultationId == null || consultationId === "") {
      return res.status(401).json({ error: "la reference est incorrects" });
    }
    if (userId < 0) {
      return res
        .status(401)
        .json({ error: "vous avez un problême de token!!!" });
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
              if (medecinFound) {
                data(null, medecinFound);
              } else {
                return res
                  .status(500)
                  .json({ error: "le medecin n'existe pas" });
              }
            })
            .catch((err) => {
              console.warn(err);
              return res.status(500).json({
                error: "probleme lors de verification du medecin",
              });
            });
        },
        (medecinFound, data) => {
          models.Consultation.findOne({
            attributes: ["id"],
            where: { id: consultationId },
          })
            .then((consultationFound) => {
              if (consultationFound) {
                data(null, medecinFound, consultationFound);
              } else {
                return res
                  .status(403)
                  .json({ error: "Operation la consultation n'existe pas " });
              }
            })
            .catch((err) => {
              console.warn(err);
              return res.status(500).json({
                error:
                  "operation de verification de la consultation n'a pas aboutir!",
              });
            });
        },
        (medecinFound, consultationFound, data) => {
          const createIntervention = models.Intervention.create({
            consultationId: consultationFound.id,
            medecinId: medecinFound.id,
            typeIntervention,
            nameIntervention,
            dateIntervention,
          })
            .then((createIntervention) => {
              data(createIntervention);
            })
            .catch((err) => {
              console.warn(err);
              res.status(500).json({
                error:
                  "operation de création de l'intervention n'a pas aboutir!",
              });
            });
        },
      ],
      (createIntervention) => {
        if (createIntervention) {
          return res.status(201).json(createIntervention);
        } else {
          return res
            .status(403)
            .json({ error: "l'intervention n'est pas crée" });
        }
      }
    );
  },
  listConsultationIntervention: (req, res) => {
    const headerAuth = req.headers["authorization"];
    const userId = jwtUtils.getPatientId(headerAuth);
    const consultationId = parseInt(req.params.consultationId);
    const fields = req.query.fields;
    if (consultationId == null || consultationId === "") {
      return res.status(401).json({ error: "la reference est incorrects " });
    }
    if (userId < 0) {
      return res
        .status(401)
        .json({ error: "vous avez un probleme de token!!! " });
    }
    async_Lib.waterfall(
      [
        (data) =>
          models.Consultation.findOne({
            attributes: ["id"],
            where: {
              id: consultationId,
              [Op.or]: [{ medecinId: userId }, { patientId: userId }],
            },
          })
            .then((consultationFound) => {
              if (consultationFound) {
                data(null, consultationFound);
              } else {
                return res
                  .status(403)
                  .json({ error: "la consultation n'existe pas" });
              }
            })
            .catch((err) => {
              return res
                .status(500)
                .json({ error: "l'operation de consultation n'a pas aboutir" });
            }),
        (consultationFound, data) => {
          models.Intervention.findAll({
            attributes:
              fields !== "*" && fields != null ? fields.split(",") : null,
            where: { consultationId: consultationFound.id },
            include: [
              {
                model: models.Consultation,
                attributes: ["type"],
              },
              {
                model: models.medecin,
                attributes: ["nomMedecin"],
              },
            ],
          })
            .then((intervention) => {
              data(intervention);
            })
            .catch((Err) => {
              return res.status(500).json({
                error:
                  "probleme de connexion lors de l'operation de recuperation " +
                  Err,
              });
            });
        },
      ],
      (intervention) => {
        if (intervention.length > 0) {
          return res.status(200).json(intervention);
        } else {
          return res.status(500).json({
            error: "pas des interventions",
          });
        }
      }
    );
  },
  getMedecinIntervention: (req, res) => {
    const headerAuth = req.headers["authorization"];
    const userId = jwtUtils.getPatientId(headerAuth);
    const interventionId = parseInt(req.params.interventionId);
    const fields = req.query.fields;
    if (interventionId == null || interventionId === "") {
      return res.status(401).json({ error: "la reference est incorrects " });
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
              if (medecinFound) {
                data(null, medecinFound);
              } else {
                res.status(403).json({ error: "le medecin n'existe pas" });
              }
            })
            .catch((err) => {
              console.warn(err);
              res.status(500).json({ error: "l'operation n'a pas aboutir" });
            });
        },
        (medecinFound, data) => {
          models.Intervention.findOne({
            attributes:
              fields !== "*" && fields != null ? fields.split(",") : null,
            where: {
              id: interventionId,
              medecinId: medecinFound.id,
            },
            include: [
              {
                model: models.Consultation,
                attributes: ["type"],
              },
              {
                model: models.medecin,
                attributes: ["nomMedecin"],
              },
            ],
          })
            .then((intervention) => {
              data(intervention);
            })
            .catch((err) => {
              console.warn(err);
              return res.status(500).json({
                error:
                  "probleme de connexion lors de l'operation de recuperation " +
                  " EZA NINI " +
                  interventionId,
              });
            });
        },
      ],
      (intervention) => {
        if (intervention) {
          return res.status(200).json(intervention);
        } else {
          return res.status(403).json({
            error: "l'intervention n'est pas trouvée",
          });
        }
      }
    );
  },
  listMedecinIntervention: (req, res) => {
    const headerAuth = req.headers["authorization"];
    const userId = jwtUtils.getPatientId(headerAuth);
    const fields = req.query.fields;

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
              if (medecinFound) {
                data(null, medecinFound);
              } else {
                res.status(403).json({ error: "le medecin n'existe pas" });
              }
            })
            .catch((err) => {
              console.warn(err);
              res.status(500).json({ error: "l'operation n'a pas aboutir" });
            });
        },
        (medecinFound, data) => {
          models.Intervention.findAll({
            attributes:
              fields !== "*" && fields != null ? fields.split(",") : null,
            where: {
              medecinId: medecinFound.id,
            },
          })
            .then((intervention) => {
              data(intervention);
            })
            .catch((err) => {
              return res.status(500).json({
                error:
                  "probleme de connexion lors de l'operation de recuperation " +
                  err,
              });
            });
        },
      ],
      (intervention) => {
        if (intervention.length > 0) {
          return res.status(200).json(intervention);
        } else {
          return res.status(403).json({
            error: "l'intervention n'est pas trouvée",
          });
        }
      }
    );
  },

  getIntervention: (req, res) => {
    const headerAuth = req.headers["authorization"];
    const userId = jwtUtils.getPatientId(headerAuth);
    const interventionId = parseInt(req.params.interventionId);
    const fields = req.query.fields;
    const consultationId = req.query.consultation;
    if (interventionId == null || interventionId === "") {
      return res.status(401).json({ error: "la reference est incorrects " });
    }
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
              attributes: ["id"],
              where: { id: userId },
            })
            .then((patientFound) => {
              if (patientFound) {
                data(null, patientFound);
              } else {
                res.status(403).json({ error: "le patient n'existe pas" });
              }
            })
            .catch((err) => {
              console.warn(err);
              res.status(500).json({ error: "l'operation n'a pas aboutir" });
            });
        },
        (patientFound, data) => {
          models.Consultation.findOne({
            attributes: ["id"],
            where: {
              id: consultationId,
              patientId: patientFound.id,
            },
          })
            .then((consultationFound) => {
              data(null, patientFound, consultationFound);
            })
            .catch((err) => {
              return res.status(500).json({
                error:
                  "probleme de connexion lors de l'operation de recuperation " +
                  err,
              });
            });
        },
        (patientFound, consultationFound, data) => {
          if (patientFound && consultationFound) {
            models.Intervention.findOne({
              attributes:
                fields !== "*" && fields != null ? fields.split(",") : null,
              where: { consultationId: consultationFound.id },
            })
              .then((intervention) => {
                data(intervention);
              })
              .catch((err) => {
                console.warn(err);
                return res.status(500).json({ error: "problême de connexion" });
              });
          } else {
            return res.status(403).json({
              error: `vous avez pas tout les information necessaire pour voir une consultation`,
            });
          }
        },
      ],
      (intervention) => {
        if (intervention) {
          return res.status(200).json(intervention);
        } else {
          return res.status(403).json({
            error: "l'intervention n'est pas trouvée",
          });
        }
      }
    );
  },

  updateIntervention: (req, res) => {
    const headerAuth = req.headers["authorization"];
    const userId = jwtUtils.getPatientId(headerAuth);
    const interventionId = parseInt(req.params.interventionId);
    const consultationId = req.query.consultationId;
    const { dateIntervention, typeIntervention, nameIntervention } = req.body;
    if (
      dateIntervention === "" &&
      typeIntervention === "" &&
      nameIntervention === ""
    ) {
      return res
        .status(401)
        .json({ error: "les informations sont incorrects" });
    }
    if (
      dateIntervention == null &&
      typeIntervention == null &&
      nameIntervention == null
    ) {
      return res
        .status(401)
        .json({ error: "les informations sont incorrects" });
    }
    if (
      consultationId == null ||
      consultationId === "" ||
      interventionId === "" ||
      interventionId == null
    ) {
      return res.status(401).json({ error: "la reference est incorrects" });
    }
    if (userId < 0) {
      return res
        .status(401)
        .json({ error: "vous avez un problême de token!!!" });
    }
    async_Lib.waterfall(
      [
        (data) => {
          models.Consultation.findOne({
            attributes: ["id"],
            where: { id: consultationId, medecinId: userId },
          })
            .then((consultationFound) => {
              if (consultationFound) {
                data(null, consultationFound);
              } else {
                return res
                  .status(403)
                  .json({ error: "la consultation n'existe pas" });
              }
            })
            .catch((err) => {
              console.warn(err);
              return res.status(500).json({
                error:
                  "l'operation de verification de consultation n'a pas aboutir",
              });
            });
        },
        (consultationFound, data) => {
          models.Intervention.findOne({
            where: { id: interventionId, consultationId: consultationFound.id },
          })
            .then((interventionFound) => {
              if (interventionFound) {
                data(null, interventionFound, consultationFound);
              } else {
                return res
                  .status(403)
                  .json({ error: "l'intervention n'est pas trouvé" });
              }
            })
            .catch((err) => {
              console.warn(err);
              return res.status(500).json({
                error:
                  "operation de verification de l'intervention n'a pas aboutir ",
              });
            });
        },
        (interventionFound, consultationFound, data) => {
          interventionFound
            .update({
              dateIntervention: dateIntervention
                ? dateIntervention
                : interventionFound.dateIntervention,
              typeIntervention: typeIntervention
                ? typeIntervention
                : interventionFound.typeIntervention,
              nameIntervention: nameIntervention
                ? nameIntervention
                : interventionFound.nameIntervention,
            })
            .then((interventionUpdate) => {
              data(interventionUpdate);
            })
            .catch((err) => {
              console.warn(err);
              return res.status(500).json({
                error:
                  "l'operation de la modification de l'intervention n' a pas aboutir",
              });
            });
        },
      ],
      (interventionUpdate) => {
        if (interventionUpdate) {
          return res.status(201).json(interventionUpdate);
        } else {
          return res
            .status(403)
            .json({ error: " la modification n'a pas aboutir" });
        }
      }
    );
  },
  deleteIntervention: (req, res) => {
    const headerAuth = req.headers["authorization"];
    const userId = jwtUtils.getPatientId(headerAuth);
    const consultationId = req.query.consultationId;
    const interventionId = parseInt(req.params.interventionId);
    if (userId < 0) {
      return res
        .status(401)
        .json({ error: "vous avez un probleme de token!!! " });
    }
    if (
      consultationId === "" ||
      interventionId === "" ||
      consultationId === null ||
      interventionId === null
    ) {
      return res
        .status(401)
        .json({ error: "les informations sont incorrects" });
    }
    async_Lib.waterfall(
      [
        (data) => {
          models.Consultation.findOne({
            attributes: ["id"],
            where: { id: consultationId, medecinId: userId },
          })
            .then((consultationFound) => {
              if (consultationFound) {
                data(null, consultationFound);
              } else {
                return res
                  .status(403)
                  .json({ error: "la consultation n'existe pas" });
              }
            })
            .catch((err) => {
              console.warn(err);
              return res.status(500).json({
                error:
                  "l'operation de verification de consultation n'a pas aboutir",
              });
            });
        },
        (consultationFound, data) => {
          models.Intervention.findOne({
            attributes: ["id"],
            where: { id: interventionId, consultationId: consultationFound.id },
          })
            .then((interventionFound) => {
              if (interventionFound) {
                data(null, interventionFound, consultationFound);
              } else {
                return res
                  .status(403)
                  .json({ error: "l'intervention n'est pas trouvé" });
              }
            })
            .catch((err) => {
              console.warn(consultationFound.id);
              return res.status(500).json({
                error:
                  "operation de verification de l'intervention n'a pas aboutir ",
              });
            });
        },
        (interventionFound, consultationFound, data) => {
          interventionFound
            .destroy()
            .then((interventionDelete) => {
              data(interventionDelete);
            })
            .catch((err) => {
              console.warn(err);
              return res.status(500).json({
                error:
                  "l'operation de supression de l'intervention n' a pas aboutir",
              });
            });
        },
      ],
      (interventionDelete) => {
        if (interventionDelete) {
          return res.status(201).json(interventionDelete);
        } else {
          return res
            .status(403)
            .json({ error: " la modification n'a pas aboutir" });
        }
      }
    );
  },
};
