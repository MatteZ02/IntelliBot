import Command from "../struct/classes/Command";
import Client from "../base/Client";
import Discord from "discord.js";
import { Member } from "../base/DataBase";

const infractionCommand = new Command({
    name: "infraction",
    permissions: {
        admin: true,
        mod: true
    },
    data: {
        name: "infraction",
        description: "manage the infractions of a member",
        options: [
            {
                name: "member",
                description: "the member whose infractions to check or manage",
                type: 6,
                required: true
            },
            {
                name: "action",
                description: "the member whose infractions to check or manage",
                type: 3,
                choices: [
                    { name: "edit", value: "edit" },
                    { name: "delete", value: "delete" },
                    { name: "info", value: "info" }
                ]
            },
            {
                name: "id",
                description: "id for the infraction",
                type: 4
            },
            {
                name: "data",
                description: "the new reason",
                type: 3
            }
        ]
    },
    execute: async (interaction: Discord.Interaction, client: Client) => {
        if (!interaction.options)
            return interaction.reply("This interaction was missing smth. Please retry", true);
        const userData = (await client.database.getData("users", {
            _id: interaction.options[0].value as string
        })) as Member;
        switch (interaction.options[1]?.value) {
            case "edit":
                break;

            case "delete":
                break;

            case "info":
                break;

            default:
                interaction.reply([
                    new Discord.MessageEmbed()
                        .setTitle(
                            `Infractions for ${
                                client.guild?.members.cache.get(
                                    interaction.options[0].value as string
                                )?.user.tag
                            }`
                        )
                        .setDescription(
                            `Warnings: ${userData.warnings.length}\nMutes: ${userData.mutes.length}\nKicks: ${userData.kicks.length}\nbans: ${userData.bans.length}\n`
                        )
                        .setColor(client.config.config.embedColor)
                ]);
                break;
        }
    }
});

export default infractionCommand;
