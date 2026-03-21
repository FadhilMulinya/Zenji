"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.WasmActions = exports.GetWasmxModuleStateAction = exports.GetWasmxModuleParamsAction = exports.MsgPrivilegedExecuteContractAction = exports.MsgExecuteContractCompatAction = exports.MsgInstantiateContractAction = exports.MsgMigrateContractAction = exports.MsgExecuteContractAction = exports.MsgUpdateAdminAction = exports.MsgStoreCodeAction = exports.GetContractCodeContractsAction = exports.GetContractCodeAction = exports.GetContractCodesAction = exports.GetRawContractStateAction = exports.GetSmartContractStateAction = exports.GetContractHistoryAction = exports.GetContractInfoAction = exports.GetContractStateAction = exports.GetContractAccountsBalanceAction = void 0;
const base_1 = require("./base");
const WasmTemplates = __importStar(require("@injective/template/wasm"));
const WasmExamples = __importStar(require("@injective/examples/wasm"));
const WasmSimiles = __importStar(require("@injective/similes/wasm"));
// Contract Query Actions
exports.GetContractAccountsBalanceAction = (0, base_1.createGenericAction)({
    name: "GET_CONTRACT_ACCOUNTS_BALANCE",
    description: "Fetches the balance of contract accounts",
    template: WasmTemplates.getContractAccountsBalanceTemplate,
    examples: WasmExamples.getContractAccountsBalanceExample,
    similes: WasmSimiles.getContractAccountsBalanceSimiles,
    functionName: "getContractAccountsBalance",
    validateContent: () => true,
});
exports.GetContractStateAction = (0, base_1.createGenericAction)({
    name: "GET_CONTRACT_STATE",
    description: "Fetches the state of a specific contract",
    template: WasmTemplates.getContractStateTemplate,
    examples: WasmExamples.getContractStateExample,
    similes: WasmSimiles.getContractStateSimiles,
    functionName: "getContractState",
    validateContent: () => true,
});
exports.GetContractInfoAction = (0, base_1.createGenericAction)({
    name: "GET_CONTRACT_INFO",
    description: "Fetches information about a specific contract",
    template: WasmTemplates.getContractInfoTemplate,
    examples: WasmExamples.getContractInfoExample,
    similes: WasmSimiles.getContractInfoSimiles,
    functionName: "getContractInfo",
    validateContent: () => true,
});
exports.GetContractHistoryAction = (0, base_1.createGenericAction)({
    name: "GET_CONTRACT_HISTORY",
    description: "Fetches the history of a specific contract",
    template: WasmTemplates.getContractHistoryTemplate,
    examples: WasmExamples.getContractHistoryExample,
    similes: WasmSimiles.getContractHistorySimiles,
    functionName: "getContractHistory",
    validateContent: () => true,
});
exports.GetSmartContractStateAction = (0, base_1.createGenericAction)({
    name: "GET_SMART_CONTRACT_STATE",
    description: "Fetches the smart contract state based on a query",
    template: WasmTemplates.getSmartContractStateTemplate,
    examples: WasmExamples.getSmartContractStateExample,
    similes: WasmSimiles.getSmartContractStateSimiles,
    functionName: "getSmartContractState",
    validateContent: () => true,
});
exports.GetRawContractStateAction = (0, base_1.createGenericAction)({
    name: "GET_RAW_CONTRACT_STATE",
    description: "Fetches the raw state of a specific contract based on a query",
    template: WasmTemplates.getRawContractStateTemplate,
    examples: WasmExamples.getRawContractStateExample,
    similes: WasmSimiles.getRawContractStateSimiles,
    functionName: "getRawContractState",
    validateContent: () => true,
});
// Code Query Actions
exports.GetContractCodesAction = (0, base_1.createGenericAction)({
    name: "GET_CONTRACT_CODES",
    description: "Fetches all contract codes with optional pagination",
    template: WasmTemplates.getContractCodesTemplate,
    examples: WasmExamples.getContractCodesExample,
    similes: WasmSimiles.getContractCodesSimiles,
    functionName: "getContractCodes",
    validateContent: () => true,
});
exports.GetContractCodeAction = (0, base_1.createGenericAction)({
    name: "GET_CONTRACT_CODE",
    description: "Fetches a specific contract code by its ID",
    template: WasmTemplates.getContractCodeTemplate,
    examples: WasmExamples.getContractCodeExample,
    similes: WasmSimiles.getContractCodeSimiles,
    functionName: "getContractCode",
    validateContent: () => true,
});
exports.GetContractCodeContractsAction = (0, base_1.createGenericAction)({
    name: "GET_CONTRACT_CODE_CONTRACTS",
    description: "Fetches contracts associated with a specific contract code",
    template: WasmTemplates.getContractCodeContractsTemplate,
    examples: WasmExamples.getContractCodeContractsExample,
    similes: WasmSimiles.getContractCodeContractsSimiles,
    functionName: "getContractCodeContracts",
    validateContent: () => true,
});
// Message Actions
exports.MsgStoreCodeAction = (0, base_1.createGenericAction)({
    name: "MSG_STORE_CODE",
    description: "Broadcasts a message to store new contract code",
    template: WasmTemplates.msgStoreCodeTemplate,
    examples: WasmExamples.msgStoreCodeExample,
    similes: WasmSimiles.msgStoreCodeSimiles,
    functionName: "msgStoreCode",
    validateContent: () => true,
});
exports.MsgUpdateAdminAction = (0, base_1.createGenericAction)({
    name: "MSG_UPDATE_ADMIN",
    description: "Broadcasts a message to update the admin of a contract",
    template: WasmTemplates.msgUpdateAdminTemplate,
    examples: WasmExamples.msgUpdateAdminExample,
    similes: WasmSimiles.msgUpdateAdminSimiles,
    functionName: "msgUpdateAdmin",
    validateContent: () => true,
});
exports.MsgExecuteContractAction = (0, base_1.createGenericAction)({
    name: "MSG_EXECUTE_CONTRACT",
    description: "Broadcasts a message to execute a contract",
    template: WasmTemplates.msgExecuteContractTemplate,
    examples: WasmExamples.msgExecuteContractExample,
    similes: WasmSimiles.msgExecuteContractSimiles,
    functionName: "msgExecuteContract",
    validateContent: () => true,
});
exports.MsgMigrateContractAction = (0, base_1.createGenericAction)({
    name: "MSG_MIGRATE_CONTRACT",
    description: "Broadcasts a message to migrate a contract to a new code version",
    template: WasmTemplates.msgMigrateContractTemplate,
    examples: WasmExamples.msgMigrateContractExample,
    similes: WasmSimiles.msgMigrateContractSimiles,
    functionName: "msgMigrateContract",
    validateContent: () => true,
});
exports.MsgInstantiateContractAction = (0, base_1.createGenericAction)({
    name: "MSG_INSTANTIATE_CONTRACT",
    description: "Broadcasts a message to instantiate a new contract",
    template: WasmTemplates.msgInstantiateContractTemplate,
    examples: WasmExamples.msgInstantiateContractExample,
    similes: WasmSimiles.msgInstantiateContractSimiles,
    functionName: "msgInstantiateContract",
    validateContent: () => true,
});
exports.MsgExecuteContractCompatAction = (0, base_1.createGenericAction)({
    name: "MSG_EXECUTE_CONTRACT_COMPAT",
    description: "Broadcasts a message to execute a contract using compatibility mode",
    template: WasmTemplates.msgExecuteContractCompatTemplate,
    examples: WasmExamples.msgExecuteContractCompatExample,
    similes: WasmSimiles.msgExecuteContractCompatSimiles,
    functionName: "msgExecuteContractCompat",
    validateContent: () => true,
});
exports.MsgPrivilegedExecuteContractAction = (0, base_1.createGenericAction)({
    name: "MSG_PRIVILEGED_EXECUTE_CONTRACT",
    description: "Broadcasts a privileged message to execute a contract",
    template: WasmTemplates.msgPrivilegedExecuteContractTemplate,
    examples: WasmExamples.msgPrivilegedExecuteContractExample,
    similes: WasmSimiles.msgPrivilegedExecuteContractSimiles,
    functionName: "msgPrivilegedExecuteContract",
    validateContent: () => true,
});
// WasmX Query Actions
exports.GetWasmxModuleParamsAction = (0, base_1.createGenericAction)({
    name: "GET_WASMX_MODULE_PARAMS",
    description: "Fetches the parameters of the WasmX module",
    template: WasmTemplates.getWasmxModuleParamsTemplate,
    examples: WasmExamples.getWasmxModuleParamsExample,
    similes: WasmSimiles.getWasmxModuleParamsSimiles,
    functionName: "getWasmxModuleParams",
    validateContent: () => true,
});
exports.GetWasmxModuleStateAction = (0, base_1.createGenericAction)({
    name: "GET_WASMX_MODULE_STATE",
    description: "Fetches the current state of the WasmX module",
    template: WasmTemplates.getWasmxModuleStateTemplate,
    examples: WasmExamples.getWasmxModuleStateExample,
    similes: WasmSimiles.getWasmxModuleStateSimiles,
    functionName: "getWasmxModuleState",
    validateContent: () => true,
});
// Export all actions as a group
exports.WasmActions = [
    // Contract Query Actions
    exports.GetContractAccountsBalanceAction,
    exports.GetContractStateAction,
    exports.GetContractInfoAction,
    exports.GetContractHistoryAction,
    exports.GetSmartContractStateAction,
    exports.GetRawContractStateAction,
    // Code Query Actions
    exports.GetContractCodesAction,
    exports.GetContractCodeAction,
    exports.GetContractCodeContractsAction,
    // Message Actions
    exports.MsgStoreCodeAction,
    exports.MsgUpdateAdminAction,
    exports.MsgExecuteContractAction,
    exports.MsgMigrateContractAction,
    exports.MsgInstantiateContractAction,
    exports.MsgExecuteContractCompatAction,
    exports.MsgPrivilegedExecuteContractAction,
    // WasmX Query Actions
    exports.GetWasmxModuleParamsAction,
    exports.GetWasmxModuleStateAction,
];
