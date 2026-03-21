"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatTimestamp = exports.formatMessages = void 0;
exports.getActorDetails = getActorDetails;
exports.formatActors = formatActors;
/**
 * Get details for a list of actors.
 */
async function getActorDetails({ runtime, roomId, }) {
    const participantIds = await runtime.databaseAdapter.getParticipantsForRoom(roomId);
    const actors = await Promise.all(participantIds.map(async (userId) => {
        const account = await runtime.databaseAdapter.getAccountById(userId);
        if (account) {
            return {
                id: account.id,
                name: account.name,
                username: account.username,
                details: account.details,
            };
        }
        return null;
    }));
    return actors.filter((actor) => actor !== null);
}
/**
 * Format actors into a string
 * @param actors - list of actors
 * @returns string
 */
function formatActors({ actors }) {
    const actorStrings = actors.map((actor) => {
        const header = `${actor.name}${actor.details?.tagline ? ": " + actor.details?.tagline : ""}${actor.details?.summary ? "\n" + actor.details?.summary : ""}`;
        return header;
    });
    const finalActorStrings = actorStrings.join("\n");
    return finalActorStrings;
}
/**
 * Format messages into a string
 * @param messages - list of messages
 * @param actors - list of actors
 * @returns string
 */
const formatMessages = ({ messages, actors, }) => {
    const messageStrings = messages
        .reverse()
        .filter((message) => message.userId)
        .map((message) => {
        const messageContent = message.content.text;
        const messageAction = message.content.action;
        const formattedName = actors.find((actor) => actor.id === message.userId)
            ?.name || "Unknown User";
        const attachments = message.content.attachments;
        const attachmentString = attachments && attachments.length > 0
            ? ` (Attachments: ${attachments.map((media) => `[${media.id} - ${media.title} (${media.url})]`).join(", ")})`
            : "";
        const timestamp = (0, exports.formatTimestamp)(message.createdAt);
        const shortId = message.userId.slice(-5);
        return `(${timestamp}) [${shortId}] ${formattedName}: ${messageContent}${attachmentString}${messageAction && messageAction !== "null" ? ` (${messageAction})` : ""}`;
    })
        .join("\n");
    return messageStrings;
};
exports.formatMessages = formatMessages;
const formatTimestamp = (messageDate) => {
    const now = new Date();
    const diff = now.getTime() - messageDate;
    const absDiff = Math.abs(diff);
    const seconds = Math.floor(absDiff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    if (absDiff < 60000) {
        return "just now";
    }
    else if (minutes < 60) {
        return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`;
    }
    else if (hours < 24) {
        return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
    }
    else {
        return `${days} day${days !== 1 ? "s" : ""} ago`;
    }
};
exports.formatTimestamp = formatTimestamp;
