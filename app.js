// Naložimo okoljske spremenljivke
require("dotenv").config();

// Povezava s podatkovno bazo
require("./api/models/db.js");

// Swagger in OpenAPI
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = swaggerJsDoc({
    definition: {
        openapi: "3.0.3",
        info: {
            title: "Interval zaupanja",
            version: "0.1.0",
            description:
                "REST API za Interval zaupanja"
        },
        tags: [
            {
                name: "Ankete",
                description: "",
            }, {
                name: "Izvajalci",
                description: "",
            }, {
                name: "Zalozniki",
                description: "",
            }
        ],
        servers: [
            {
                url: "http://localhost:4000/api",
                description: "Lokalni strežnik za razvoj in testiranje",
            },
            {
                url: "https://interval-zaupanja.onrender.com/api",
                description: "Produkcijski strežnik gostujoč na oblaku Render",
            },
        ],
        components: {
            schemas: {
                SporociloNapake: {
                    type: "object",
                    properties: {
                        sporocilo: {
                            type: "string",
                            description: "Napaka o sporočilu",
                        },
                    },
                    required: ["sporocilo"],
                },
            },
        },
    },
    apis: ["./api/models/schemas.js", "./api/controllers/*.js"],
});

// Strežba
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const http = require("http");

const port = process.env.PORT || 4000;
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", function (req, res) {
    app.engine("html", require("ejs").renderFile);
    app.set("view engine", "html");
    app.set('views', path.join(__dirname, 'public'));
    res.render("domov.html");
});

// API routing
var indexApi = require("./api/routes/index"); // usmerjevalnik za API
app.use('/api', indexApi);

// Swagger JSON specifikacija in GUI (oboje znotraj /api)
indexApi.get("/swagger.json", (req, res) =>
    res.status(200).json(swaggerDocument)
);
indexApi.use(
    "/docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocument, {
        customCss: ".swagger-ui .topbar { display: none }",
    })
);

// Server start
app.listen(port, () => {
    console.log(
        `App started in '${
            process.env.NODE_ENV || "development"
        } mode' listening on port ${port}!`
    );
});

module.exports = app;
