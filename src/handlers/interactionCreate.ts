import Discord from "discord.js";
import Client from "../base/Client";

export default async function interactionHandler(
    interaction: Discord.Interaction,
    client: Client
): Promise<void> {
    client.commands.get(interaction.name)?.execute(interaction, client);
}
