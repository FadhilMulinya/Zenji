import { InjectiveActions } from "./src/iagent/plugin-injective/src/action/index.ts";

console.log(`Total actions: ${InjectiveActions.length}`);

InjectiveActions.forEach((action, index) => {
    if (!action) {
        console.error(`Action at index ${index} is null/undefined`);
        return;
    }
    if (typeof action.validate !== "function") {
        console.error(`Action "${action.name}" at index ${index} is missing validate()`);
        console.dir(action, { depth: 1 });
    }
});
