import express, { Request, Response } from "express";
import { TooGoodToGoClient } from "./TooGoodToGoClient/TooGoodToGoClient";
const app = express();

app.post("/login/:email", async (req: Request, resp: Response, next) => {
    const tgtgClient = new TooGoodToGoClient();
    const { email } = req.params;
    try {
        await tgtgClient.login(email);
        resp.send("Login request sent, send continue request once email is verified");
    } catch (err) {
        next(err);
    }
});

app.listen(3000, () => {
    console.log("Listening")
})