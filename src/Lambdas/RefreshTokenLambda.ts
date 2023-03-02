import { TooGoodToGoClient } from "../TooGoodToGoClient/TooGoodToGoClient"

export const handler = async () => {
    const tgtgClient = new TooGoodToGoClient();
    try {
        await tgtgClient.refreshToken();
    } catch (err) {
        console.log(err)
    }
}