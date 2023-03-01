import serverless from "serverless-http";
import express, { Express, Request, Response } from "express";

const app: Express = express();


app.post("/login", (req: Request, resp: Response) => {
    resp.send("Login request sent, send continue request once email is verified");
})

module.exports.handler = serverless(app)