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
exports.InsuranceActions = exports.MsgUnderwriteAction = exports.MsgRequestRedemptionAction = exports.MsgCreateInsuranceFundAction = exports.GetPendingRedemptionsAction = exports.GetEstimatedRedemptionsAction = exports.GetInsuranceFundAction = exports.GetInsuranceFundsAction = exports.GetInsuranceModuleParamsAction = void 0;
const base_1 = require("./base");
const InsuranceTemplates = __importStar(require("@injective/template/insurance"));
const InsuranceExamples = __importStar(require("@injective/examples/insurance"));
const InsuranceSimiles = __importStar(require("@injective/similes/insurance"));
// Query Actions
exports.GetInsuranceModuleParamsAction = (0, base_1.createGenericAction)({
    name: "GET_INSURANCE_MODULE_PARAMS",
    description: "Fetches the insurance module parameters",
    template: InsuranceTemplates.getInsuranceModuleParamsTemplate,
    examples: InsuranceExamples.getInsuranceModuleParamsExample,
    similes: InsuranceSimiles.getInsuranceModuleParamsSimiles,
    functionName: "getInsuranceModuleParams",
    validateContent: () => true,
});
exports.GetInsuranceFundsAction = (0, base_1.createGenericAction)({
    name: "GET_INSURANCE_FUNDS",
    description: "Fetches a list of all insurance funds",
    template: InsuranceTemplates.getInsuranceFundsTemplate,
    examples: InsuranceExamples.getInsuranceFundsExample,
    similes: InsuranceSimiles.getInsuranceFundsSimiles,
    functionName: "getInsuranceFunds",
    validateContent: () => true,
});
exports.GetInsuranceFundAction = (0, base_1.createGenericAction)({
    name: "GET_INSURANCE_FUND",
    description: "Fetches details of a specific insurance fund by its market ID",
    template: InsuranceTemplates.getInsuranceFundTemplate,
    examples: InsuranceExamples.getInsuranceFundExample,
    similes: InsuranceSimiles.getInsuranceFundSimiles,
    functionName: "getInsuranceFund",
    validateContent: () => true,
});
exports.GetEstimatedRedemptionsAction = (0, base_1.createGenericAction)({
    name: "GET_ESTIMATED_REDEMPTIONS",
    description: "Fetches estimated redemptions based on provided parameters",
    template: InsuranceTemplates.getEstimatedRedemptionsTemplate,
    examples: InsuranceExamples.getEstimatedRedemptionsExample,
    similes: InsuranceSimiles.getEstimatedRedemptionsSimiles,
    functionName: "getEstimatedRedemptions",
    validateContent: () => true,
});
exports.GetPendingRedemptionsAction = (0, base_1.createGenericAction)({
    name: "GET_PENDING_REDEMPTIONS",
    description: "Fetches pending redemptions based on provided parameters",
    template: InsuranceTemplates.getPendingRedemptionsTemplate,
    examples: InsuranceExamples.getPendingRedemptionsExample,
    similes: InsuranceSimiles.getPendingRedemptionsSimiles,
    functionName: "getPendingRedemptions",
    validateContent: () => true,
});
// Message Actions
exports.MsgCreateInsuranceFundAction = (0, base_1.createGenericAction)({
    name: "MSG_CREATE_INSURANCE_FUND",
    description: "Broadcasts a message to create a new insurance fund",
    template: InsuranceTemplates.msgCreateInsuranceFundTemplate,
    examples: InsuranceExamples.msgCreateInsuranceFundExample,
    similes: InsuranceSimiles.msgCreateInsuranceFundSimiles,
    functionName: "msgCreateInsuranceFund",
    validateContent: () => true,
});
exports.MsgRequestRedemptionAction = (0, base_1.createGenericAction)({
    name: "MSG_REQUEST_REDEMPTION",
    description: "Broadcasts a message to request a redemption from an insurance fund",
    template: InsuranceTemplates.msgRequestRedemptionTemplate,
    examples: InsuranceExamples.msgRequestRedemptionExample,
    similes: InsuranceSimiles.msgRequestRedemptionSimiles,
    functionName: "msgRequestRedemption",
    validateContent: () => true,
});
exports.MsgUnderwriteAction = (0, base_1.createGenericAction)({
    name: "MSG_UNDERWRITE",
    description: "Broadcasts a message to underwrite an insurance fund",
    template: InsuranceTemplates.msgUnderwriteTemplate,
    examples: InsuranceExamples.msgUnderwriteExample,
    similes: InsuranceSimiles.msgUnderwriteSimiles,
    functionName: "msgUnderwrite",
    validateContent: () => true,
});
// Export all actions as a group
exports.InsuranceActions = [
    exports.GetInsuranceModuleParamsAction,
    exports.GetInsuranceFundsAction,
    exports.GetInsuranceFundAction,
    exports.GetEstimatedRedemptionsAction,
    exports.GetPendingRedemptionsAction,
    exports.MsgCreateInsuranceFundAction,
    exports.MsgRequestRedemptionAction,
    exports.MsgUnderwriteAction,
];
