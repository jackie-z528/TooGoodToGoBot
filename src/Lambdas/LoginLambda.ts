import serverless from "serverless-http";
import express, { Express, Request, Response } from "express";
import { TooGoodToGoClient } from "../TooGoodToGoClient/TooGoodToGoClient";
import { Env } from "../Env";

const app: Express = express();


app.post("/login/:email", async (req: Request, resp: Response, next) => {
    const tgtgClient = new TooGoodToGoClient();
    const { email } = req.params;
    try {
        await tgtgClient.login(email);
        resp.send("Login request sent, send continue request once email is verified");
    } catch (err) {
        next(err);
    }
})

app.post("/login/:email/continue", async (req: Request, resp: Response) => {
    const tgtgClient = new TooGoodToGoClient();
    const { email } = req.params;
    await tgtgClient.continueLogin(email);
    resp.send("Login complete")
})

app.get("/login", (req, resp) => {
    resp.send(`${Env.TABLE_NAME} ${Env.AWS_REGION}`)
})

module.exports.handler = serverless(app)