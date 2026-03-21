"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.composeActionExamples = void 0;
exports.formatActionNames = formatActionNames;
exports.formatActions = formatActions;
const unique_names_generator_1 = require("unique-names-generator");
/**
 * Composes a set of example conversations based on provided actions and a specified count.
 * It randomly selects examples from the provided actions and formats them with generated names.
 * @param actionsData - An array of `Action` objects from which to draw examples.
 * @param count - The number of examples to generate.
 * @returns A string containing formatted examples of conversations.
 */
const composeActionExamples = (actionsData, count) => {
    const data = actionsData.map((action) => [
        ...action.examples,
    ]);
    const actionExamples = [];
    let length = data.length;
    for (let i = 0; i < count && length; i++) {
        const actionId = i % length;
        const examples = data[actionId];
        if (examples.length) {
            const rand = ~~(Math.random() * examples.length);
            actionExamples[i] = examples.splice(rand, 1)[0];
        }
        else {
            i--;
        }
        if (examples.length == 0) {
            data.splice(actionId, 1);
            length--;
        }
    }
    const formattedExamples = actionExamples.map((example) => {
        const exampleNames = Array.from({ length: 5 }, () => (0, unique_names_generator_1.uniqueNamesGenerator)({ dictionaries: [unique_names_generator_1.names] }));
        return `\n${example
            .map((message) => {
            let messageString = `${message.user}: ${message.content.text}${message.content.action ? ` (${message.content.action})` : ""}`;
            for (let i = 0; i < exampleNames.length; i++) {
                messageString = messageString.replaceAll(`{{user${i + 1}}}`, exampleNames[i]);
            }
            return messageString;
        })
            .join("\n")}`;
    });
    return formattedExamples.join("\n");
};
exports.composeActionExamples = composeActionExamples;
/**
 * Formats the names of the provided actions into a comma-separated string.
 * @param actions - An array of `Action` objects from which to extract names.
 * @returns A comma-separated string of action names.
 */
function formatActionNames(actions) {
    return actions
        .sort(() => 0.5 - Math.random())
        .map((action) => `${action.name}`)
        .join(", ");
}
/**
 * Formats the provided actions into a detailed string listing each action's name and description, separated by commas and newlines.
 * @param actions - An array of `Action` objects to format.
 * @returns A detailed string of actions, including names and descriptions.
 */
function formatActions(actions) {
    return actions
        .sort(() => 0.5 - Math.random())
        .map((action) => `${action.name}: ${action.description}`)
        .join(",\n");
}
