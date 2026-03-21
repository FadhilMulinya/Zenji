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
exports.IbcActions = exports.MsgIBCTransferAction = exports.GetDenomsTraceAction = exports.GetDenomTraceAction = void 0;
const base_1 = require("./base");
const IBCTemplates = __importStar(require("@injective/template/ibc"));
const IBCExamples = __importStar(require("@injective/examples/ibc"));
const IBCSimiles = __importStar(require("@injective/similes/ibc"));
exports.GetDenomTraceAction = (0, base_1.createGenericAction)({
    name: "GET_DENOM_TRACE",
    description: "Fetches the denomination trace for a specific hash",
    template: IBCTemplates.getDenomTraceTemplate,
    examples: IBCExamples.getDenomTraceExample,
    similes: IBCSimiles.getDenomTraceSimiles,
    functionName: "getDenomTrace",
    validateContent: () => true,
});
exports.GetDenomsTraceAction = (0, base_1.createGenericAction)({
    name: "GET_DENOMS_TRACE",
    description: "Fetches a list of denomination traces with optional pagination",
    template: IBCTemplates.getDenomsTraceTemplate,
    examples: IBCExamples.getDenomsTraceExample,
    similes: IBCSimiles.getDenomsTraceSimiles,
    functionName: "getDenomsTrace",
    validateContent: () => true,
});
exports.MsgIBCTransferAction = (0, base_1.createGenericAction)({
    name: "MSG_IBC_TRANSFER",
    description: "Broadcasts an IBC transfer message",
    template: IBCTemplates.msgIBCTransferTemplate,
    examples: IBCExamples.msgIBCTransferExample,
    similes: IBCSimiles.msgIBCTransferSimiles,
    functionName: "msgIBCTransfer",
    validateContent: () => true,
});
// Export all actions as a group
exports.IbcActions = [
    exports.GetDenomTraceAction,
    exports.GetDenomsTraceAction,
    exports.MsgIBCTransferAction,
];
