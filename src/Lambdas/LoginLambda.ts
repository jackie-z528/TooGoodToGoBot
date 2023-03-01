import serverless from "serverless-http";
import express, { Express, Request, Response } from "express";
import { TooGoodToGoClient } from "../TooGoodToGoClient/TooGoodToGoClient";

const app: Express = express();


app.post("/login/:email", async (req: Request, resp: Response) => {
    const tgtgClient = new TooGoodToGoClient();
    const { email } = req.params;
    await tgtgClient.login(email);
    resp.send("Login request sent, send continue request once email is verified");
})

app.post("/login/continue", async (req: Request, resp: Response) => {
    const tgtgClient = new TooGoodToGoClient();
    tgtgClient.continueLogin();
})

module.exports.handler = serverless(app)