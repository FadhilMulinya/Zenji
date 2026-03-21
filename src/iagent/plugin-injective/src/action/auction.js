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
exports.AuctionActions = exports.MsgBidAction = exports.GetAuctionsAction = exports.GetAuctionRoundAction = exports.GetCurrentBasketAction = exports.GetAuctionModuleStateAction = exports.GetAuctionModuleParamsAction = void 0;
const base_1 = require("./base");
const AuctionTemplates = __importStar(require("@injective/template/auction"));
const AuctionExamples = __importStar(require("@injective/examples/auction"));
const AuctionSimilies = __importStar(require("@injective/similes/auction"));
exports.GetAuctionModuleParamsAction = (0, base_1.createGenericAction)({
    name: "GET_AUCTION_MODULE_PARAMS",
    description: "Fetches the auction module parameters",
    template: AuctionTemplates.getAuctionModuleParamsTemplate,
    examples: AuctionExamples.getAuctionModuleParamsExample,
    similes: AuctionSimilies.getAuctionModuleParamsSimiles,
    functionName: "getAuctionModuleParams",
    validateContent: () => true,
});
exports.GetAuctionModuleStateAction = (0, base_1.createGenericAction)({
    name: "GET_AUCTION_MODULE_STATE",
    description: "Fetches the auction module state",
    template: AuctionTemplates.getAuctionModuleStateTemplate,
    examples: AuctionExamples.getAuctionModuleStateExample,
    similes: AuctionSimilies.getAuctionModuleStateSimiles,
    functionName: "getAuctionModuleState",
    validateContent: () => true,
});
exports.GetCurrentBasketAction = (0, base_1.createGenericAction)({
    name: "GET_CURRENT_BASKET",
    description: "Fetches the current auction basket",
    template: AuctionTemplates.getCurrentBasketTemplate,
    examples: AuctionExamples.getCurrentBasketExample,
    functionName: "getCurrentBasket",
    similes: AuctionSimilies.getCurrentBasketSimiles,
    validateContent: () => true,
});
exports.GetAuctionRoundAction = (0, base_1.createGenericAction)({
    name: "GET_AUCTION_ROUND",
    description: "Fetches details of a specific auction round",
    template: AuctionTemplates.getAuctionRoundTemplate,
    examples: AuctionExamples.getAuctionRoundExample,
    similes: AuctionSimilies.getAuctionRoundSimiles,
    functionName: "getAuctionRound",
    validateContent: () => true,
});
exports.GetAuctionsAction = (0, base_1.createGenericAction)({
    name: "GET_AUCTIONS",
    description: "Fetches a list of auctions",
    template: AuctionTemplates.getAuctionsTemplate,
    examples: AuctionExamples.getAuctionsExample,
    similes: AuctionSimilies.getAuctionsSimiles,
    functionName: "getAuctions",
    validateContent: () => true,
});
exports.MsgBidAction = (0, base_1.createGenericAction)({
    name: "MSG_BID",
    description: "Places a bid in an auction round",
    template: AuctionTemplates.msgBidTemplate,
    examples: AuctionExamples.msgBidExample,
    similes: AuctionSimilies.MsgBidSimiles,
    functionName: "msgBid",
    validateContent: () => true,
});
exports.AuctionActions = [
    exports.GetAuctionModuleParamsAction,
    exports.GetAuctionModuleStateAction,
    exports.GetCurrentBasketAction,
    exports.GetAuctionRoundAction,
    exports.GetAuctionsAction,
    exports.MsgBidAction,
];
