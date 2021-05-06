import Command from "../struct/classes/Command";
import Client from "../base/Client";
import Discord from "discord.js";
import { reason } from "../base/DataBase";
import ms from "ms";

const punishCommand = new Command({
    name: "punish",
    permissions: {
        admin: true,
        mod: true
    },
    data: {
        name: "punish",
        description: "punish a member",
        options: [
            {
                name: "member",
                description: "the member to punish",
                type: 6,
                required: true
            },
            {
                name: "reason",
                description: "reason for this punishment",
                type: 3,
                required: true,
                choices: [
                    { name: reason.ads, value: "ads" },
                    { name: reason.cont_ping, value: "cont_ping" },
                    { name: reason.discrimination, value: "discrimination" },
                    { name: reason.disrespect, value: "disrespect" },
                    { name: reason.emoji_spam, value: "emoji_spam" },
                    { name: reason.ghost_ping, value: "ghost_ping" },
                    { name: reason.gifImage_spam, value: "gifImage_spam" },
                    { name: reason.inv_link, value: "inv_link" },
                    { name: reason.mass_ping, value: "mass_ping" },
                    { name: reason.nsfw_general, value: "nsfw_general" },
                    { name: reason.nsfw_image, value: "nsfw_image" },
                    { name: reason.nsfw_link, value: "nsfw_link" },
                    { name: reason.nsfw_talk, value: "nsfw_talk" },
                    { name: reason.offtopic, value: "offtopic" },
                    { name: reason.other, value: "other" },
                    { name: reason.racism, value: "racism" },
                    { name: reason.spam, value: "spam" },
                    { name: reason.swearing, value: "swearing" },
                    { name: reason.toxicity, value: "toxicity" }
                ]
            },
            {
                name: "details",
                description: "a detailed reason for this punishment",
                type: 3
            },
            {
                name: "punishment",
                description: "punishment to issue. This will override automod.",
                type: 3,
                choices: [
                    { name: "warning", value: "warn" },
                    { name: "mute", value: "mute" },
                    { name: "kick", value: "kick" },
                    { name: "ban", value: "ban" }
                ]
            },
            {
                name: "time",
                description: "time to mute for. THIS WILL ONLY WORK IF PUNISHMENT IS SET TO MUTE!",
                type: 3
            }
        ]
    },
    execute: async (interaction: Discord.Interaction, client: Client) => {
        if (!interaction.options)
            return interaction.reply("This interaction was missing smth. Please retry", true);
        const member =
            client.guild?.members.cache.get(interaction.options[0].value as string) ??
            (await client.guild?.members.fetch(interaction.options[0].value as string));
        if (!member) return interaction.reply("Unable to fetch user", true);
        switch (interaction.options[3]?.value) {
            case "warn":
                client.punisher.warn(
                    member,
                    interaction.author?.tag ?? "unknown",
                    interaction.options[1].value as reason,
                    interaction.options[2]?.value as string
                );
                interaction.reply([
                    new Discord.MessageEmbed()
                        .setTitle("Warning")
                        .setDescription(`${client.guild?.members.cache.get(interaction.options[0].value as string)?.user.tag} have been warned!`)
                        .setColor(client.config.config.embedColor)
                ]);
                return;
            case "mute":
                client.punisher.mute(
                    member,
                    interaction.author?.tag ?? "unknown",
                    interaction.options[1].value as reason,
                    interaction.options[2]?.value as string,
                    interaction.options[4] ? +ms(interaction.options[4].value as string) : undefined
                );
                interaction.reply([
                    new Discord.MessageEmbed()
                        .setTitle("Mute")
                        .setDescription(
                            `${
                                client.guild?.members.cache.get(
                                    interaction.options[0].value as string
                                )?.user.tag
                            } is now muted!`
                        )
                        .setColor(client.config.config.embedColor)
                ]);
                return;
            case "kick":
                client.punisher.kick(
                    member,
                    interaction.author?.tag ?? "unknown",
                    interaction.options[1].value as reason,
                    interaction.options[2]?.value as string
                );
                interaction.reply([
                    new Discord.MessageEmbed()
                        .setTitle("kick")
                        .setDescription(
                            `${
                                client.guild?.members.cache.get(
                                    interaction.options[0].value as string
                                )?.user.tag
                            } have been kicked!`
                        )
                        .setColor(client.config.config.embedColor)
                ]);
                return;
            case "ban":
                client.punisher.ban(
                    member,
                    interaction.author?.tag ?? "unknown",
                    interaction.options[1].value as reason,
                    interaction.options[2]?.value as string,
                    interaction.options[4] ? +ms(interaction.options[4].value as string) : undefined
                );
                interaction.reply([
                    new Discord.MessageEmbed()
                        .setTitle("ban")
                        .setDescription(
                            `${
                                client.guild?.members.cache.get(
                                    interaction.options[0].value as string
                                )?.user.tag
                            } have been banned!`
                        )
                        .setColor(client.config.config.embedColor)
                ]);
                return;
        }

        client.punisher.autoPunish(interaction.options[1].value as string);
    }
});

export default punishCommand;
