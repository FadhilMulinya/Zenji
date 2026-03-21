"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRelationship = createRelationship;
exports.getRelationship = getRelationship;
exports.getRelationships = getRelationships;
exports.formatRelationships = formatRelationships;
async function createRelationship({ runtime, userA, userB, }) {
    return runtime.databaseAdapter.createRelationship({
        userA,
        userB,
    });
}
async function getRelationship({ runtime, userA, userB, }) {
    return runtime.databaseAdapter.getRelationship({
        userA,
        userB,
    });
}
async function getRelationships({ runtime, userId, }) {
    return runtime.databaseAdapter.getRelationships({ userId });
}
async function formatRelationships({ runtime, userId, }) {
    const relationships = await getRelationships({ runtime, userId });
    const formattedRelationships = relationships.map((relationship) => {
        const { userA, userB } = relationship;
        if (userA === userId) {
            return userB;
        }
        return userA;
    });
    return formattedRelationships;
}
