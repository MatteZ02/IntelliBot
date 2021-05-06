import { GuildMember, MessageEmbed, TextChannel } from "discord.js";
import Client from "./Client";
import { reason, Member, punishments } from "./DataBase";
import roleConfig from "../config/roleConfig.json";
import ms from "ms";

class Punisher {
    logsChannel: TextChannel | null;
    constructor(private readonly client: Client) {
        this.logsChannel = null;
        client.once("ready", () => {
            this.logsChannel =
                (client.channels.cache.get(client.config.config.logChannel) as
                    | TextChannel
                    | undefined) ??
                (client.channels.resolve(client.config.config.logChannel) as TextChannel) ??
                null;
            if (!this.logsChannel) console.log("Unable to obtain logs channel");
        });
    }

    public autoPunish(reason: string) {
        switch (reason) {
            case "ads":
                break;
            case "cont_ping":
                break;
            case "discrimination":
                break;
            case "disrespect":
                break;
            case "emoji_spam":
                break;
            case "ghost_ping":
                break;
            case "gifImage_spam":
                break;
            case "inv_link":
                break;
            case "mass_ping":
                break;
            case "nsfw_general":
                break;
            case "nsfw_image":
                break;
            case "nsfw_link":
                break;
            case "nsfw_talk":
                break;
            case "offtopic":
                break;
            case "other":
                break;
            case "racism":
                break;
            case "spam":
                break;
            case "swearing":
                break;
            case "toxicity":
                break;
        }
    }

    public async warn(
        member: GuildMember,
        author: string,
        reason: reason,
        detailedReason?: string
    ) {
        const existingData = (await this.client.database.getData("users", {
            _id: member.user.id
        })) as Member;
        const timestamp = Date.now();
        existingData.warnings.push({
            reason,
            detailedReason: detailedReason ?? null,
            timestamp,
            author
        });
        this.client.database.updateData(
            "users",
            { _id: member.user.id },
            {
                warnings: existingData.warnings
            }
        );
        member.send(
            new MessageEmbed()
                .setTitle("Warning!")
                .setDescription(
                    `You have been warned in ${member.guild.name} for ${
                        detailedReason ? detailedReason : reason
                    }`
                )
                .setColor(this.client.config.config.embedColor)
        );
        this.logsChannel?.send(
            new MessageEmbed()
                .setTitle(`Warned ${member.user.tag} | ${member.user.id}`)
                .setDescription(
                    `reason: ${reason}\ndetailedReason: ${detailedReason}\ntimestamp: ${timestamp}`
                )
                .setColor(this.client.config.config.embedColor)
                .setTimestamp(timestamp)
                .setAuthor(author)
        );
    }
    public async mute(
        member: GuildMember,
        author: string,
        reason: reason,
        detailedReason?: string,
        time?: number
    ) {
        const timestamp = Date.now();
        const existingUserData = (await this.client.database.getData("users", {
            _id: member.user.id
        })) as Member;
        const existingMuteData = (await this.client.database.getData("punishments", {
            type: "mutes"
        })) as punishments;
        existingUserData.mutes.push({
            reason,
            detailedReason: detailedReason ?? null,
            timestamp,
            author
        });
        this.client.database.updateData(
            "users",
            { _id: member.user.id },
            {
                mutes: existingUserData.mutes
            }
        );
        member.send(
            new MessageEmbed()
                .setTitle("Muted!")
                .setDescription(
                    `You have been muted in ${member.guild.name} for ${
                        detailedReason ? detailedReason : reason
                    }${
                        time
                            ? `\nThis mute will last for ${ms(time, { long: true })}`
                            : "This mute is permanent!"
                    }`
                )
                .setColor(this.client.config.config.embedColor)
        );
        this.logsChannel?.send(
            new MessageEmbed()
                .setTitle(`Muted ${member.user.tag} | ${member.user.id}`)
                .setDescription(
                    `reason: ${reason}\ndetailedReason: ${detailedReason}\ntimestamp: ${timestamp}\nTime: ${
                        time ? ms(time) : "Permanent mute"
                    }`
                )
                .setColor(this.client.config.config.embedColor)
                .setTimestamp(timestamp)
                .setAuthor(author)
        );
        member.roles.add(roleConfig.muted);
        if (time) {
            existingMuteData.active.push({ user: member.user.id, expires: Date.now() + time });
            this.client.database.updateData(
                "punishments",
                { type: "mutes" },
                { active: existingMuteData.active }
            );
        }
    }
    public async kick(
        member: GuildMember,
        author: string,
        reason: reason,
        detailedReason?: string
    ) {
        member.kick(reason);
        const existingData = (await this.client.database.getData("users", {
            _id: member.user.id
        })) as Member;
        const timestamp = Date.now();
        existingData.kicks.push({
            reason,
            detailedReason: detailedReason ?? null,
            timestamp,
            author
        });
        this.client.database.updateData(
            "users",
            { _id: member.user.id },
            {
                kicks: existingData.kicks
            }
        );
        member.send(
            new MessageEmbed()
                .setTitle("Kicked!")
                .setDescription(
                    `You have been kicked in ${member.guild.name} for ${
                        detailedReason ? detailedReason : reason
                    }`
                )
                .setColor(this.client.config.config.embedColor)
        );
        this.logsChannel?.send(
            new MessageEmbed()
                .setTitle(`Kicked ${member.user.tag} | ${member.user.id}`)
                .setDescription(
                    `reason: ${reason}\ndetailedReason: ${detailedReason}\ntimestamp: ${timestamp}`
                )
                .setColor(this.client.config.config.embedColor)
                .setTimestamp(timestamp)
                .setAuthor(author)
        );
    }
    public async ban(
        member: GuildMember,
        author: string,
        reason: reason,
        detailedReason?: string,
        time?: number
    ) {
        member.ban({ reason });
        const existingUserData = (await this.client.database.getData("users", {
            _id: member.user.id
        })) as Member;
        const existingBanData = (await this.client.database.getData("punishments", {
            type: "bans"
        })) as punishments;
        const timestamp = Date.now();
        existingUserData.mutes.push({
            reason,
            detailedReason: detailedReason ?? null,
            timestamp,
            author
        });
        existingUserData.bans.push({
            reason,
            detailedReason: detailedReason ?? null,
            timestamp,
            author
        });
        this.client.database.updateData(
            "users",
            { _id: member.user.id },
            {
                bans: existingUserData.bans
            }
        );
        member.send(
            new MessageEmbed()
                .setTitle("Banned!")
                .setDescription(
                    `You have been banned in ${member.guild.name} for ${
                        detailedReason ? detailedReason : reason
                    }${
                        time
                            ? `\nThis ban will last for ${ms(time, { long: true })}`
                            : "This ban is permanent!"
                    }`
                )
                .setColor(this.client.config.config.embedColor)
        );
        new MessageEmbed()
            .setTitle(`Banned ${member.user.tag} | ${member.user.id}`)
            .setDescription(
                `reason: ${reason}\ndetailedReason: ${detailedReason}\ntimestamp: ${timestamp}\nTime: ${
                    time ? ms(time) : "Permanent ban"
                }`
            )
            .setColor(this.client.config.config.embedColor)
            .setTimestamp(timestamp)
            .setAuthor(author);
        if (time) {
            existingBanData.active.push({ user: member.user.id, expires: Date.now() + time });
            this.client.database.updateData(
                "punishments",
                { type: "bans" },
                { active: existingBanData.active }
            );
        }
    }
}

export default Punisher;
