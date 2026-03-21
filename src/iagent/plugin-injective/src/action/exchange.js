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
exports.MsgBatchUpdateOrdersAction = exports.MsgBatchCancelSpotOrdersAction = exports.MsgBatchCancelDerivativeOrdersAction = exports.MsgBatchCancelBinaryOptionsOrdersAction = exports.GetDenomHoldersAction = exports.GetVolLeaderboardFixedResolutionAction = exports.GetPnlLeaderboardFixedResolutionAction = exports.GetVolLeaderboardAction = exports.GetPnlLeaderboardAction = exports.GetHistoricalVolumesAction = exports.GetHistoricalRpnlAction = exports.GetHistoricalBalanceAction = exports.GetGridStrategiesAction = exports.GetAtomicSwapHistoryAction = exports.GetRewardsAction = exports.GetIsOptedOutOfRewardsAction = exports.GetAccountPortfolioBalancesAction = exports.GetAccountPortfolioAction = exports.GetOrderStatesAction = exports.GetSubaccountOrderSummaryAction = exports.GetSubaccountHistoryAction = exports.GetSubaccountBalancesListAction = exports.GetSubaccountsListAction = exports.GetSubaccountTradeNonceAction = exports.GetFundingRatesAction = exports.GetFundingPaymentsAction = exports.GetPositionsV2Action = exports.GetExchangePositionsAction = exports.GetBinaryOptionsMarketAction = exports.GetBinaryOptionsMarketsAction = exports.GetDerivativeTradesAction = exports.GetDerivativeOrderHistoryAction = exports.GetDerivativeOrdersAction = exports.GetDerivativeMarketAction = exports.GetDerivativeMarketsAction = exports.GetSpotOrderbookAction = exports.GetSpotOrderbooksAction = exports.GetDerivativeOrderbookAction = exports.GetDerivativeOrderbooksAction = exports.GetSpotTradesAction = exports.GetSpotOrderHistoryAction = exports.GetSpotOrdersAction = exports.GetSpotMarketAction = exports.GetSpotMarketsAction = exports.GetPendingTradeRewardPointsAction = exports.GetTradeRewardPointsAction = exports.GetTradingRewardsCampaignAction = exports.GetFeeDiscountAccountInfoAction = exports.GetFeeDiscountScheduleAction = exports.GetModuleParamsAction = void 0;
exports.ExchangeActions = exports.MsgAdminUpdateBinaryOptionsMarketAction = exports.MsgExternalTransferAction = exports.MsgSignDataAction = exports.MsgRewardsOptOutAction = exports.MsgReclaimLockedFundsAction = exports.MsgLiquidatePositionAction = exports.MsgInstantSpotMarketLaunchAction = exports.MsgIncreasePositionMarginAction = exports.MsgWithdrawAction = exports.MsgDepositAction = exports.MsgCreateSpotMarketOrderAction = exports.MsgCreateSpotLimitOrderAction = exports.MsgCreateDerivativeMarketOrderAction = exports.MsgCreateDerivativeLimitOrderAction = exports.MsgCreateBinaryOptionsMarketOrderAction = exports.MsgCreateBinaryOptionsLimitOrderAction = exports.MsgCancelSpotOrderAction = exports.MsgCancelDerivativeOrderAction = exports.MsgCancelBinaryOptionsOrderAction = void 0;
const base_1 = require("./base");
const ExchangeTemplates = __importStar(require("@injective/template/exchange"));
const ExchangeExamples = __importStar(require("@injective/examples/exchange"));
const ExchangeSimiles = __importStar(require("@injective/similes/exchange"));
// Module Parameters and State Actions
exports.GetModuleParamsAction = (0, base_1.createGenericAction)({
    name: "GET_MODULE_PARAMS",
    description: "Fetches the exchange module parameters",
    template: ExchangeTemplates.getModuleParamsTemplate,
    examples: ExchangeExamples.getModuleParamsExample,
    similes: ExchangeSimiles.getModuleParamsSimiles,
    functionName: "getModuleParams",
    validateContent: () => true,
});
// Dont query exchange module state lmao
// export const GetModuleStateAction = createGenericAction({
//     name: "GET_MODULE_STATE",
//     description: "Fetches the current state of the exchange module",
//     template: ExchangeTemplates.getModuleStateTemplate,
//     examples: ExchangeExamples.getModuleStateExample,
//     functionName: "getModuleState",
//     similes: ExchangeSimiles,
//     validateContent: () => true,
// });
// Fee Discount Actions
exports.GetFeeDiscountScheduleAction = (0, base_1.createGenericAction)({
    name: "GET_FEE_DISCOUNT_SCHEDULE",
    description: "Fetches the fee discount schedule",
    template: ExchangeTemplates.getFeeDiscountScheduleTemplate,
    examples: ExchangeExamples.getFeeDiscountScheduleExample,
    similes: ExchangeSimiles.getFeeDiscountScheduleSimiles,
    functionName: "getFeeDiscountSchedule",
    validateContent: () => true,
});
exports.GetFeeDiscountAccountInfoAction = (0, base_1.createGenericAction)({
    name: "GET_FEE_DISCOUNT_ACCOUNT_INFO",
    description: "Fetches the fee discount information for a specific Injective address",
    template: ExchangeTemplates.getFeeDiscountAccountInfoTemplate,
    examples: ExchangeExamples.getFeeDiscountAccountInfoExample,
    similes: ExchangeSimiles.getFeeDiscountAccountInfoSimiles,
    functionName: "getFeeDiscountAccountInfo",
    validateContent: () => true,
});
// Trading Rewards Actions
exports.GetTradingRewardsCampaignAction = (0, base_1.createGenericAction)({
    name: "GET_TRADING_REWARDS_CAMPAIGN",
    description: "Fetches the trading rewards campaign details",
    template: ExchangeTemplates.getTradingRewardsCampaignTemplate,
    examples: ExchangeExamples.getTradingRewardsCampaignExample,
    similes: ExchangeSimiles.getTradingRewardsCampaignSimiles,
    functionName: "getTradingRewardsCampaign",
    validateContent: () => true,
});
exports.GetTradeRewardPointsAction = (0, base_1.createGenericAction)({
    name: "GET_TRADE_REWARD_POINTS",
    description: "Fetches the trade reward points for specified Injective addresses",
    template: ExchangeTemplates.getTradeRewardPointsTemplate,
    examples: ExchangeExamples.getTradeRewardPointsExample,
    similes: ExchangeSimiles.getTradeRewardPointsSimiles,
    functionName: "getTradeRewardPoints",
    validateContent: () => true,
});
exports.GetPendingTradeRewardPointsAction = (0, base_1.createGenericAction)({
    name: "GET_PENDING_TRADE_REWARD_POINTS",
    description: "Fetches pending trade reward points for specified Injective addresses",
    template: ExchangeTemplates.getPendingTradeRewardPointsTemplate,
    examples: ExchangeExamples.getPendingTradeRewardPointsExample,
    similes: ExchangeSimiles.getPendingTradeRewardPointsSimiles,
    functionName: "getPendingTradeRewardPoints",
    validateContent: () => true,
});
// Spot Market Actions
exports.GetSpotMarketsAction = (0, base_1.createGenericAction)({
    name: "GET_SPOT_MARKETS",
    description: "Fetches all spot markets",
    template: ExchangeTemplates.getSpotMarketsTemplate,
    examples: ExchangeExamples.getSpotMarketsExample,
    similes: ExchangeSimiles.getSpotMarketSimiles,
    functionName: "getSpotMarkets",
    validateContent: () => true,
});
exports.GetSpotMarketAction = (0, base_1.createGenericAction)({
    name: "GET_SPOT_MARKET",
    description: "Fetches a specific spot market by its ID",
    template: ExchangeTemplates.getSpotMarketTemplate,
    examples: ExchangeExamples.getSpotMarketExample,
    similes: ExchangeSimiles.getSpotMarketSimiles,
    functionName: "getSpotMarket",
    validateContent: () => true,
});
exports.GetSpotOrdersAction = (0, base_1.createGenericAction)({
    name: "GET_SPOT_ORDERS",
    description: "Fetches all spot orders",
    template: ExchangeTemplates.getSpotOrdersTemplate,
    examples: ExchangeExamples.getSpotOrdersExample,
    similes: ExchangeSimiles.getSpotOrdersSimiles,
    functionName: "getSpotOrders",
    validateContent: () => true,
});
exports.GetSpotOrderHistoryAction = (0, base_1.createGenericAction)({
    name: "GET_SPOT_ORDER_HISTORY",
    description: "Fetches the history of spot orders",
    template: ExchangeTemplates.getSpotOrderHistoryTemplate,
    examples: ExchangeExamples.getSpotOrderHistoryExample,
    similes: ExchangeSimiles.getSpotOrderHistorySimiles,
    functionName: "getSpotOrderHistory",
    validateContent: () => true,
});
exports.GetSpotTradesAction = (0, base_1.createGenericAction)({
    name: "GET_SPOT_TRADES",
    description: "Fetches all spot trades",
    template: ExchangeTemplates.getSpotTradesTemplate,
    examples: ExchangeExamples.getSpotTradesExample,
    similes: ExchangeSimiles.getSpotTradesSimiles,
    functionName: "getSpotTrades",
    validateContent: () => true,
});
//Orderbooks Action
exports.GetDerivativeOrderbooksAction = (0, base_1.createGenericAction)({
    name: "GET_DERIVATIVE_ORDERBOOKS",
    description: "Fetches all the derivative or perpetual orderbooks",
    template: ExchangeTemplates.getOrderbooksV2Template,
    examples: ExchangeExamples.getDerivativeOrderbooksV2Example,
    similes: ExchangeSimiles.getDerivativeOrderbookSimiles,
    functionName: "getDerivativeOrderbooksV2",
    validateContent: () => true,
});
exports.GetDerivativeOrderbookAction = (0, base_1.createGenericAction)({
    name: "GET_DERIVATIVE_ORDERBOOK",
    description: "Fetches a single derivative or perpetual orderbook",
    template: ExchangeTemplates.getOrderbookTemplate,
    examples: ExchangeExamples.getDerivativeOrderbookV2Example,
    similes: ExchangeSimiles.getDerivativeOrderbookSimiles,
    functionName: "getDerivativeOrderbookV2",
    validateContent: () => true,
});
exports.GetSpotOrderbooksAction = (0, base_1.createGenericAction)({
    name: "GET_SPOT_ORDERBOOKS",
    description: "Fetches all the spot markets orderbooks",
    template: ExchangeTemplates.getOrderbooksV2Template,
    examples: ExchangeExamples.getSpotOrderbooksV2Example,
    similes: ExchangeSimiles.getSpotOrderbooksSimiles,
    functionName: "getSpotOrderbooksV2",
    validateContent: () => true,
});
exports.GetSpotOrderbookAction = (0, base_1.createGenericAction)({
    name: "GET_SPOT_ORDERBOOK",
    description: "Fetches a single spot market orderbook",
    template: ExchangeTemplates.getOrderbookTemplate,
    examples: ExchangeExamples.getSpotOrderbookV2Example,
    similes: ExchangeSimiles.getSpotOrderbookSimiles,
    functionName: "getSpotOrderbookV2",
    validateContent: () => true,
});
// Derivative Market Actions
exports.GetDerivativeMarketsAction = (0, base_1.createGenericAction)({
    name: "GET_DERIVATIVE_MARKETS",
    description: "Fetches all derivative markets",
    template: ExchangeTemplates.getDerivativeMarketsTemplate,
    examples: ExchangeExamples.getDerivativeMarketsExample,
    similes: ExchangeSimiles.getDerivativeMarketsSimiles,
    functionName: "getDerivativeMarkets",
    validateContent: () => true,
});
exports.GetDerivativeMarketAction = (0, base_1.createGenericAction)({
    name: "GET_DERIVATIVE_MARKET",
    description: "Fetches a specific derivative market by its ID",
    template: ExchangeTemplates.getDerivativeMarketTemplate,
    examples: ExchangeExamples.getDerivativeMarketExample,
    similes: ExchangeSimiles.getDerivativeMarketSimiles,
    functionName: "getDerivativeMarket",
    validateContent: () => true,
});
exports.GetDerivativeOrdersAction = (0, base_1.createGenericAction)({
    name: "GET_DERIVATIVE_ORDERS",
    description: "Fetches all derivative orders",
    template: ExchangeTemplates.getDerivativeOrdersTemplate,
    examples: ExchangeExamples.getDerivativeOrdersExample,
    similes: ExchangeSimiles.getDerivativeOrdersSimiles,
    functionName: "getDerivativeOrders",
    validateContent: () => true,
});
exports.GetDerivativeOrderHistoryAction = (0, base_1.createGenericAction)({
    name: "GET_DERIVATIVE_ORDER_HISTORY",
    description: "Fetches the history of derivative orders",
    template: ExchangeTemplates.getDerivativeOrderHistoryTemplate,
    examples: ExchangeExamples.getDerivativeOrderHistoryExample,
    similes: ExchangeSimiles.getDerivativeOrderHistorySimiles,
    functionName: "getDerivativeOrderHistory",
    validateContent: () => true,
});
exports.GetDerivativeTradesAction = (0, base_1.createGenericAction)({
    name: "GET_DERIVATIVE_TRADES",
    description: "Fetches all derivative trades",
    template: ExchangeTemplates.getDerivativeTradesTemplate,
    examples: ExchangeExamples.getDerivativeTradesExample,
    similes: ExchangeSimiles.getDerivativeTradesSimiles,
    functionName: "getDerivativeTrades",
    validateContent: () => true,
});
// Binary Options Actions
exports.GetBinaryOptionsMarketsAction = (0, base_1.createGenericAction)({
    name: "GET_BINARY_OPTIONS_MARKETS",
    description: "Fetches all binary options markets",
    template: ExchangeTemplates.getBinaryOptionsMarketsTemplate,
    examples: ExchangeExamples.getBinaryOptionsMarketsExample,
    similes: ExchangeSimiles.getBinaryOptionsMarketsSimiles,
    functionName: "getBinaryOptionsMarkets",
    validateContent: () => true,
});
exports.GetBinaryOptionsMarketAction = (0, base_1.createGenericAction)({
    name: "GET_BINARY_OPTIONS_MARKET",
    description: "Fetches a specific binary options market by its ID",
    template: ExchangeTemplates.getBinaryOptionsMarketTemplate,
    examples: ExchangeExamples.getBinaryOptionsMarketExample,
    similes: ExchangeSimiles.getBinaryOptionsMarketSimiles,
    functionName: "getBinaryOptionsMarket",
    validateContent: () => true,
});
// Exchange Positions Actions
exports.GetExchangePositionsAction = (0, base_1.createGenericAction)({
    name: "GET_EXCHANGE_POSITIONS",
    description: "Fetches all positions",
    template: ExchangeTemplates.getExchangePositionsTemplate,
    examples: ExchangeExamples.getExchangePositionsExample,
    similes: ExchangeSimiles.getExchangePositionsSimiles,
    functionName: "getExchangePositions",
    validateContent: () => true,
});
exports.GetPositionsV2Action = (0, base_1.createGenericAction)({
    name: "GET_POSITIONS_V2",
    description: "Fetches all positions using version 2 of the API",
    template: ExchangeTemplates.getPositionsV2Template,
    examples: ExchangeExamples.getPositionsV2Example,
    similes: ExchangeSimiles.getUserPositionsSimiles,
    functionName: "getPositionsV2",
    validateContent: () => true,
});
// Funding Rate Actions
exports.GetFundingPaymentsAction = (0, base_1.createGenericAction)({
    name: "GET_FUNDING_PAYMENTS",
    description: "Fetches all funding payments",
    template: ExchangeTemplates.getFundingPaymentsTemplate,
    examples: ExchangeExamples.getFundingPaymentsExample,
    similes: ExchangeSimiles.getFundingPaymentsSimiles,
    functionName: "getFundingPayments",
    validateContent: () => true,
});
exports.GetFundingRatesAction = (0, base_1.createGenericAction)({
    name: "GET_FUNDING_RATES",
    description: "Fetches all funding rates",
    template: ExchangeTemplates.getFundingRatesTemplate,
    examples: ExchangeExamples.getFundingRatesExample,
    similes: ExchangeSimiles.getFundingRatesSimiles,
    functionName: "getFundingRates",
    validateContent: () => true,
});
// Subaccount Actions
exports.GetSubaccountTradeNonceAction = (0, base_1.createGenericAction)({
    name: "GET_SUBACCOUNT_TRADE_NONCE",
    description: "Fetches the trade nonce for a specific subaccount",
    template: ExchangeTemplates.getSubaccountTradeNonceTemplate,
    examples: ExchangeExamples.getSubaccountTradeNonceExample,
    similes: ExchangeSimiles.getSubaccountTradeNonceSimiles,
    functionName: "getSubaccountTradeNonce",
    validateContent: () => true,
});
exports.GetSubaccountsListAction = (0, base_1.createGenericAction)({
    name: "GET_SUBACCOUNTS_LIST",
    description: "Fetches the list of subaccounts for a specific address",
    template: ExchangeTemplates.getSubaccountsListTemplate,
    examples: ExchangeExamples.getSubaccountsListExample,
    similes: ExchangeSimiles.getSubaccountsListSimiles,
    functionName: "getSubaccountsList",
    validateContent: () => true,
});
exports.GetSubaccountBalancesListAction = (0, base_1.createGenericAction)({
    name: "GET_SUBACCOUNT_BALANCES_LIST",
    description: "Fetches the balances list for a specific subaccount",
    template: ExchangeTemplates.getSubaccountBalancesListTemplate,
    examples: ExchangeExamples.getSubaccountBalancesListExample,
    similes: ExchangeSimiles.getSubaccountBalancesListSimiles,
    functionName: "getSubaccountBalancesList",
    validateContent: () => true,
});
exports.GetSubaccountHistoryAction = (0, base_1.createGenericAction)({
    name: "GET_SUBACCOUNT_HISTORY",
    description: "Fetches the transfer history of a specific subaccount",
    template: ExchangeTemplates.getSubaccountHistoryTemplate,
    examples: ExchangeExamples.getSubaccountHistoryExample,
    similes: ExchangeSimiles.getSubaccountHistorySimiles,
    functionName: "getSubaccountHistory",
    validateContent: () => true,
});
exports.GetSubaccountOrderSummaryAction = (0, base_1.createGenericAction)({
    name: "GET_SUBACCOUNT_ORDER_SUMMARY",
    description: "Fetches the order summary for a specific subaccount",
    template: ExchangeTemplates.getSubaccountOrderSummaryTemplate,
    examples: ExchangeExamples.getSubaccountOrderSummaryExample,
    similes: ExchangeSimiles.getSubaccountOrderSummarySimiles,
    functionName: "getSubaccountOrderSummary",
    validateContent: () => true,
});
// Order Management Actions
exports.GetOrderStatesAction = (0, base_1.createGenericAction)({
    name: "GET_ORDER_STATES",
    description: "Fetches the states of orders",
    template: ExchangeTemplates.getOrderStatesTemplate,
    examples: ExchangeExamples.getOrderStatesExample,
    similes: ExchangeSimiles.getOrderStatesSimiles,
    functionName: "getOrderStates",
    validateContent: () => true,
});
// Portfolio Actions
exports.GetAccountPortfolioAction = (0, base_1.createGenericAction)({
    name: "GET_ACCOUNT_PORTFOLIO",
    description: "Fetches the account portfolio for a specific address",
    template: ExchangeTemplates.getAccountPortfolioTemplate,
    examples: ExchangeExamples.getAccountPortfolioExample,
    similes: ExchangeSimiles.getAccountPortfolioSimiles,
    functionName: "getAccountPortfolio",
    validateContent: () => true,
});
exports.GetAccountPortfolioBalancesAction = (0, base_1.createGenericAction)({
    name: "GET_ACCOUNT_PORTFOLIO_BALANCES",
    description: "Fetches the balances of the account portfolio for a specific address",
    template: ExchangeTemplates.getAccountPortfolioBalancesTemplate,
    examples: ExchangeExamples.getAccountPortfolioBalancesExample,
    similes: ExchangeSimiles.getAccountPortfolioBalancesSimiles,
    functionName: "getAccountPortfolioBalances",
    validateContent: () => true,
});
// Rewards and Opt-out Actions
exports.GetIsOptedOutOfRewardsAction = (0, base_1.createGenericAction)({
    name: "GET_IS_OPTED_OUT_OF_REWARDS",
    description: "Checks if an account is opted out of rewards",
    template: ExchangeTemplates.getIsOptedOutOfRewardsTemplate,
    examples: ExchangeExamples.getIsOptedOutOfRewardsExample,
    similes: ExchangeSimiles.getIsOptedOutOfRewardsSimiles,
    functionName: "getIsOptedOutOfRewards",
    validateContent: () => true,
});
exports.GetRewardsAction = (0, base_1.createGenericAction)({
    name: "GET_REWARDS",
    description: "Fetches the rewards for specified Injective addresses",
    template: ExchangeTemplates.getRewardsTemplate,
    examples: ExchangeExamples.getRewardsExample,
    similes: ExchangeSimiles.getRewardsSimiles,
    functionName: "getRewards",
    validateContent: () => true,
});
// Atomic Swap Actions
exports.GetAtomicSwapHistoryAction = (0, base_1.createGenericAction)({
    name: "GET_ATOMIC_SWAP_HISTORY",
    description: "Fetches the atomic swap history",
    template: ExchangeTemplates.getAtomicSwapHistoryTemplate,
    examples: ExchangeExamples.getAtomicSwapHistoryExample,
    similes: ExchangeSimiles.getAtomicSwapHistorySimiles,
    functionName: "getAtomicSwapHistory",
    validateContent: () => true,
});
// Grid Strategy Actions
exports.GetGridStrategiesAction = (0, base_1.createGenericAction)({
    name: "GET_GRID_STRATEGIES",
    description: "Fetches all grid strategies",
    template: ExchangeTemplates.getGridStrategiesTemplate,
    examples: ExchangeExamples.getGridStrategiesExample,
    similes: ExchangeSimiles.getGridStrategiesSimiles,
    functionName: "getGridStrategies",
    validateContent: () => true,
});
// Historical Data Actions
exports.GetHistoricalBalanceAction = (0, base_1.createGenericAction)({
    name: "GET_HISTORICAL_BALANCE",
    description: "Fetches the historical balance",
    template: ExchangeTemplates.getHistoricalBalanceTemplate,
    examples: ExchangeExamples.getHistoricalBalanceExample,
    similes: ExchangeSimiles.getHistoricalBalanceSimiles,
    functionName: "getHistoricalBalance",
    validateContent: () => true,
});
exports.GetHistoricalRpnlAction = (0, base_1.createGenericAction)({
    name: "GET_HISTORICAL_RPNL",
    description: "Fetches the historical realized PnL (Rpnl)",
    template: ExchangeTemplates.getHistoricalRpnlTemplate,
    examples: ExchangeExamples.getHistoricalRpnlExample,
    similes: ExchangeSimiles.getHistoricalRpnlSimiles,
    functionName: "getHistoricalRpnl",
    validateContent: () => true,
});
exports.GetHistoricalVolumesAction = (0, base_1.createGenericAction)({
    name: "GET_HISTORICAL_VOLUMES",
    description: "Fetches the historical trading volumes",
    template: ExchangeTemplates.getHistoricalVolumesTemplate,
    examples: ExchangeExamples.getHistoricalVolumesExample,
    similes: ExchangeSimiles.getHistoricalVolumesSimiles,
    functionName: "getHistoricalVolumes",
    validateContent: () => true,
});
// Leaderboard Actions
exports.GetPnlLeaderboardAction = (0, base_1.createGenericAction)({
    name: "GET_PNL_LEADERBOARD",
    description: "Fetches the PnL leaderboard",
    template: ExchangeTemplates.getPnlLeaderboardTemplate,
    examples: ExchangeExamples.getPnlLeaderboardExample,
    similes: ExchangeSimiles.getPnlLeaderboardSimiles,
    functionName: "getPnlLeaderboard",
    validateContent: () => true,
});
exports.GetVolLeaderboardAction = (0, base_1.createGenericAction)({
    name: "GET_VOL_LEADERBOARD",
    description: "Fetches the volume leaderboard",
    template: ExchangeTemplates.getVolLeaderboardTemplate,
    examples: ExchangeExamples.getVolLeaderboardExample,
    similes: ExchangeSimiles.getVolLeaderboardSimiles,
    functionName: "getVolLeaderboard",
    validateContent: () => true,
});
exports.GetPnlLeaderboardFixedResolutionAction = (0, base_1.createGenericAction)({
    name: "GET_PNL_LEADERBOARD_FIXED_RESOLUTION",
    description: "Fetches the PnL leaderboard with fixed resolution",
    template: ExchangeTemplates.getPnlLeaderboardFixedResolutionTemplate,
    examples: ExchangeExamples.getPnlLeaderboardFixedResolutionExample,
    similes: ExchangeSimiles.getPnlLeaderboardFixedResolutionSimiles,
    functionName: "getPnlLeaderboardFixedResolution",
    validateContent: () => true,
});
exports.GetVolLeaderboardFixedResolutionAction = (0, base_1.createGenericAction)({
    name: "GET_VOL_LEADERBOARD_FIXED_RESOLUTION",
    description: "Fetches the volume leaderboard with fixed resolution",
    template: ExchangeTemplates.getVolLeaderboardFixedResolutionTemplate,
    examples: ExchangeExamples.getVolLeaderboardFixedResolutionExample,
    similes: ExchangeSimiles.getVolLeaderboardFixedResolutionSimiles,
    functionName: "getVolLeaderboardFixedResolution",
    validateContent: () => true,
});
// Denom Holders Action
exports.GetDenomHoldersAction = (0, base_1.createGenericAction)({
    name: "GET_DENOM_HOLDERS",
    description: "Fetches the holders of a specific denomination",
    template: ExchangeTemplates.getDenomHoldersTemplate,
    examples: ExchangeExamples.getDenomHoldersExample,
    similes: ExchangeSimiles.getDenomHoldersSimiles,
    functionName: "getDenomHolders",
    validateContent: () => true,
});
// Message Actions for Order Management
exports.MsgBatchCancelBinaryOptionsOrdersAction = (0, base_1.createGenericAction)({
    name: "MSG_BATCH_CANCEL_BINARY_OPTIONS_ORDERS",
    description: "Broadcasts a message to batch cancel binary options orders",
    template: ExchangeTemplates.msgBatchCancelBinaryOptionsOrdersTemplate,
    examples: ExchangeExamples.msgBatchCancelBinaryOptionsOrdersExample,
    similes: ExchangeSimiles.msgBatchCancelBinaryOptionsOrdersSimiles,
    functionName: "msgBatchCancelBinaryOptionsOrders",
    validateContent: () => true,
});
exports.MsgBatchCancelDerivativeOrdersAction = (0, base_1.createGenericAction)({
    name: "MSG_BATCH_CANCEL_DERIVATIVE_ORDERS",
    description: "Broadcasts a message to batch cancel derivative orders",
    template: ExchangeTemplates.msgBatchCancelDerivativeOrdersTemplate,
    examples: ExchangeExamples.msgBatchCancelDerivativeOrdersExample,
    similes: ExchangeSimiles.msgBatchCancelDerivativeOrdersSimiles,
    functionName: "msgBatchCancelDerivativeOrders",
    validateContent: () => true,
});
exports.MsgBatchCancelSpotOrdersAction = (0, base_1.createGenericAction)({
    name: "MSG_BATCH_CANCEL_SPOT_ORDERS",
    description: "Broadcasts a message to batch cancel spot orders",
    template: ExchangeTemplates.msgBatchCancelSpotOrdersTemplate,
    examples: ExchangeExamples.msgBatchCancelSpotOrdersExample,
    similes: ExchangeSimiles.msgBatchCancelSpotOrdersSimiles,
    functionName: "msgBatchCancelSpotOrders",
    validateContent: () => true,
});
exports.MsgBatchUpdateOrdersAction = (0, base_1.createGenericAction)({
    name: "MSG_BATCH_UPDATE_ORDERS",
    description: "Broadcasts a message to batch update orders",
    template: ExchangeTemplates.msgBatchUpdateOrdersTemplate,
    examples: ExchangeExamples.msgBatchUpdateOrdersExample,
    similes: ExchangeSimiles.msgBatchUpdateOrdersSimiles,
    functionName: "msgBatchUpdateOrders",
    validateContent: () => true,
});
// Message Actions for Individual Orders
exports.MsgCancelBinaryOptionsOrderAction = (0, base_1.createGenericAction)({
    name: "MSG_CANCEL_BINARY_OPTIONS_ORDER",
    description: "Broadcasts a message to cancel a binary options order",
    template: ExchangeTemplates.msgCancelBinaryOptionsOrderTemplate,
    examples: ExchangeExamples.msgCancelBinaryOptionsOrderExample,
    similes: ExchangeSimiles.msgCancelBinaryOptionsOrderSimiles,
    functionName: "msgCancelBinaryOptionsOrder",
    validateContent: () => true,
});
exports.MsgCancelDerivativeOrderAction = (0, base_1.createGenericAction)({
    name: "MSG_CANCEL_DERIVATIVE_ORDER",
    description: "Broadcasts a message to cancel a derivative order",
    template: ExchangeTemplates.msgCancelDerivativeOrderTemplate,
    examples: ExchangeExamples.msgCancelDerivativeOrderExample,
    similes: ExchangeSimiles.msgCancelDerivativeOrderSimiles,
    functionName: "msgCancelDerivativeOrder",
    validateContent: () => true,
});
exports.MsgCancelSpotOrderAction = (0, base_1.createGenericAction)({
    name: "MSG_CANCEL_SPOT_ORDER",
    description: "Broadcasts a message to cancel a spot order",
    template: ExchangeTemplates.msgCancelSpotOrderTemplate,
    examples: ExchangeExamples.msgCancelSpotOrderExample,
    similes: ExchangeSimiles.msgCancelSpotOrderSimiles,
    functionName: "msgCancelSpotOrder",
    validateContent: () => true,
});
// Message Actions for Creating Orders
exports.MsgCreateBinaryOptionsLimitOrderAction = (0, base_1.createGenericAction)({
    name: "MSG_CREATE_BINARY_OPTIONS_LIMIT_ORDER",
    description: "Broadcasts a message to create a binary options limit order",
    template: ExchangeTemplates.msgCreateBinaryOptionsLimitOrderTemplate,
    examples: ExchangeExamples.msgCreateBinaryOptionsLimitOrderExample,
    similes: ExchangeSimiles.msgCreateBinaryOptionsLimitOrderSimiles,
    functionName: "msgCreateBinaryOptionsLimitOrder",
    validateContent: () => true,
});
exports.MsgCreateBinaryOptionsMarketOrderAction = (0, base_1.createGenericAction)({
    name: "MSG_CREATE_BINARY_OPTIONS_MARKET_ORDER",
    description: "Broadcasts a message to create a binary options market order",
    template: ExchangeTemplates.msgCreateBinaryOptionsMarketOrderTemplate,
    examples: ExchangeExamples.msgCreateBinaryOptionsMarketOrderExample,
    similes: ExchangeSimiles.msgCreateBinaryOptionsMarketOrderSimiles,
    functionName: "msgCreateBinaryOptionsMarketOrder",
    validateContent: () => true,
});
exports.MsgCreateDerivativeLimitOrderAction = (0, base_1.createGenericAction)({
    name: "MSG_CREATE_DERIVATIVE_LIMIT_ORDER",
    description: "Broadcasts a message to create a derivative limit order",
    template: ExchangeTemplates.msgCreateDerivativeLimitOrderTemplate,
    examples: ExchangeExamples.msgCreateDerivativeLimitOrderExample,
    similes: ExchangeSimiles.msgCreateDerivativeLimitOrderSimiles,
    functionName: "msgCreateDerivativeLimitOrder",
    validateContent: () => true,
});
exports.MsgCreateDerivativeMarketOrderAction = (0, base_1.createGenericAction)({
    name: "MSG_CREATE_DERIVATIVE_MARKET_ORDER",
    description: "Broadcasts a message to create a derivative market order",
    template: ExchangeTemplates.msgCreateDerivativeMarketOrderTemplate,
    examples: ExchangeExamples.msgCreateDerivativeMarketOrderExample,
    similes: ExchangeSimiles.msgCreateDerivativeMarketOrderSimiles,
    functionName: "msgCreateDerivativeMarketOrder",
    validateContent: () => true,
});
exports.MsgCreateSpotLimitOrderAction = (0, base_1.createGenericAction)({
    name: "MSG_CREATE_SPOT_LIMIT_ORDER",
    description: "Broadcasts a message to create a spot limit order",
    template: ExchangeTemplates.msgCreateSpotLimitOrderTemplate,
    examples: ExchangeExamples.msgCreateSpotLimitOrderExample,
    similes: ExchangeSimiles.msgCreateSpotLimitOrderSimiles,
    functionName: "msgCreateSpotLimitOrder",
    validateContent: () => true,
});
exports.MsgCreateSpotMarketOrderAction = (0, base_1.createGenericAction)({
    name: "MSG_CREATE_SPOT_MARKET_ORDER",
    description: "Broadcasts a message to create a spot market order",
    template: ExchangeTemplates.msgCreateSpotMarketOrderTemplate,
    examples: ExchangeExamples.msgCreateSpotMarketOrderExample,
    similes: ExchangeSimiles.msgCreateSpotMarketOrderSimiles,
    functionName: "msgCreateSpotMarketOrder",
    validateContent: () => true,
});
// Message Actions for Deposits and Withdrawals
exports.MsgDepositAction = (0, base_1.createGenericAction)({
    name: "MSG_DEPOSIT",
    description: "Broadcasts a message to deposit funds",
    template: ExchangeTemplates.msgDepositTemplate,
    examples: ExchangeExamples.msgDepositExample,
    similes: ExchangeSimiles.msgDepositSimiles,
    functionName: "msgDeposit",
    validateContent: () => true,
});
exports.MsgWithdrawAction = (0, base_1.createGenericAction)({
    name: "MSG_WITHDRAW",
    description: "Broadcasts a message to withdraw funds",
    template: ExchangeTemplates.msgWithdrawTemplate,
    examples: ExchangeExamples.msgWithdrawExample,
    similes: ExchangeSimiles.msgWithdrawSimiles,
    functionName: "msgWithdraw",
    validateContent: () => true,
});
// Message Actions for Position Management
exports.MsgIncreasePositionMarginAction = (0, base_1.createGenericAction)({
    name: "MSG_INCREASE_POSITION_MARGIN",
    description: "Broadcasts a message to increase position margin",
    template: ExchangeTemplates.msgIncreasePositionMarginTemplate,
    examples: ExchangeExamples.msgIncreasePositionMarginExample,
    similes: ExchangeSimiles.msgIncreasePositionMarginSimiles,
    functionName: "msgIncreasePositionMargin",
    validateContent: () => true,
});
// Message Actions for Market Administration
exports.MsgInstantSpotMarketLaunchAction = (0, base_1.createGenericAction)({
    name: "MSG_INSTANT_SPOT_MARKET_LAUNCH",
    description: "Broadcasts a message to instantly launch a spot market",
    template: ExchangeTemplates.msgInstantSpotMarketLaunchTemplate,
    examples: ExchangeExamples.msgInstantSpotMarketLaunchExample,
    similes: ExchangeSimiles.msgInstantSpotMarketLaunchSimiles,
    functionName: "msgInstantSpotMarketLaunch",
    validateContent: () => true,
});
exports.MsgLiquidatePositionAction = (0, base_1.createGenericAction)({
    name: "MSG_LIQUIDATE_POSITION",
    description: "Broadcasts a message to liquidate a position",
    template: ExchangeTemplates.msgLiquidatePositionTemplate,
    examples: ExchangeExamples.msgLiquidatePositionExample,
    similes: ExchangeSimiles.msgLiquidatePositionSimiles,
    functionName: "msgLiquidatePosition",
    validateContent: () => true,
});
exports.MsgReclaimLockedFundsAction = (0, base_1.createGenericAction)({
    name: "MSG_RECLAIM_LOCKED_FUNDS",
    description: "Broadcasts a message to reclaim locked funds",
    template: ExchangeTemplates.msgReclaimLockedFundsTemplate,
    examples: ExchangeExamples.msgReclaimLockedFundsExample,
    similes: ExchangeSimiles.msgReclaimLockedFundsSimiles,
    functionName: "msgReclaimLockedFunds",
    validateContent: () => true,
});
exports.MsgRewardsOptOutAction = (0, base_1.createGenericAction)({
    name: "MSG_REWARDS_OPT_OUT",
    description: "Broadcasts a message to opt out of rewards",
    template: ExchangeTemplates.msgRewardsOptOutTemplate,
    examples: ExchangeExamples.msgRewardsOptOutExample,
    similes: ExchangeSimiles.msgRewardsOptOutSimiles,
    functionName: "msgRewardsOptOut",
    validateContent: () => true,
});
exports.MsgSignDataAction = (0, base_1.createGenericAction)({
    name: "MSG_SIGN_DATA",
    description: "Broadcasts a message to sign data",
    template: ExchangeTemplates.msgSignDataTemplate,
    examples: ExchangeExamples.msgSignDataExample,
    similes: ExchangeSimiles.msgSignDataSimiles,
    functionName: "msgSignData",
    validateContent: () => true,
});
exports.MsgExternalTransferAction = (0, base_1.createGenericAction)({
    name: "MSG_EXTERNAL_TRANSFER",
    description: "Broadcasts a message to perform an external transfer",
    template: ExchangeTemplates.msgExternalTransferTemplate,
    examples: ExchangeExamples.msgExternalTransferExample,
    similes: ExchangeSimiles.msgExternalTransferSimiles,
    functionName: "msgExternalTransfer",
    validateContent: () => true,
});
exports.MsgAdminUpdateBinaryOptionsMarketAction = (0, base_1.createGenericAction)({
    name: "MSG_ADMIN_UPDATE_BINARY_OPTIONS_MARKET",
    description: "Broadcasts a message to update a binary options market as an admin",
    template: ExchangeTemplates.msgAdminUpdateBinaryOptionsMarketTemplate,
    examples: ExchangeExamples.msgAdminUpdateBinaryOptionsMarketExample,
    functionName: "msgAdminUpdateBinaryOptionsMarket",
    similes: ExchangeSimiles.msgAdminUpdateBinaryOptionsMarketSimiles,
    validateContent: () => true,
});
// Export all actions as a group
exports.ExchangeActions = [
    // Module Parameters and State
    exports.GetModuleParamsAction,
    // Fee Discount
    exports.GetFeeDiscountScheduleAction,
    exports.GetFeeDiscountAccountInfoAction,
    // Trading Rewards
    exports.GetTradingRewardsCampaignAction,
    exports.GetTradeRewardPointsAction,
    exports.GetPendingTradeRewardPointsAction,
    // Orderbooks
    exports.GetDerivativeOrderbooksAction,
    exports.GetDerivativeOrderbookAction,
    exports.GetSpotOrderbooksAction,
    exports.GetSpotOrderbookAction,
    // Spot Market
    exports.GetSpotMarketsAction,
    exports.GetSpotMarketAction,
    exports.GetSpotOrdersAction,
    exports.GetSpotOrderHistoryAction,
    exports.GetSpotTradesAction,
    // Derivative Market
    exports.GetDerivativeMarketsAction,
    exports.GetDerivativeMarketAction,
    exports.GetDerivativeOrdersAction,
    exports.GetDerivativeOrderHistoryAction,
    exports.GetDerivativeTradesAction,
    // Binary Options
    exports.GetBinaryOptionsMarketsAction,
    exports.GetBinaryOptionsMarketAction,
    // Positions
    exports.GetExchangePositionsAction,
    exports.GetPositionsV2Action,
    // Funding
    exports.GetFundingPaymentsAction,
    exports.GetFundingRatesAction,
    // Subaccount
    exports.GetSubaccountTradeNonceAction,
    exports.GetSubaccountsListAction,
    exports.GetSubaccountBalancesListAction,
    exports.GetSubaccountHistoryAction,
    exports.GetSubaccountOrderSummaryAction,
    // Order Management
    exports.GetOrderStatesAction,
    // Portfolio
    exports.GetAccountPortfolioAction,
    exports.GetAccountPortfolioBalancesAction,
    // Rewards and Opt-out
    exports.GetIsOptedOutOfRewardsAction,
    exports.GetRewardsAction,
    // Atomic Swap
    exports.GetAtomicSwapHistoryAction,
    // Grid Strategy
    exports.GetGridStrategiesAction,
    // Historical Data
    exports.GetHistoricalBalanceAction,
    exports.GetHistoricalRpnlAction,
    exports.GetHistoricalVolumesAction,
    // Leaderboard
    exports.GetPnlLeaderboardAction,
    exports.GetVolLeaderboardAction,
    exports.GetPnlLeaderboardFixedResolutionAction,
    exports.GetVolLeaderboardFixedResolutionAction,
    // Denom Holders
    exports.GetDenomHoldersAction,
    // Message Actions - Order Management
    exports.MsgBatchCancelBinaryOptionsOrdersAction,
    exports.MsgBatchCancelDerivativeOrdersAction,
    exports.MsgBatchCancelSpotOrdersAction,
    exports.MsgBatchUpdateOrdersAction,
    exports.MsgCancelBinaryOptionsOrderAction,
    exports.MsgCancelDerivativeOrderAction,
    exports.MsgCancelSpotOrderAction,
    // Message Actions - Creating Orders
    exports.MsgCreateBinaryOptionsLimitOrderAction,
    exports.MsgCreateBinaryOptionsMarketOrderAction,
    exports.MsgCreateDerivativeLimitOrderAction,
    exports.MsgCreateDerivativeMarketOrderAction,
    exports.MsgCreateSpotLimitOrderAction,
    exports.MsgCreateSpotMarketOrderAction,
    // Message Actions - Deposits and Withdrawals
    exports.MsgDepositAction,
    exports.MsgWithdrawAction,
    // Message Actions - Position Management
    exports.MsgIncreasePositionMarginAction,
    exports.MsgInstantSpotMarketLaunchAction,
    exports.MsgLiquidatePositionAction,
    // Message Actions - Administration and Utils
    exports.MsgReclaimLockedFundsAction,
    exports.MsgRewardsOptOutAction,
    exports.MsgSignDataAction,
    exports.MsgExternalTransferAction,
    exports.MsgAdminUpdateBinaryOptionsMarketAction,
];
