const mongoose = require("mongoose");
mongoose.set('strictQuery', false); // dodano zaradi opozorila in istega delovanja v Mongoose 7

var dbURI = "mongodb://localhost/interval-zaupanja/db"; // development
if (process.env.DB_ENV === "production") {
    dbURI = process.env.MONGODB_ATLAS_URI;
} else if (process.env.DB_ENV === "test") {
    dbURI = "mongodb://interval-zaupanja/db";
}
mongoose.connect(dbURI);

mongoose.connection.on("connected", () => {
    console.log(
        "Mongoose connected to '" + dbURI.replace(/:.+?@/, ":*****@") + "'."
    );
});
mongoose.connection.on("error", (err) => {
    console.log("Mongoose connection error: " + err);
});
mongoose.connection.on("disconnected", () => {
    console.log("Mongoose disconnected.");
});

const gracefulShutdown = (msg, callback) => {
    mongoose.connection.close(() => {
        console.log("Mongoose disconnected through '" + msg + "'.");
        callback();
    });
};
process.once("SIGUSR2", () => {
    gracefulShutdown("nodemon restart", () => {
        process.kill(process.pid, "SIGUSR2");
    });
});
process.on("SIGINT", () => {
    gracefulShutdown("zadnjeAnkete termination", () => {
        process.exit(0);
    });
});
process.on("SIGTERM", () => {
    gracefulShutdown("Cloud-based zadnjeAnkete shutdown", () => {
        process.exit(0);
    });
});
require("./schemas");