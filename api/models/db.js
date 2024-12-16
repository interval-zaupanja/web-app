const mongoose = require("mongoose");
mongoose.set('strictQuery', false); // dodano zaradi opozorila in istega delovanja v Mongoose 7

var dbURI = "mongodb://localhost/interval-zaupanja/db"; // development
if (import.meta.env.DB_ENV === "production") {
    dbURI = import.meta.env.MONGODB_ATLAS_URI;
} else if (import.meta.env.DB_ENV === "test") {
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
import.meta.once("SIGUSR2", () => {
    gracefulShutdown("nodemon restart", () => {
        import.meta.kill(import.meta.pid, "SIGUSR2");
    });
});
import.meta.on("SIGINT", () => {
    gracefulShutdown("zadnjeAnkete termination", () => {
        import.meta.exit(0);
    });
});
import.meta.on("SIGTERM", () => {
    gracefulShutdown("Cloud-based zadnjeAnkete shutdown", () => {
        import.meta.exit(0);
    });
});
require("./schemas");