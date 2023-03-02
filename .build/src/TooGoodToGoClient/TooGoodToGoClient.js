"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TooGoodToGoClient = void 0;
const got_1 = __importDefault(require("got"));
const tough_cookie_1 = require("tough-cookie");
const db_1 = require("../DB/db");
const BASE_AUTH_URL = "auth/v3";
class TooGoodToGoClient {
    constructor() {
        this.client = got_1.default.extend({
            cookieJar: new tough_cookie_1.CookieJar(),
            prefixUrl: "https://apptoogoodtogo.com/api/",
            headers: {
                "User-Agent": "TooGoodToGo/21.9.0 (813) (iPhone/iPhone 7 (GSM); iOS 15.1; Scale/2.00)",
                "Content-Type": "application/json",
                Accept: "",
                "Accept-Language": "en-US",
                "Accept-Encoding": "gzip",
            },
            responseType: "json",
            resolveBodyOnly: true,
            retry: {
                limit: 2,
                methods: ["GET", "POST", "PUT", "HEAD", "DELETE", "OPTIONS", "TRACE"],
                statusCodes: [401, 403, 408, 413, 429, 500, 502, 503, 504, 521, 522, 524],
            },
        });
        this.db = new db_1.Db();
    }
    async login(email) {
        const emailAuthResponse = await this.client.post(`${BASE_AUTH_URL}/authByEmail`, { json: { email, device_type: "IOS" } }).json();
        const { polling_id } = emailAuthResponse;
        return this.db.setPollingId(polling_id);
    }
    async continueLogin(email) {
        const polling_id = this.db.getPollingId();
        const pollAuthResponse = await this.client
            .post(`${BASE_AUTH_URL}/authByRequestPollingId`, {
            json: {
                polling_id,
                email,
                device_type: "IOS"
            }
        }).json();
        const { access_token, refresh_token } = pollAuthResponse;
        await Promise.all([this.db.setAccessToken(access_token), this.db.setRefreshToken(refresh_token)]);
    }
}
exports.TooGoodToGoClient = TooGoodToGoClient;
