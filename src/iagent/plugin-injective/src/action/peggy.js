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
exports.PeggyActions = exports.MsgSendToEthAction = exports.GetPeggyModuleParamsAction = void 0;
const base_1 = require("./base");
const PeggyTemplates = __importStar(require("@injective/template/peggy"));
const PeggyExamples = __importStar(require("@injective/examples/peggy"));
const PeggySimiles = __importStar(require("@injective/similes/peggy"));
// Query Actions
exports.GetPeggyModuleParamsAction = (0, base_1.createGenericAction)({
    name: "GET_PEGGY_MODULE_PARAMS",
    description: "Fetches the parameters of the Peggy module",
    template: PeggyTemplates.getPeggyModuleParamsTemplate,
    examples: PeggyExamples.getPeggyModuleParamsExample,
    functionName: "getPeggyModuleParams",
    similes: PeggySimiles.getPeggyModuleParamsSimiles,
    validateContent: () => true,
});
// Message Actions
exports.MsgSendToEthAction = (0, base_1.createGenericAction)({
    name: "MSG_SEND_TO_ETH",
    description: "Broadcasts a message to send tokens to an Ethereum address via IBC transfer",
    template: PeggyTemplates.msgSendToEthTemplate,
    examples: PeggyExamples.msgSendToEthExample,
    functionName: "msgSendToEth",
    similes: PeggySimiles.msgSendToEthSimiles,
    validateContent: () => true,
});
// Export all actions as a group
exports.PeggyActions = [exports.GetPeggyModuleParamsAction, exports.MsgSendToEthAction];
