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
exports.BankActions = exports.MsgMultiSendAction = exports.MsgSendAction = exports.GetDenomOwnersAction = exports.GetDenomMetadataAction = exports.GetDenomsMetadataAction = exports.GetSupplyOfAction = exports.GetAllTotalSupplyAction = exports.GetTotalSupplyAction = exports.GetBankBalancesAction = exports.GetBankBalanceAction = exports.GetBankModuleParamsAction = void 0;
const base_1 = require("./base");
const BankTemplates = __importStar(require("@injective/template/bank"));
const BankExamples = __importStar(require("@injective/examples/bank"));
const BankSimilies = __importStar(require("@injective/similes/bank"));
// Query Actions
exports.GetBankModuleParamsAction = (0, base_1.createGenericAction)({
    name: "GET_BANK_MODULE_PARAMS",
    description: "Fetches the bank module parameters",
    template: BankTemplates.getBankModuleParamsTemplate,
    examples: BankExamples.getBankModuleParamsExample,
    similes: BankSimilies.getBankModuleParamsSimiles,
    functionName: "getBankModuleParams",
    validateContent: () => true,
});
exports.GetBankBalanceAction = (0, base_1.createGenericAction)({
    name: "GET_BANK_BALANCE",
    description: "Fetches the balance of a specific account",
    template: BankTemplates.getBankBalanceTemplate,
    examples: BankExamples.getBankBalanceExample,
    similes: BankSimilies.getBankBalanceSimiles,
    functionName: "getBankBalance",
    validateContent: () => true,
});
exports.GetBankBalancesAction = (0, base_1.createGenericAction)({
    name: "GET_BANK_BALANCES",
    description: "Fetches all balances for the current account",
    template: BankTemplates.getBankBalancesTemplate,
    examples: BankExamples.getBankBalancesExample,
    similes: BankSimilies.getBankBalancesSimiles,
    functionName: "getBankBalances",
    validateContent: () => true,
});
exports.GetTotalSupplyAction = (0, base_1.createGenericAction)({
    name: "GET_TOTAL_SUPPLY",
    description: "Fetches the total supply of all denominations",
    template: BankTemplates.getTotalSupplyTemplate,
    examples: BankExamples.getTotalSupplyExample,
    similes: BankSimilies.getTotalSupplySimiles,
    functionName: "getTotalSupply",
    validateContent: () => true,
});
exports.GetAllTotalSupplyAction = (0, base_1.createGenericAction)({
    name: "GET_ALL_TOTAL_SUPPLY",
    description: "Fetches the total supply for all denominations",
    template: BankTemplates.getAllTotalSupplyTemplate,
    examples: BankExamples.getAllTotalSupplyExample,
    similes: BankSimilies.getAllTotalSupplySimiles,
    functionName: "getAllTotalSupply",
    validateContent: () => true,
});
exports.GetSupplyOfAction = (0, base_1.createGenericAction)({
    name: "GET_SUPPLY_OF",
    description: "Fetches the supply of a specific denomination",
    template: BankTemplates.getSupplyOfTemplate,
    examples: BankExamples.getSupplyOfExample,
    similes: BankSimilies.getSupplyOfSimiles,
    functionName: "getSupplyOf",
    validateContent: () => true,
});
exports.GetDenomsMetadataAction = (0, base_1.createGenericAction)({
    name: "GET_DENOMS_METADATA",
    description: "Fetches metadata for all denominations",
    template: BankTemplates.getDenomsMetadataTemplate,
    examples: BankExamples.getDenomsMetadataExample,
    similes: BankSimilies.getDenomMetadataSimiles,
    functionName: "getDenomsMetadata",
    validateContent: () => true,
});
exports.GetDenomMetadataAction = (0, base_1.createGenericAction)({
    name: "GET_DENOM_METADATA",
    description: "Fetches metadata for a specific denomination",
    template: BankTemplates.getDenomMetadataTemplate,
    examples: BankExamples.getDenomMetadataExample,
    similes: BankSimilies.getDenomMetadataSimiles,
    functionName: "getDenomMetadata",
    validateContent: () => true,
});
exports.GetDenomOwnersAction = (0, base_1.createGenericAction)({
    name: "GET_DENOM_OWNERS",
    description: "Fetches the owners of a specific denomination",
    template: BankTemplates.getDenomOwnersTemplate,
    examples: BankExamples.getDenomOwnersExample,
    similes: BankSimilies.getDenomOwnersSimiles,
    functionName: "getDenomOwners",
    validateContent: () => true,
});
// Transaction Actions
exports.MsgSendAction = (0, base_1.createGenericAction)({
    name: "MSG_SEND",
    description: "Sends tokens from one account to another",
    template: BankTemplates.msgSendTemplate,
    examples: BankExamples.msgSendExample,
    similes: BankSimilies.msgSendSimiles,
    functionName: "msgSend",
    validateContent: () => true,
});
exports.MsgMultiSendAction = (0, base_1.createGenericAction)({
    name: "MSG_MULTI_SEND",
    description: "Sends tokens from multiple senders to multiple receivers",
    template: BankTemplates.msgMultiSendTemplate,
    examples: BankExamples.msgMultiSendExample,
    similes: BankSimilies.msgMultiSendSimiles,
    functionName: "msgMultiSend",
    validateContent: () => true,
});
exports.BankActions = [
    exports.GetBankModuleParamsAction,
    exports.GetBankBalanceAction,
    exports.GetBankBalancesAction,
    exports.GetTotalSupplyAction,
    exports.GetAllTotalSupplyAction,
    exports.GetSupplyOfAction,
    exports.GetDenomsMetadataAction,
    exports.GetDenomMetadataAction,
    exports.GetDenomOwnersAction,
    exports.MsgSendAction,
    exports.MsgMultiSendAction,
];
