"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createGenericAction = createGenericAction;
const core_1 = require("@elizaos/core");
const modules_1 = require("@injective/modules");
/**
 * A factory function that returns an ElizaOS Action.
 */
function createGenericAction({ name, description, template, examples, functionName, similes, }) {
    return {
        name, // e.g. "PLACE_BID"
        description, // e.g. "Place a bid using the InjectiveGrpcClient"
        examples: [examples], // I have manually casted the inputs here
        similes, // (optional) synonyms or alternate names if you like
        validate: async (_runtime, _message) => {
            return true;
        },
        handler: async (runtime, message, state, _options, callback) => {
            core_1.elizaLogger.debug(`create action: ${name}`);
            // 1. Compose or update the state
            if (!state) {
                state = (await runtime.composeState(message));
            }
            else {
                state = await runtime.updateRecentMessageState(state);
            }
            // 2. Compose a context from the given template
            const context = (0, core_1.composeContext)({
                state,
                template,
            });
            // 3. Use the AI model to generate content based on the context
            const params = await (0, core_1.generateObjectDeprecated)({
                runtime,
                context,
                modelClass: core_1.ModelClass.LARGE,
            });
            // 5. Initialize the Injective client
            try {
                const rawNetwork = runtime.getSetting("INJECTIVE_NETWORK");
                const injectivePrivateKey = runtime.getSetting("INJECTIVE_PRIVATE_KEY");
                const ethPublicKey = runtime.getSetting("EVM_PUBLIC_KEY");
                const injPublicKey = runtime.getSetting("INJECTIVE_PUBLIC_KEY");
                const network = rawNetwork;
                if (!injectivePrivateKey ||
                    (!ethPublicKey && !injPublicKey) ||
                    !network) {
                    throw new Error("Incorrect configuration");
                }
                const client = new modules_1.InjectiveGrpcClient(network, injectivePrivateKey, ethPublicKey, injPublicKey);
                // 6. Dynamically call the specified functionName on the Injective client
                const method = client[functionName];
                if (typeof method !== "function") {
                    throw new Error(`Method "${functionName}" does not exist on InjectiveGrpcClient`);
                }
                //Function that the LLM extracted
                console.log(`wil pass these params ${JSON.stringify(params)}}`);
                //Need to standardize this context params
                const response = await method(params);
                console.log(`Recieved a response from InjectiveGrpcClient , response: ${JSON.stringify(response)}, `);
                // Lets convert the result of the response into something that can be read
                if (response.success) {
                    console.log("Cleaning up the response");
                    const additionalTemplate = `Extract the response from the following data, also make sure that you format the response into human readable format, make it the prettiest thing anyone can read basically a very nice comprehensive summary in a string format.`;
                    const responseResult = JSON.stringify(response.result);
                    const newContext = `${additionalTemplate}\n${responseResult}`;
                    const totalContext = `Previous chat context:${context} \n New information : ${newContext}`;
                    console.log(`Got context, now will pass it on to llm ${totalContext}`);
                    const responseContent = await (0, core_1.generateText)({
                        runtime,
                        context: totalContext,
                        modelClass: core_1.ModelClass.SMALL,
                    });
                    console.log("Response content:", responseContent);
                    if (callback)
                        callback({
                            text: `Operation ${name} succeeded, ${responseContent}.`,
                            content: response.result,
                        });
                }
                else {
                    // 7. Trigger any callback with failure info
                    if (callback) {
                        callback({
                            text: `Operation ${name} failed.\n${response.result}`,
                            content: response.result,
                        });
                    }
                }
                // Return true if code == 0 (success), else false
                return response.result.code === 0;
            }
            catch (error) {
                if (callback) {
                    callback({
                        text: `Error in ${name}: ${error.message}`,
                        content: { error: error.message },
                    });
                }
                return false;
            }
        },
    };
}
