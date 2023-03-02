"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const serverless_http_1 = __importDefault(require("serverless-http"));
const express_1 = __importDefault(require("express"));
const TooGoodToGoClient_1 = require("../TooGoodToGoClient/TooGoodToGoClient");
const Env_1 = require("../Env");
const app = (0, express_1.default)();
app.post("/login/:email", async (req, resp, next) => {
    const tgtgClient = new TooGoodToGoClient_1.TooGoodToGoClient();
    const { email } = req.params;
    try {
        await tgtgClient.login(email);
        resp.send("Login request sent, send continue request once email is verified");
    }
    catch (err) {
        next(err);
    }
});
app.post("/login/:email/continue", async (req, resp) => {
    const tgtgClient = new TooGoodToGoClient_1.TooGoodToGoClient();
    const { email } = req.params;
    await tgtgClient.continueLogin(email);
    resp.send("Login complete");
});
app.get("/login", (req, resp) => {
    resp.send(`${Env_1.Env.TABLE_NAME} ${Env_1.Env.AWS_REGION}`);
});
module.exports.handler = (0, serverless_http_1.default)(app);
