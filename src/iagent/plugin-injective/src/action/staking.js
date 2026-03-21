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
exports.StakingActions = exports.MsgCancelUnbondingDelegationAction = exports.MsgEditValidatorAction = exports.MsgCreateValidatorAction = exports.MsgUndelegateAction = exports.MsgDelegateAction = exports.MsgBeginRedelegateAction = exports.GetReDelegationsNoThrowAction = exports.GetReDelegationsAction = exports.GetUnbondingDelegationsNoThrowAction = exports.GetUnbondingDelegationsAction = exports.GetDelegatorsNoThrowAction = exports.GetDelegatorsAction = exports.GetDelegationsNoThrowAction = exports.GetDelegationsAction = exports.GetDelegationAction = exports.GetValidatorUnbondingDelegationsNoThrowAction = exports.GetValidatorUnbondingDelegationsAction = exports.GetValidatorDelegationsNoThrowAction = exports.GetValidatorDelegationsAction = exports.GetValidatorAction = exports.GetValidatorsAction = exports.GetPoolAction = exports.GetStakingModuleParamsAction = void 0;
const base_1 = require("./base");
const StakingTemplates = __importStar(require("@injective/template/staking"));
const StakingExamples = __importStar(require("@injective/examples/staking"));
const StakingSimiles = __importStar(require("@injective/similes/staking"));
// Module and Pool Query Actions
exports.GetStakingModuleParamsAction = (0, base_1.createGenericAction)({
    name: "GET_STAKING_MODULE_PARAMS",
    description: "Fetches the staking module parameters",
    template: StakingTemplates.getStakingModuleParamsTemplate,
    examples: StakingExamples.getStakingModuleParamsExample,
    similes: StakingSimiles.getStakingModuleParamsSimiles,
    functionName: "getStakingModuleParams",
    validateContent: () => true,
});
exports.GetPoolAction = (0, base_1.createGenericAction)({
    name: "GET_POOL",
    description: "Fetches the staking pool information",
    template: StakingTemplates.getPoolTemplate,
    examples: StakingExamples.getPoolExample,
    similes: StakingSimiles.getPoolSimiles,
    functionName: "getPool",
    validateContent: () => true,
});
// Validator Query Actions
exports.GetValidatorsAction = (0, base_1.createGenericAction)({
    name: "GET_VALIDATORS",
    description: "Fetches a list of validators with optional pagination",
    template: StakingTemplates.getValidatorsTemplate,
    examples: StakingExamples.getValidatorsExample,
    similes: StakingSimiles.getValidatorSimiles,
    functionName: "getValidators",
    validateContent: () => true,
});
exports.GetValidatorAction = (0, base_1.createGenericAction)({
    name: "GET_VALIDATOR",
    description: "Fetches a specific validator by address",
    template: StakingTemplates.getValidatorTemplate,
    examples: StakingExamples.getValidatorExample,
    similes: StakingSimiles.getValidatorSimiles,
    functionName: "getValidator",
    validateContent: () => true,
});
// Delegation Query Actions
exports.GetValidatorDelegationsAction = (0, base_1.createGenericAction)({
    name: "GET_VALIDATOR_DELEGATIONS",
    description: "Fetches delegations for a specific validator",
    template: StakingTemplates.getValidatorDelegationsTemplate,
    examples: StakingExamples.getValidatorDelegationsExample,
    similes: StakingSimiles.getValidatorDelegationsSimiles,
    functionName: "getValidatorDelegations",
    validateContent: () => true,
});
exports.GetValidatorDelegationsNoThrowAction = (0, base_1.createGenericAction)({
    name: "GET_VALIDATOR_DELEGATIONS_NO_THROW",
    description: "Fetches delegations for a specific validator without throwing an error",
    template: StakingTemplates.getValidatorDelegationsNoThrowTemplate,
    examples: StakingExamples.getValidatorDelegationsNoThrowExample,
    similes: StakingSimiles.getValidatorDelegationsNoThrowSimiles,
    functionName: "getValidatorDelegationsNoThrow",
    validateContent: () => true,
});
exports.GetValidatorUnbondingDelegationsAction = (0, base_1.createGenericAction)({
    name: "GET_VALIDATOR_UNBONDING_DELEGATIONS",
    description: "Fetches unbonding delegations for a specific validator",
    template: StakingTemplates.getValidatorUnbondingDelegationsTemplate,
    examples: StakingExamples.getValidatorUnbondingDelegationsExample,
    similes: StakingSimiles.getValidatorUnbondingDelegationsSimiles,
    functionName: "getValidatorUnbondingDelegations",
    validateContent: () => true,
});
exports.GetValidatorUnbondingDelegationsNoThrowAction = (0, base_1.createGenericAction)({
    name: "GET_VALIDATOR_UNBONDING_DELEGATIONS_NO_THROW",
    description: "Fetches unbonding delegations for a specific validator without throwing an error",
    template: StakingTemplates.getValidatorUnbondingDelegationsNoThrowTemplate,
    examples: StakingExamples.getValidatorUnbondingDelegationsNoThrowExample,
    similes: StakingSimiles.getValidatorDelegationsNoThrowSimiles,
    functionName: "getValidatorUnbondingDelegationsNoThrow",
    validateContent: () => true,
});
exports.GetDelegationAction = (0, base_1.createGenericAction)({
    name: "GET_DELEGATION",
    description: "Fetches a specific delegation",
    template: StakingTemplates.getDelegationTemplate,
    examples: StakingExamples.getDelegationExample,
    similes: StakingSimiles.getDelegationSimiles,
    functionName: "getDelegation",
    validateContent: () => true,
});
exports.GetDelegationsAction = (0, base_1.createGenericAction)({
    name: "GET_DELEGATIONS",
    description: "Fetches all delegations for a delegator",
    template: StakingTemplates.getDelegationsTemplate,
    examples: StakingExamples.getDelegationsExample,
    similes: StakingSimiles.getDelegationsSimiles,
    functionName: "getDelegations",
    validateContent: () => true,
});
exports.GetDelegationsNoThrowAction = (0, base_1.createGenericAction)({
    name: "GET_DELEGATIONS_NO_THROW",
    description: "Fetches all delegations for a delegator without throwing an error",
    template: StakingTemplates.getDelegationsNoThrowTemplate,
    examples: StakingExamples.getDelegationsNoThrowExample,
    similes: StakingSimiles.getDelegationsNoThrowSimiles,
    functionName: "getDelegationsNoThrow",
    validateContent: () => true,
});
exports.GetDelegatorsAction = (0, base_1.createGenericAction)({
    name: "GET_DELEGATORS",
    description: "Fetches all delegators for a validator",
    template: StakingTemplates.getDelegatorsTemplate,
    examples: StakingExamples.getDelegatorsExample,
    similes: StakingSimiles.getDelegatorsSimiles,
    functionName: "getDelegators",
    validateContent: () => true,
});
exports.GetDelegatorsNoThrowAction = (0, base_1.createGenericAction)({
    name: "GET_DELEGATORS_NO_THROW",
    description: "Fetches all delegators for a validator without throwing an error",
    template: StakingTemplates.getDelegatorsNoThrowTemplate,
    examples: StakingExamples.getDelegatorsNoThrowExample,
    similes: StakingSimiles.getDelegatorsNoThrowSimiles,
    functionName: "getDelegatorsNoThrow",
    validateContent: () => true,
});
exports.GetUnbondingDelegationsAction = (0, base_1.createGenericAction)({
    name: "GET_UNBONDING_DELEGATIONS",
    description: "Fetches all unbonding delegations for a delegator",
    template: StakingTemplates.getUnbondingDelegationsTemplate,
    examples: StakingExamples.getUnbondingDelegationsExample,
    similes: StakingSimiles.getUnbondingDelegationsSimiles,
    functionName: "getUnbondingDelegations",
    validateContent: () => true,
});
exports.GetUnbondingDelegationsNoThrowAction = (0, base_1.createGenericAction)({
    name: "GET_UNBONDING_DELEGATIONS_NO_THROW",
    description: "Fetches all unbonding delegations for a delegator without throwing an error",
    template: StakingTemplates.getUnbondingDelegationsNoThrowTemplate,
    examples: StakingExamples.getUnbondingDelegationsNoThrowExample,
    similes: StakingSimiles.getUnbondingDelegationsNoThrowSimiles,
    functionName: "getUnbondingDelegationsNoThrow",
    validateContent: () => true,
});
exports.GetReDelegationsAction = (0, base_1.createGenericAction)({
    name: "GET_REDELEGATIONS",
    description: "Fetches all redelegations for a delegator",
    template: StakingTemplates.getReDelegationsTemplate,
    examples: StakingExamples.getReDelegationsExample,
    similes: StakingSimiles.getReDelegationsSimiles,
    functionName: "getReDelegations",
    validateContent: () => true,
});
exports.GetReDelegationsNoThrowAction = (0, base_1.createGenericAction)({
    name: "GET_REDELEGATIONS_NO_THROW",
    description: "Fetches all redelegations for a delegator without throwing an error",
    template: StakingTemplates.getReDelegationsNoThrowTemplate,
    examples: StakingExamples.getReDelegationsNoThrowExample,
    similes: StakingSimiles.getReDelegationsNoThrowSimiles,
    functionName: "getReDelegationsNoThrow",
    validateContent: () => true,
});
// Message Actions
exports.MsgBeginRedelegateAction = (0, base_1.createGenericAction)({
    name: "MSG_BEGIN_REDELEGATE",
    description: "Broadcasts a message to begin redelegating tokens",
    template: StakingTemplates.msgBeginRedelegateTemplate,
    examples: StakingExamples.msgBeginRedelegateExample,
    similes: StakingSimiles.msgBeginRedelegateSimiles,
    functionName: "msgBeginRedelegate",
    validateContent: () => true,
});
exports.MsgDelegateAction = (0, base_1.createGenericAction)({
    name: "MSG_DELEGATE",
    description: "Broadcasts a message to delegate tokens to a validator",
    template: StakingTemplates.msgDelegateTemplate,
    examples: StakingExamples.msgDelegateExample,
    similes: StakingSimiles.msgDelegateSimiles,
    functionName: "msgDelegate",
    validateContent: () => true,
});
exports.MsgUndelegateAction = (0, base_1.createGenericAction)({
    name: "MSG_UNDELEGATE",
    description: "Broadcasts a message to undelegate tokens from a validator",
    template: StakingTemplates.msgUndelegateTemplate,
    examples: StakingExamples.msgUndelegateExample,
    similes: StakingSimiles.msgUndelegateSimiles,
    functionName: "msgUndelegate",
    validateContent: () => true,
});
exports.MsgCreateValidatorAction = (0, base_1.createGenericAction)({
    name: "MSG_CREATE_VALIDATOR",
    description: "Broadcasts a message to create a new validator",
    template: StakingTemplates.msgCreateValidatorTemplate,
    examples: StakingExamples.msgCreateValidatorExample,
    similes: StakingSimiles.msgCreateValidatorSimiles,
    functionName: "msgCreateValidator",
    validateContent: () => true,
});
exports.MsgEditValidatorAction = (0, base_1.createGenericAction)({
    name: "MSG_EDIT_VALIDATOR",
    description: "Broadcasts a message to edit an existing validator",
    template: StakingTemplates.msgEditValidatorTemplate,
    examples: StakingExamples.msgEditValidatorExample,
    similes: StakingSimiles.msgEditValidatorSimiles,
    functionName: "msgEditValidator",
    validateContent: () => true,
});
exports.MsgCancelUnbondingDelegationAction = (0, base_1.createGenericAction)({
    name: "MSG_CANCEL_UNBONDING_DELEGATION",
    description: "Broadcasts a message to cancel an unbonding delegation",
    template: StakingTemplates.msgCancelUnbondingDelegationTemplate,
    examples: StakingExamples.msgCancelUnbondingDelegationExample,
    similes: StakingSimiles.msgCancelUnbondingDelegationSimiles,
    functionName: "msgCancelUnbondingDelegation",
    validateContent: () => true,
});
// Export all actions as a group
exports.StakingActions = [
    // Module and Pool Actions
    exports.GetStakingModuleParamsAction,
    exports.GetPoolAction,
    // Validator Actions
    exports.GetValidatorsAction,
    exports.GetValidatorAction,
    // Delegation Query Actions
    exports.GetValidatorDelegationsAction,
    exports.GetValidatorDelegationsNoThrowAction,
    exports.GetValidatorUnbondingDelegationsAction,
    exports.GetValidatorUnbondingDelegationsNoThrowAction,
    exports.GetDelegationAction,
    exports.GetDelegationsAction,
    exports.GetDelegationsNoThrowAction,
    exports.GetDelegatorsAction,
    exports.GetDelegatorsNoThrowAction,
    exports.GetUnbondingDelegationsAction,
    exports.GetUnbondingDelegationsNoThrowAction,
    exports.GetReDelegationsAction,
    exports.GetReDelegationsNoThrowAction,
    // Message Actions
    exports.MsgBeginRedelegateAction,
    exports.MsgDelegateAction,
    exports.MsgUndelegateAction,
    exports.MsgCreateValidatorAction,
    exports.MsgEditValidatorAction,
    exports.MsgCancelUnbondingDelegationAction,
];
