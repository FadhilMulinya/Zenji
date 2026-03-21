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
exports.ExplorerActions = exports.GetExplorerStatsAction = exports.GetIBCTransferTxsAction = exports.GetTxsAction = exports.GetBlockAction = exports.GetBlocksAction = exports.GetPeggyWithdrawalTxsAction = exports.GetPeggyDepositTxsAction = exports.GetValidatorUptimeAction = exports.GetExplorerValidatorAction = exports.GetAccountTxAction = exports.GetTxByHashAction = void 0;
// src/actions/explorer/explorer-actions.ts
const base_1 = require("./base");
const ExplorerTemplates = __importStar(require("@injective/template/explorer"));
const ExplorerExamples = __importStar(require("@injective/examples/explorer"));
const ExplorerSimiles = __importStar(require("@injective/similes/explorer"));
exports.GetTxByHashAction = (0, base_1.createGenericAction)({
    name: "GET_TX_BY_HASH",
    description: "Fetches a transaction by its hash",
    template: ExplorerTemplates.getTxByHashTemplate,
    examples: ExplorerExamples.getTxByHashExample,
    similes: ExplorerSimiles.getTxByHashSimiles,
    functionName: "getTxByHash",
    validateContent: () => true,
});
exports.GetAccountTxAction = (0, base_1.createGenericAction)({
    name: "GET_ACCOUNT_TX",
    description: "Fetches transactions for a specific account",
    template: ExplorerTemplates.getAccountTxTemplate,
    examples: ExplorerExamples.getAccountTxExample,
    similes: ExplorerSimiles.getAccountTxSimiles,
    functionName: "getAccountTx",
    validateContent: () => true,
});
exports.GetExplorerValidatorAction = (0, base_1.createGenericAction)({
    name: "GET_EXPLORER_VALIDATOR",
    description: "Fetches details of a specific validator",
    template: ExplorerTemplates.getValidatorTemplate,
    examples: ExplorerExamples.getValidatorExample,
    similes: ExplorerSimiles.getExplorerValidatorSimiles,
    functionName: "getValidator",
    validateContent: () => true,
});
exports.GetValidatorUptimeAction = (0, base_1.createGenericAction)({
    name: "GET_VALIDATOR_UPTIME",
    description: "Fetches the uptime of a specific validator",
    template: ExplorerTemplates.getValidatorUptimeTemplate,
    examples: ExplorerExamples.getValidatorUptimeExample,
    similes: ExplorerSimiles.getExplorerValidatorUptimeSimiles,
    functionName: "getValidatorUptime",
    validateContent: () => true,
});
exports.GetPeggyDepositTxsAction = (0, base_1.createGenericAction)({
    name: "GET_PEGGY_DEPOSIT_TXS",
    description: "Fetches Peggy deposit transactions",
    template: ExplorerTemplates.getPeggyDepositTxsTemplate,
    examples: ExplorerExamples.getPeggyDepositTxsExample,
    similes: ExplorerSimiles.getPeggyDepositTxsSimiles,
    functionName: "getPeggyDepositTxs",
    validateContent: () => true,
});
exports.GetPeggyWithdrawalTxsAction = (0, base_1.createGenericAction)({
    name: "GET_PEGGY_WITHDRAWAL_TXS",
    description: "Fetches Peggy withdrawal transactions",
    template: ExplorerTemplates.getPeggyWithdrawalTxsTemplate,
    examples: ExplorerExamples.getPeggyWithdrawalTxsExample,
    similes: ExplorerSimiles.getPeggyWithdrawalTxsSimiles,
    functionName: "getPeggyWithdrawalTxs",
    validateContent: () => true,
});
exports.GetBlocksAction = (0, base_1.createGenericAction)({
    name: "GET_BLOCKS",
    description: "Fetches a list of blocks based on provided parameters",
    template: ExplorerTemplates.getBlocksTemplate,
    examples: ExplorerExamples.getBlocksExample,
    similes: ExplorerSimiles.getBlocksSimiles,
    functionName: "getBlocks",
    validateContent: () => true,
});
exports.GetBlockAction = (0, base_1.createGenericAction)({
    name: "GET_BLOCK",
    description: "Fetches details of a specific block by its ID",
    template: ExplorerTemplates.getBlockTemplate,
    examples: ExplorerExamples.getBlockExample,
    similes: ExplorerSimiles.getBlockSimiles,
    functionName: "getBlock",
    validateContent: () => true,
});
exports.GetTxsAction = (0, base_1.createGenericAction)({
    name: "GET_TXS",
    description: "Fetches a list of transactions based on provided parameters",
    template: ExplorerTemplates.getTxsTemplate,
    examples: ExplorerExamples.getTxsExample,
    similes: ExplorerSimiles.getTxsSimiles,
    functionName: "getTxs",
    validateContent: () => true,
});
exports.GetIBCTransferTxsAction = (0, base_1.createGenericAction)({
    name: "GET_IBC_TRANSFER_TXS",
    description: "Fetches IBC transfer transactions",
    template: ExplorerTemplates.getIBCTransferTxsTemplate,
    examples: ExplorerExamples.getIBCTransferTxsExample,
    similes: ExplorerSimiles.getIBCTransferTxsSimiles,
    functionName: "getIBCTransferTxs",
    validateContent: () => true,
});
exports.GetExplorerStatsAction = (0, base_1.createGenericAction)({
    name: "GET_EXPLORER_STATS",
    description: "Fetches explorer statistics",
    template: ExplorerTemplates.getExplorerStatsTemplate,
    examples: ExplorerExamples.getExplorerStatsExample,
    similes: ExplorerSimiles.getExplorerStatsSimiles,
    functionName: "getExplorerStats",
    validateContent: () => true,
});
// Export all actions as a group
exports.ExplorerActions = [
    exports.GetTxByHashAction,
    exports.GetAccountTxAction,
    exports.GetExplorerValidatorAction,
    exports.GetValidatorUptimeAction,
    exports.GetPeggyDepositTxsAction,
    exports.GetPeggyWithdrawalTxsAction,
    exports.GetBlocksAction,
    exports.GetBlockAction,
    exports.GetTxsAction,
    exports.GetIBCTransferTxsAction,
    exports.GetExplorerStatsAction,
];
