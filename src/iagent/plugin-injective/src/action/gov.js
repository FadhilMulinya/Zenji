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
exports.GovActions = exports.MsgGovDepositAction = exports.MsgSubmitGenericProposalAction = exports.MsgSubmitProposalSpotMarketParamUpdateAction = exports.MsgSubmitTextProposalAction = exports.MsgVoteAction = exports.MsgSubmitProposalPerpetualMarketLaunchAction = exports.MsgSubmitProposalSpotMarketLaunchAction = exports.MsgSubmitProposalExpiryFuturesMarketLaunchAction = exports.GetProposalTallyAction = exports.GetProposalVotesAction = exports.GetProposalDepositsAction = exports.GetProposalAction = exports.GetProposalsAction = exports.GetGovernanceModuleParamsAction = void 0;
// src/actions/governance/governance-actions.ts
const base_1 = require("./base");
const GovTemplates = __importStar(require("@injective/template/gov"));
const GovExamples = __importStar(require("@injective/examples/gov"));
const GovSimiles = __importStar(require("@injective/similes/gov"));
exports.GetGovernanceModuleParamsAction = (0, base_1.createGenericAction)({
    name: "GET_GOVERNANCE_MODULE_PARAMS",
    description: "Fetches the governance module parameters",
    template: GovTemplates.getGovernanceModuleParamsTemplate,
    examples: GovExamples.getGovernanceModuleParamsExample,
    functionName: "getGovernanceModuleParams",
    similes: GovSimiles.getGovernanceModuleParamsSimiles,
    validateContent: () => true,
});
exports.GetProposalsAction = (0, base_1.createGenericAction)({
    name: "GET_PROPOSALS",
    description: "Fetches a list of proposals based on provided parameters",
    template: GovTemplates.getProposalsTemplate,
    examples: GovExamples.getProposalsExample,
    functionName: "getProposals",
    similes: GovSimiles.getProposalsSimiles,
    validateContent: () => true,
});
exports.GetProposalAction = (0, base_1.createGenericAction)({
    name: "GET_PROPOSAL",
    description: "Fetches details of a specific proposal by its ID",
    template: GovTemplates.getProposalTemplate,
    examples: GovExamples.getProposalExample,
    similes: GovSimiles.getProposalsSimiles,
    functionName: "getProposal",
    validateContent: () => true,
});
exports.GetProposalDepositsAction = (0, base_1.createGenericAction)({
    name: "GET_PROPOSAL_DEPOSITS",
    description: "Fetches deposits for a specific proposal",
    template: GovTemplates.getProposalDepositsTemplate,
    examples: GovExamples.getProposalDepositsExample,
    similes: GovSimiles.getProposalDepositsSimiles,
    functionName: "getProposalDeposits",
    validateContent: () => true,
});
exports.GetProposalVotesAction = (0, base_1.createGenericAction)({
    name: "GET_PROPOSAL_VOTES",
    description: "Fetches votes for a specific proposal",
    template: GovTemplates.getProposalVotesTemplate,
    examples: GovExamples.getProposalVotesExample,
    similes: GovSimiles.getProposalVotesSimiles,
    functionName: "getProposalVotes",
    validateContent: () => true,
});
exports.GetProposalTallyAction = (0, base_1.createGenericAction)({
    name: "GET_PROPOSAL_TALLY",
    description: "Fetches the tally results of a specific proposal",
    template: GovTemplates.getProposalTallyTemplate,
    examples: GovExamples.getProposalTallyExample,
    similes: GovSimiles.getProposalTallySimiles,
    functionName: "getProposalTally",
    validateContent: () => true,
});
// Message Actions
exports.MsgSubmitProposalExpiryFuturesMarketLaunchAction = (0, base_1.createGenericAction)({
    name: "MSG_SUBMIT_PROPOSAL_EXPIRY_FUTURES_MARKET_LAUNCH",
    description: "Submits a proposal to launch an expiry futures market",
    template: GovTemplates.msgSubmitProposalExpiryFuturesMarketLaunchTemplate,
    examples: GovExamples.msgSubmitProposalExpiryFuturesMarketLaunchExample,
    similes: GovSimiles.msgSubmitProposalExpiryFuturesMarketLaunchSimiles,
    functionName: "msgSubmitProposalExpiryFuturesMarketLaunch",
    validateContent: () => true,
});
exports.MsgSubmitProposalSpotMarketLaunchAction = (0, base_1.createGenericAction)({
    name: "MSG_SUBMIT_PROPOSAL_SPOT_MARKET_LAUNCH",
    description: "Submits a proposal to launch a spot market",
    template: GovTemplates.msgSubmitProposalSpotMarketLaunchTemplate,
    examples: GovExamples.msgSubmitProposalSpotMarketLaunchExample,
    similes: GovSimiles.msgSubmitProposalSpotMarketLaunchSimiles,
    functionName: "msgSubmitProposalSpotMarketLaunch",
    validateContent: () => true,
});
exports.MsgSubmitProposalPerpetualMarketLaunchAction = (0, base_1.createGenericAction)({
    name: "MSG_SUBMIT_PROPOSAL_PERPETUAL_MARKET_LAUNCH",
    description: "Submits a proposal to launch a perpetual market",
    template: GovTemplates.msgSubmitProposalPerpetualMarketLaunchTemplate,
    examples: GovExamples.msgSubmitProposalPerpetualMarketLaunchExample,
    similes: GovSimiles.msgSubmitProposalPerpetualMarketLaunchSimiles,
    functionName: "msgSubmitProposalPerpetualMarketLaunch",
    validateContent: () => true,
});
exports.MsgVoteAction = (0, base_1.createGenericAction)({
    name: "MSG_VOTE",
    description: "Casts a vote on a specific proposal",
    template: GovTemplates.msgVoteTemplate,
    examples: GovExamples.msgVoteExample,
    similes: GovSimiles.msgVoteSimiles,
    functionName: "msgVote",
    validateContent: () => true,
});
exports.MsgSubmitTextProposalAction = (0, base_1.createGenericAction)({
    name: "MSG_SUBMIT_TEXT_PROPOSAL",
    description: "Submits a text-based proposal",
    template: GovTemplates.msgSubmitTextProposalTemplate,
    examples: GovExamples.msgSubmitTextProposalExample,
    similes: GovSimiles.msgSubmitTextProposalSimiles,
    functionName: "msgSubmitTextProposal",
    validateContent: () => true,
});
exports.MsgSubmitProposalSpotMarketParamUpdateAction = (0, base_1.createGenericAction)({
    name: "MSG_SUBMIT_PROPOSAL_SPOT_MARKET_PARAM_UPDATE",
    description: "Submits a proposal to update spot market parameters",
    template: GovTemplates.msgSubmitProposalSpotMarketParamUpdateTemplate,
    examples: GovExamples.msgSubmitProposalSpotMarketParamUpdateExample,
    similes: GovSimiles.msgSubmitProposalSpotMarketParamUpdateSimiles,
    functionName: "msgSubmitProposalSpotMarketParamUpdate",
    validateContent: () => true,
});
exports.MsgSubmitGenericProposalAction = (0, base_1.createGenericAction)({
    name: "MSG_SUBMIT_GENERIC_PROPOSAL",
    description: "Submits a generic proposal",
    template: GovTemplates.msgSubmitGenericProposalTemplate,
    examples: GovExamples.msgSubmitGenericProposalExample,
    similes: GovSimiles.msgSubmitGenericProposalSimiles,
    functionName: "msgSubmitGenericProposal",
    validateContent: () => true,
});
exports.MsgGovDepositAction = (0, base_1.createGenericAction)({
    name: "MSG_GOV_DEPOSIT",
    description: "Deposits tokens to a specific proposal",
    similes: GovSimiles.msgGovDepositSimiles,
    template: GovTemplates.msgGovDepositTemplate,
    examples: GovExamples.msgGovDepositExample,
    functionName: "msgGovDeposit",
    validateContent: () => true,
});
// Export all actions as a group
exports.GovActions = [
    exports.GetGovernanceModuleParamsAction,
    exports.GetProposalsAction,
    exports.GetProposalAction,
    exports.GetProposalDepositsAction,
    exports.GetProposalVotesAction,
    exports.GetProposalTallyAction,
    exports.MsgSubmitProposalExpiryFuturesMarketLaunchAction,
    exports.MsgSubmitProposalSpotMarketLaunchAction,
    exports.MsgSubmitProposalPerpetualMarketLaunchAction,
    exports.MsgVoteAction,
    exports.MsgSubmitTextProposalAction,
    exports.MsgSubmitProposalSpotMarketParamUpdateAction,
    exports.MsgSubmitGenericProposalAction,
    exports.MsgGovDepositAction,
];
