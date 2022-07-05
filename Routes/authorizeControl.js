const jwtUtils = require("../Utils/jwt.utils");
const models = require("../models");
const async_Lib = require("async");
const { Op } = require("sequelize");

module.exports = {
  createAutho: (req, res) => {
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
            const createAutho = models.authorization
              .create({
                medecinId: medecinFound.id,
                patientId: patientFound.id,
                isAuthorized: false,
              })
              .then((authorized) => {
                data(authorized);
              })
              .catch((err) => {
                console.warn(err);
                return res.status(500).json({
                  error: "l'operation de creation n'a pas aboutir",
                });
              });
          } else {
            return res.status(403).json({
              error: `vous avez pas tout les informations necessaire pour créer un etat`,
            });
          }
        },
      ],
      (createAutho) => {
        if (createAutho) {
          return res.status(201).json(createAutho);
        } else {
          return res.status(500).json({
            error: "la creation de l'autorisation n'a pas aboutir",
          });
        }
      }
    );
  },
  updateAutho: (req, res) => {
    const headerAuth = req.headers["authorization"];
    const userId = jwtUtils.getPatientId(headerAuth);
    const authorizedId = parseInt(req.params.authorizedId);
    const { authorized } = req.body;
    if (userId < 0) {
      return res
        .status(401)
        .json({ error: "vous avez un probleme de token!!! " });
    }
    if (authorizedId == "" || authorizedId == null) {
      return res
        .status(403)
        .json({ error: "les paramettres sont incorrect!!! " });
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
          models.authorization
            .findOne({
              where: {
                patientId: patientFound.id,
                id: authorizedId,
              },
            })
            .then((authorFound) => {
              data(null, authorFound, patientFound);
            })
            .catch((err) => {
              console.warn(err);
              return res.status(500).json({
                error:
                  "operation de verification de l'autorisation n'a pas aboutir ",
              });
            });
        },
        (authorFound, patientFound, data) => {
          authorFound
            .update({
              isAuthorized: authorized ? authorized : authorFound.isAuthorized,
            })
            .then((authorUpdate) => {
              data(authorUpdate);
            })
            .catch((err) => {
              console.warn(err);
              return res.status(500).json({
                error:
                  "l'operation de la modification de l'autorisation n' a pas aboutir",
              });
            });
        },
      ],
      (authorUpdate) => {
        if (authorUpdate) {
          return res.status(200).json(authorUpdate);
        } else {
          return res.status(500).json({
            error: "la modification de l'autorisation n'a pas aboutir",
          });
        }
      }
    );
  },
  listAuthorized: (req, res) => {
    const fields = req.query.fields;
    const limit = parseInt(req.query.limit);
    const offset = parseInt(req.query.offset);
    const order = req.query.order;
    const headerAuth = req.headers["authorization"];
    const userId = jwtUtils.getPatientId(headerAuth);
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
          models.authorization
            .findAll({
              order: [order != null ? order.split(":") : ["createdAt", "DESC"]],
              attributes:
                fields !== "*" && fields != null ? fields.split(",") : null,
              limit: !isNaN(limit) ? limit : null,
              offset: !isNaN(offset) ? offset : null,
              where: { patientId: patientFound.id, isAuthorized: false },
            })
            .then((authorized) => {
              data(authorized);
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
      (authorized) => {
        if (authorized) {
          return res.status(200).json(authorized);
        } else {
          return res
            .status(500)
            .json({ error: "vous n'avez pas des autorisations" });
        }
      }
    );
  },
  deleteAutho: (req, res) => {
    const headerAuth = req.headers["authorization"];
    const userId = jwtUtils.getPatientId(headerAuth);
    const authorizedId = parseInt(req.params.authorizedId);
    if (userId < 0) {
      return res
        .status(401)
        .json({ error: "vous avez un probleme de token!!! " });
    }
    if (authorizedId == null) {
      return res
        .status(403)
        .json({ error: "les parametres sont incorrect!!  " });
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
          models.authorization
            .findOne({
              where: {
                patientId: patientFound.id,
                id: authorizedId,
              },
            })
            .then((authoriFound) => {
              if (authoriFound) {
                data(null, authoriFound, patientFound);
              } else {
                return res
                  .status(403)
                  .json({ error: "l'autorisation n'est pas trouvé" });
              }
            })
            .catch((err) => {
              console.warn(err);
              return res.status(500).json({
                error:
                  "operation de verification de l'autorisation n'a pas aboutir ",
              });
            });
        },
        (authoriFound, patientFound, data) => {
          authoriFound
            .destroy()
            .then((authoriDelete) => {
              data(authoriDelete);
            })
            .catch((err) => {
              console.warn(err);
              return res.status(500).json({
                error:
                  "l'operation de la suppression de l'autorisation n'a pas aboutir",
              });
            });
        },
      ],
      (authoriDelete) => {
        if (authoriDelete) {
          return res.status(200).json(authoriDelete);
        } else {
          return res.status(500).json({
            error: "la suppression de l'autorisation n'a pas aboutir",
          });
        }
      }
    );
  },
};
