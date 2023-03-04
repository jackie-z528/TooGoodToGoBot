import {
  Client,
  GatewayIntentBits,
  EmbedBuilder,
  TextChannel,
} from "discord.js";
import { Env } from "../Env";
import * as _ from "lodash";

export class DiscordClient {
  private client: Client;
  constructor() {
    this.client = new Client({ intents: [GatewayIntentBits.Guilds] });
  }

  public async login() {
    return this.client.login(Env.DISCORD_TOKEN);
  }

  public async logout() {
    return this.client.destroy();
  }

  public async sendEmbeds(embeds: EmbedBuilder[], channelIds: string[]) {
    const channelsPromise = channelIds.map((id) =>
      this.client.channels.fetch(id)
    );
    const channels = await Promise.all(channelsPromise);
    const sendableChannels = _.chain(channels)
      .compact()
      .filter("send")
      .value() as unknown as TextChannel[];
    sendableChannels.forEach((channel) => channel.send({ embeds }));
  }
}
