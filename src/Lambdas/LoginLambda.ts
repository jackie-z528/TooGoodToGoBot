import serverless from "serverless-http";
import express, { Express, Request, Response } from "express";
import { TooGoodToGoClient } from "../TooGoodToGoClient/TooGoodToGoClient";

const app: Express = express();


app.post("/login/:email", async (req: Request, resp: Response) => {
    const tgtgClient = new TooGoodToGoClient();
    const { email } = req.params;
    try {
        await tgtgClient.login(email);
        resp.send("Login request sent, send continue request once email is verified");
    } catch (err) {
        resp.send(err)
    }
})

app.post("/login/:email/continue", async (req: Request, resp: Response) => {
    const tgtgClient = new TooGoodToGoClient();
    const { email } = req.params;
    try {
        await tgtgClient.continueLogin(email);
        resp.send("Login complete")
    } catch (err) {
        resp.send(err)
    }
})

module.exports.handler = serverless(app)