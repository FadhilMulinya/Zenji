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
exports.DistributionActions = exports.MsgWithdrawValidatorCommissionAction = exports.MsgWithdrawDelegatorRewardAction = exports.GetDelegatorRewardsNoThrowAction = exports.GetDelegatorRewardsAction = exports.GetDelegatorRewardsForValidatorNoThrowAction = exports.GetDelegatorRewardsForValidatorAction = exports.GetDistributionModuleParamsAction = void 0;
const base_1 = require("./base");
const DistributionTemplates = __importStar(require("@injective/template/distribution"));
const DistributionExamples = __importStar(require("@injective/examples/distribution"));
const DistributionSimilies = __importStar(require("@injective/similes/distribution"));
exports.GetDistributionModuleParamsAction = (0, base_1.createGenericAction)({
    name: "GET_DISTRIBUTION_MODULE_PARAMS",
    description: "Fetches the distribution module parameters",
    template: DistributionTemplates.getDistributionModuleParamsTemplate,
    examples: DistributionExamples.getDistributionModuleParamsExample,
    similes: DistributionSimilies.getDistributionModuleParamsSimiles,
    functionName: "getDistributionModuleParams",
    validateContent: () => true,
});
exports.GetDelegatorRewardsForValidatorAction = (0, base_1.createGenericAction)({
    name: "GET_DELEGATOR_REWARDS_FOR_VALIDATOR",
    description: "Fetches the delegator rewards for a specific validator",
    template: DistributionTemplates.getDelegatorRewardsForValidatorTemplate,
    examples: DistributionExamples.getDelegatorRewardsForValidatorExample,
    similes: DistributionSimilies.getDelegatorRewardsForValidatorSimiles,
    functionName: "getDelegatorRewardsForValidator",
    validateContent: () => true,
});
exports.GetDelegatorRewardsForValidatorNoThrowAction = (0, base_1.createGenericAction)({
    name: "GET_DELEGATOR_REWARDS_FOR_VALIDATOR_NO_THROW",
    description: "Fetches the delegator rewards for a specific validator without throwing errors",
    template: DistributionTemplates.getDelegatorRewardsForValidatorNoThrowTemplate,
    examples: DistributionExamples.getDelegatorRewardsForValidatorNoThrowExample,
    similes: DistributionSimilies.getDelegatorRewardsForValidatorNoThrowSimiles,
    functionName: "getDelegatorRewardsForValidatorNoThrow",
    validateContent: () => true,
});
exports.GetDelegatorRewardsAction = (0, base_1.createGenericAction)({
    name: "GET_DELEGATOR_REWARDS",
    description: "Fetches the rewards for a delegator",
    template: DistributionTemplates.getDelegatorRewardsTemplate,
    examples: DistributionExamples.getDelegatorRewardsExample,
    similes: DistributionSimilies.getDelegatorRewardsSimiles,
    functionName: "getDelegatorRewards",
    validateContent: () => true,
});
exports.GetDelegatorRewardsNoThrowAction = (0, base_1.createGenericAction)({
    name: "GET_DELEGATOR_REWARDS_NO_THROW",
    description: "Fetches the rewards for a delegator without throwing errors",
    template: DistributionTemplates.getDelegatorRewardsNoThrowTemplate,
    examples: DistributionExamples.getDelegatorRewardsNoThrowExample,
    similes: DistributionSimilies.getDelegatorRewardsNoThrowSimiles,
    functionName: "getDelegatorRewardsNoThrow",
    validateContent: () => true,
});
exports.MsgWithdrawDelegatorRewardAction = (0, base_1.createGenericAction)({
    name: "MSG_WITHDRAW_DELEGATOR_REWARD",
    description: "Withdraws delegator rewards from a specific validator",
    template: DistributionTemplates.msgWithdrawDelegatorRewardTemplate,
    examples: DistributionExamples.msgWithdrawDelegatorRewardExample,
    similes: DistributionSimilies.msgWithdrawDelegatorRewardSimiles,
    functionName: "msgWithdrawDelegatorReward",
    validateContent: () => true,
});
exports.MsgWithdrawValidatorCommissionAction = (0, base_1.createGenericAction)({
    name: "MSG_WITHDRAW_VALIDATOR_COMMISSION",
    description: "Withdraws validator commission rewards",
    template: DistributionTemplates.msgWithdrawValidatorCommissionTemplate,
    examples: DistributionExamples.msgWithdrawValidatorCommissionExample,
    similes: DistributionSimilies.msgWithdrawValidatorCommissionSimiles,
    functionName: "msgWithdrawValidatorCommission",
    validateContent: () => true,
});
// Export all actions as a group
exports.DistributionActions = [
    exports.GetDistributionModuleParamsAction,
    exports.GetDelegatorRewardsForValidatorAction,
    exports.GetDelegatorRewardsForValidatorNoThrowAction,
    exports.GetDelegatorRewardsAction,
    exports.GetDelegatorRewardsNoThrowAction,
    exports.MsgWithdrawDelegatorRewardAction,
    exports.MsgWithdrawValidatorCommissionAction,
];
