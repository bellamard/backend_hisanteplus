const express = require("express");
const server = express();
const cors = require('cors');
const bodyParser = require("body-parser");
const apiRoutes = require("./apiRouter").router;
//
const port = process.env.PORT || 5000;

server.use(cors());
server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json());

server.use("/", apiRoutes);
server.listen(port, () => console.log(`Server started on port ${port}`));
