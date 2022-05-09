const jwtUtils = require("../Utils/jwt.utils");
const models = require("../models");
const async_Lib = require("async");
const { Op } = require("sequelize");

module.exports = {
  createMalade: (req, res) => {
    const headerAuth = req.headers["authorization"];
    const userId = jwtUtils.getPatientId(headerAuth);
    const consultationId = req.params.consultationId;
    const { malady, level } = req.body;
    if (malady === "" || malady == null || level === "" || level == null) {
      return res
        .status(401)
        .json({ error: "les informations sont incorrects " });
    }
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
              console.warn(err);
              return res
                .status(500)
                .json({ error: "probleme de verification du medecin" });
            });
        },
        (medecinFound, data) => {
          models.Consultation.findOne({
            attributes: ["id"],
            where: { id: consultationId, medecinId: medecinFound.id },
          })
            .then((consultationFound) => {
              data(null, medecinFound, consultationFound);
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
          const createMalady = models.malade
            .create({
              malady,
              niveau: level,
              consultationId: consultationFound.id,
            })
            .then((maladyFound) => {
              data(maladyFound);
            })
            .catch((err) => {
              console.warn(err);
              res.status(500).json({
                error: "operation de création de la maladie n'a pas aboutir!",
              });
            });
        },
      ],
      (maladyFound) => {
        if (maladyFound) {
          return res.status(201).json(maladyFound);
        } else {
          return res.status(403).json({ error: "la maladie n'est pas crée" });
        }
      }
    );
  },

  getMalade: (req, res) => {
    const headerAuth = req.headers["authorization"];
    const userId = jwtUtils.getPatientId(headerAuth);
    const consultationId = req.params.consultationId;
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
        (data) => {
          models.malade
            .findOne({
              attributes: { id },
              where: { id: consultationId },
            })
            .then((consultationFound) => {
              data(null, consultationFound);
            })
            .catch((err) => {
              console.warn(err);
              return res
                .status(403)
                .json({ error: "l'operation n'a pas aboutir" });
            });
        },
        (data, consultationFound) => {
          models.malade
            .findOne({
              attributes: { id, malady },
              where: { consultationId: consultationFound.id },
            })
            .then((maladyFound) => {
              data(maladyFound);
            })
            .catch((err) => {
              console.warn(err);
              return res.status(500).json({
                error:
                  "l'operation de l'affichage de la maladie n'a pas aboutir",
              });
            });
        },
      ],
      (maladyFound) => {
        if (maladyFound) {
          return res.status(200).json(maladyFound);
        } else {
          return res.status(403).json({ error: "maladies non trouver" });
        }
      }
    );
  },
  updateMalady: (req, res) => {
    const headerAuth = req.headers["authorization"];
    const userId = jwtUtils.getPatientId(headerAuth);
    const { consultationId, maladeId } = req.params;
    const { malady, level } = req.body;
    if (userId < 0) {
      return res
        .status(401)
        .json({ error: "vous avez un probleme de token!!! " });
    }
    if (
      (malady == null || malady === "") &&
      (niveau == null || niveau === "")
    ) {
      return res.status(401).json({ error: "information incorrect" });
    }
    async_Lib.waterfall([
      (data) => {
        models.Consultation.findOne({
          attributes: { id },
          where: { id: consultationId, medecinId: userId },
        })
          .then((consultationFound) => data(null, consultationFound))
          .catch((err) => {
            console.warn(err);
            return res.status(500).json({
              error:
                "l'operation de verification de consultation n'a pas aboutir",
            });
          });
      },
      (data, consultationFound) => {
        models.malade
          .findOne({
            attributes: { id },
            where: { id: maladeId, consultationId: consultationFound.id },
          })
          .then((maladyFound) => {
            data(null, maladyFound, consultationFound);
          })
          .catch((err) => {
            console.warn(err);
            return res.status(500).json({
              error: "operation de verification de la maladie n'a pas aboutir ",
            });
          });
      },
      (data, maladyFound, consultationFound) => {
        maladyFound
          .update({
            malady: malady ? malady : maladyFound.malady,
            niveau: level ? level : maladyFound.niveau,
          })
          .then((maladyUpdate) => {
            data(maladyUpdate);
          })
          .catch((err) => {
            console.warn(err);
            return res.status(500).json({
              error:
                "l'operation de la modification de la maladie n' a pas aboutir",
            });
          });
      },
    ]);
  },
  deleteMalade: (req, res) => {},
};
