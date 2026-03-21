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
exports.MitoActions = exports.GetClaimVaultRewardsAction = exports.GetUnstakeVaultLPAction = exports.GetStakeVaultLPAction = exports.GetRedeemFromVaultAction = exports.GetInstantiateCPMMVaultAction = exports.GetSubscribeVaultAction = exports.GetLaunchpadClaimAction = exports.GetLaunchpadSubscribeAction = exports.GetClaimReferencesAction = exports.GetIDOWhitelistAction = exports.GetIDOActivitiesAction = exports.GetIDOSubscriptionAction = exports.GetIDOSubscribersAction = exports.GetIDOsAction = exports.GetIDOAction = exports.GetMissionLeaderboardAction = exports.GetMissionsAction = exports.GetStakingRewardsByAccountAction = exports.GetStakingHistoryAction = exports.GetStakingPoolsAction = exports.GetTransferHistoryAction = exports.GetLeaderboardEpochsAction = exports.GetLeaderboardAction = exports.GetHolderPortfolioAction = exports.GetTVLChartAction = exports.GetLPHoldersAction = exports.GetLpTokenPriceChartAction = exports.GetVaultsByHolderAddressAction = exports.GetVaultsAction = exports.GetVaultAction = void 0;
const base_1 = require("./base");
const MitoTemplates = __importStar(require("@injective/template/mito"));
const MitoExamples = __importStar(require("@injective/examples/mito"));
const MitoSimiles = __importStar(require("@injective/similes/mito"));
// Vault Related Actions
exports.GetVaultAction = (0, base_1.createGenericAction)({
    name: "GET_VAULT",
    description: "Fetches the details of a specific vault",
    template: MitoTemplates.getVaultTemplate,
    examples: MitoExamples.getVaultExample,
    similes: MitoSimiles.getVaultSimiles,
    functionName: "getVault",
    validateContent: () => true,
});
exports.GetVaultsAction = (0, base_1.createGenericAction)({
    name: "GET_VAULTS",
    description: "Fetches a list of all vaults with optional filtering",
    template: MitoTemplates.getVaultsTemplate,
    examples: MitoExamples.getVaultsExample,
    similes: MitoSimiles.getVaultSimiles,
    functionName: "getVaults",
    validateContent: () => true,
});
exports.GetVaultsByHolderAddressAction = (0, base_1.createGenericAction)({
    name: "GET_VAULTS_BY_HOLDER_ADDRESS",
    description: "Fetches vaults associated with a specific holder address",
    template: MitoTemplates.getVaultsByHolderAddressTemplate,
    examples: MitoExamples.getVaultsByHolderAddressExample,
    similes: MitoSimiles.getVaultsByHolderAddressSimiles,
    functionName: "getVaultsByHolderAddress",
    validateContent: () => true,
});
// LP Token Related Actions
exports.GetLpTokenPriceChartAction = (0, base_1.createGenericAction)({
    name: "GET_LP_TOKEN_PRICE_CHART",
    description: "Retrieves the price chart data for LP tokens",
    template: MitoTemplates.getLpTokenPriceChartTemplate,
    examples: MitoExamples.getLpTokenPriceChartExample,
    similes: MitoSimiles.getLpTokenPriceChartSimiles,
    functionName: "getLpTokenPriceChart",
    validateContent: () => true,
});
exports.GetLPHoldersAction = (0, base_1.createGenericAction)({
    name: "GET_LP_HOLDERS",
    description: "Retrieves a list of LP token holders",
    template: MitoTemplates.getLPHoldersTemplate,
    examples: MitoExamples.getLPHoldersExample,
    similes: MitoSimiles.getLPHoldersSimiles,
    functionName: "getLPHolders",
    validateContent: () => true,
});
// TVL and Portfolio Actions
exports.GetTVLChartAction = (0, base_1.createGenericAction)({
    name: "GET_TVL_CHART",
    description: "Retrieves the Total Value Locked (TVL) chart data",
    template: MitoTemplates.getTVLChartTemplate,
    examples: MitoExamples.getTVLChartExample,
    similes: MitoSimiles.getTVLChartSimiles,
    functionName: "getTVLChart",
    validateContent: () => true,
});
exports.GetHolderPortfolioAction = (0, base_1.createGenericAction)({
    name: "GET_HOLDER_PORTFOLIO",
    description: "Retrieves the portfolio details of a specific holder",
    template: MitoTemplates.getHolderPortfolioTemplate,
    examples: MitoExamples.getHolderPortfolioExample,
    similes: MitoSimiles.getHolderPortfolioSimiles,
    functionName: "getHolderPortfolio",
    validateContent: () => true,
});
// Leaderboard Related Actions
exports.GetLeaderboardAction = (0, base_1.createGenericAction)({
    name: "GET_LEADERBOARD",
    description: "Retrieves the leaderboard for a specific epoch",
    template: MitoTemplates.getLeaderboardTemplate,
    examples: MitoExamples.getLeaderboardExample,
    similes: MitoSimiles.getLeaderboardSimiles,
    functionName: "getLeaderboard",
    validateContent: () => true,
});
exports.GetLeaderboardEpochsAction = (0, base_1.createGenericAction)({
    name: "GET_LEADERBOARD_EPOCHS",
    description: "Retrieves the epochs associated with leaderboards",
    template: MitoTemplates.getLeaderboardEpochsTemplate,
    examples: MitoExamples.getLeaderboardEpochsExample,
    similes: MitoSimiles.getLeaderboardEpochsSimiles,
    functionName: "getLeaderboardEpochs",
    validateContent: () => true,
});
// Transfer and History Actions
exports.GetTransferHistoryAction = (0, base_1.createGenericAction)({
    name: "GET_TRANSFER_HISTORY",
    description: "Fetches the transfer history based on provided parameters",
    template: MitoTemplates.getTransferHistoryTemplate,
    examples: MitoExamples.getTransferHistoryExample,
    similes: MitoSimiles.getTransferHistorySimiles,
    functionName: "getTransferHistory",
    validateContent: () => true,
});
// Staking Related Actions
exports.GetStakingPoolsAction = (0, base_1.createGenericAction)({
    name: "GET_STAKING_POOLS",
    description: "Retrieves information about staking pools",
    template: MitoTemplates.getStakingPoolsTemplate,
    examples: MitoExamples.getStakingPoolsExample,
    similes: MitoSimiles.getStakingPoolsSimiles,
    functionName: "getStakingPools",
    validateContent: () => true,
});
exports.GetStakingHistoryAction = (0, base_1.createGenericAction)({
    name: "GET_STAKING_HISTORY",
    description: "Retrieves the staking history based on provided parameters",
    template: MitoTemplates.getStakingHistoryTemplate,
    examples: MitoExamples.getStakingHistoryExample,
    similes: MitoSimiles.getStakingHistorySimiles,
    functionName: "getStakingHistory",
    validateContent: () => true,
});
exports.GetStakingRewardsByAccountAction = (0, base_1.createGenericAction)({
    name: "GET_STAKING_REWARDS_BY_ACCOUNT",
    description: "Retrieves staking rewards for a specific account",
    template: MitoTemplates.getStakingRewardsByAccountTemplate,
    examples: MitoExamples.getStakingRewardsByAccountExample,
    similes: MitoSimiles.getStakingRewardsByAccountSimiles,
    functionName: "getStakingRewardsByAccount",
    validateContent: () => true,
});
// Mission Related Actions
exports.GetMissionsAction = (0, base_1.createGenericAction)({
    name: "GET_MISSIONS",
    description: "Fetches a list of missions based on provided parameters",
    template: MitoTemplates.getMissionsTemplate,
    examples: MitoExamples.getMissionsExample,
    similes: MitoSimiles.getMissionsSimiles,
    functionName: "getMissions",
    validateContent: () => true,
});
exports.GetMissionLeaderboardAction = (0, base_1.createGenericAction)({
    name: "GET_MISSION_LEADERBOARD",
    description: "Retrieves the leaderboard for missions based on the user address",
    template: MitoTemplates.getMissionLeaderboardTemplate,
    examples: MitoExamples.getMissionLeaderboardExample,
    similes: MitoSimiles.getMissionLeaderboardSimiles,
    functionName: "getMissionLeaderboard",
    validateContent: () => true,
});
// IDO Related Actions
exports.GetIDOAction = (0, base_1.createGenericAction)({
    name: "GET_IDO",
    description: "Fetches details of a specific Initial DEX Offering (IDO)",
    template: MitoTemplates.getIDOTemplate,
    examples: MitoExamples.getIDOExample,
    similes: MitoSimiles.getIDOSimiles,
    functionName: "getIDO",
    validateContent: () => true,
});
exports.GetIDOsAction = (0, base_1.createGenericAction)({
    name: "GET_IDOS",
    description: "Retrieves a list of all IDOs with optional filtering",
    template: MitoTemplates.getIDOsTemplate,
    examples: MitoExamples.getIDOsExample,
    similes: MitoSimiles.getIDOsSimiles,
    functionName: "getIDOs",
    validateContent: () => true,
});
exports.GetIDOSubscribersAction = (0, base_1.createGenericAction)({
    name: "GET_IDO_SUBSCRIBERS",
    description: "Fetches subscribers for a specific IDO",
    template: MitoTemplates.getIDOSubscribersTemplate,
    examples: MitoExamples.getIDOSubscribersExample,
    similes: MitoSimiles.getIDOSubscribersSimiles,
    functionName: "getIDOSubscribers",
    validateContent: () => true,
});
exports.GetIDOSubscriptionAction = (0, base_1.createGenericAction)({
    name: "GET_IDO_SUBSCRIPTION",
    description: "Retrieves the subscription details for a specific IDO",
    template: MitoTemplates.getIDOSubscriptionTemplate,
    examples: MitoExamples.getIDOSubscriptionExample,
    similes: MitoSimiles.getIDOSubscriptionSimiles,
    functionName: "getIDOSubscription",
    validateContent: () => true,
});
exports.GetIDOActivitiesAction = (0, base_1.createGenericAction)({
    name: "GET_IDO_ACTIVITIES",
    description: "Retrieves activities related to a specific IDO",
    template: MitoTemplates.getIDOActivitiesTemplate,
    examples: MitoExamples.getIDOActivitiesExample,
    similes: MitoSimiles.getIDOActivitiesSimiles,
    functionName: "getIDOActivities",
    validateContent: () => true,
});
exports.GetIDOWhitelistAction = (0, base_1.createGenericAction)({
    name: "GET_IDO_WHITELIST",
    description: "Fetches the whitelist for a specific IDO",
    template: MitoTemplates.getIDOWhitelistTemplate,
    examples: MitoExamples.getIDOWhitelistExample,
    similes: MitoSimiles.getIDOWhitelistSimiles,
    functionName: "getIDOWhitelist",
    validateContent: () => true,
});
exports.GetClaimReferencesAction = (0, base_1.createGenericAction)({
    name: "GET_CLAIM_REFERENCES",
    description: "Retrieves claim references based on provided parameters",
    template: MitoTemplates.getClaimReferencesTemplate,
    examples: MitoExamples.getClaimReferencesExample,
    similes: MitoSimiles.getClaimReferencesSimiles,
    functionName: "getClaimReferences",
    validateContent: () => true,
});
exports.GetLaunchpadSubscribeAction = (0, base_1.createGenericAction)({
    name: "GET_LAUNCHPAD_SUBSCRIBE",
    description: "Subscribes to a launchpad offering",
    template: MitoTemplates.getLaunchpadSubscribeTemplate,
    examples: MitoExamples.getLaunchpadSubscribeExample,
    similes: MitoSimiles.getLaunchpadSubscribeSimiles,
    functionName: "getLaunchpadSubscribe",
    validateContent: () => true,
});
exports.GetLaunchpadClaimAction = (0, base_1.createGenericAction)({
    name: "GET_LAUNCHPAD_CLAIM",
    description: "Claims tokens from a launchpad offering",
    template: MitoTemplates.getLaunchpadClaimTemplate,
    examples: MitoExamples.getLaunchpadClaimExample,
    similes: MitoSimiles.getLaunchpadClaimSimiles,
    functionName: "getLaunchpadClaim",
    validateContent: () => true,
});
// Vault Related Actions
exports.GetSubscribeVaultAction = (0, base_1.createGenericAction)({
    name: "GET_SUBSCRIBE_VAULT",
    description: "Subscribes to a specific vault",
    template: MitoTemplates.getSubscribeVaultTemplate,
    examples: MitoExamples.getSubscribeVaultExample,
    similes: MitoSimiles.getSubscribeVaultSimiles,
    functionName: "getSubscribeVault",
    validateContent: () => true,
});
exports.GetInstantiateCPMMVaultAction = (0, base_1.createGenericAction)({
    name: "GET_INSTANTIATE_CPMM_VAULT",
    description: "Creates a new CPMM vault instance",
    template: MitoTemplates.getInstantiateCPMMVaultTemplate,
    examples: MitoExamples.getInstantiateCPMMVaultExample,
    similes: MitoSimiles.getInstantiateCPMMVaultSimiles,
    functionName: "getInstantiateCPMMVault",
    validateContent: () => true,
});
exports.GetRedeemFromVaultAction = (0, base_1.createGenericAction)({
    name: "GET_REDEEM_FROM_VAULT",
    description: "Redeems tokens from a specific vault",
    template: MitoTemplates.getRedeemFromVaultTemplate,
    examples: MitoExamples.getRedeemFromVaultExample,
    similes: MitoSimiles.getRedeemFromVaultSimiles,
    functionName: "getRedeemFromVault",
    validateContent: () => true,
});
exports.GetStakeVaultLPAction = (0, base_1.createGenericAction)({
    name: "GET_STAKE_VAULT_LP",
    description: "Stakes LP tokens in a vault",
    template: MitoTemplates.getStakeVaultLPTemplate,
    examples: MitoExamples.getStakeVaultLPExample,
    similes: MitoSimiles.getStakeVaultLPSimiles,
    functionName: "getStakeVaultLP",
    validateContent: () => true,
});
exports.GetUnstakeVaultLPAction = (0, base_1.createGenericAction)({
    name: "GET_UNSTAKE_VAULT_LP",
    description: "Unstakes LP tokens from a vault",
    template: MitoTemplates.getUnstakeVaultLPTemplate,
    examples: MitoExamples.getUnstakeVaultLPExample,
    similes: MitoSimiles.getUnstakeVaultLPSimiles,
    functionName: "getUnstakeVaultLP",
    validateContent: () => true,
});
exports.GetClaimVaultRewardsAction = (0, base_1.createGenericAction)({
    name: "GET_CLAIM_VAULT_REWARDS",
    description: "Claims rewards from a vault",
    template: MitoTemplates.getClaimVaultRewardsTemplate,
    examples: MitoExamples.getClaimVaultRewardsExample,
    similes: MitoSimiles.getClaimVaultRewardsSimiles,
    functionName: "getClaimVaultRewards",
    validateContent: () => true,
});
// Export all actions as a group
exports.MitoActions = [
    exports.GetVaultAction,
    exports.GetVaultsAction,
    exports.GetVaultsByHolderAddressAction,
    exports.GetLpTokenPriceChartAction,
    exports.GetLPHoldersAction,
    exports.GetTVLChartAction,
    exports.GetHolderPortfolioAction,
    exports.GetLeaderboardAction,
    exports.GetLeaderboardEpochsAction,
    exports.GetTransferHistoryAction,
    exports.GetStakingPoolsAction,
    exports.GetStakingHistoryAction,
    exports.GetStakingRewardsByAccountAction,
    exports.GetMissionsAction,
    exports.GetMissionLeaderboardAction,
    exports.GetIDOAction,
    exports.GetIDOsAction,
    exports.GetIDOSubscribersAction,
    exports.GetIDOSubscriptionAction,
    exports.GetIDOActivitiesAction,
    exports.GetIDOWhitelistAction,
    exports.GetClaimReferencesAction,
    exports.GetLaunchpadSubscribeAction,
    exports.GetLaunchpadClaimAction,
    exports.GetSubscribeVaultAction,
    exports.GetInstantiateCPMMVaultAction,
    exports.GetRedeemFromVaultAction,
    exports.GetStakeVaultLPAction,
    exports.GetUnstakeVaultLPAction,
    exports.GetClaimVaultRewardsAction,
];
