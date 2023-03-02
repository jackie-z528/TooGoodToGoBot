import got, { Got } from "got";
import { CookieJar } from "tough-cookie";
import { Db } from "../DB/db";
import { EmailAuthResponse, PollAuthResponse } from "./models/Auth";

const BASE_AUTH_URL = "auth/v3";

export class TooGoodToGoClient {
    private client: Got;
    private db: Db;

    constructor() {
        this.client = got.extend({
            cookieJar: new CookieJar(),
            prefixUrl: "https://apptoogoodtogo.com/api/",
            headers: {
                "User-Agent":
                    "TooGoodToGo/21.9.0 (813) (iPhone/iPhone 7 (GSM); iOS 15.1; Scale/2.00)",
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
        this.db = new Db();
    }

    public async login(email: string): Promise<void> {
        const emailAuthResponse: EmailAuthResponse = await this.client.post(`${BASE_AUTH_URL}/authByEmail`, { json: { email, device_type: "IOS" } }).json()
        const { polling_id } = emailAuthResponse;
        return this.db.setPollingId(polling_id);
    }

    public async continueLogin(email: string): Promise<void> {
        const polling_id = this.db.getPollingId();
        const pollAuthResponse: PollAuthResponse = await this.client
            .post(`${BASE_AUTH_URL}/authByRequestPollingId`, {
                json: {
                    polling_id,
                    email,
                    device_type: "IOS"
                }
            }).json()
        const { access_token, refresh_token } = pollAuthResponse;
        await Promise.all([this.db.setAccessToken(access_token), this.db.setRefreshToken(refresh_token)])
    }
}
