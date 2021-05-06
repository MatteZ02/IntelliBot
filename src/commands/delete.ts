import Command from "../struct/classes/Command";
import Client from "../base/Client";
import Discord from "discord.js";

const deleteCommand = new Command({
    name: "delete",
    permissions: {
        admin: true,
        mod: true,
        support: true
    },
    data: {
        name: "delete",
        description: "delete messages",

        options: [
            {
                name: "amount",
                description: "amount of messages to delete",
                type: 4,
                required: true
            }
        ]
    },
    execute: async (interaction: Discord.Interaction, client: Client) => {
        interaction.channel
            .bulkDelete((interaction.options || [{ value: 0 }])[0].value as number, true)
            .then(messages =>
                interaction.reply(
                    `:white_check_mark: Successfully deleted ${messages.size} messages!`,
                    true
                )
            );
    }
});

export default deleteCommand;
