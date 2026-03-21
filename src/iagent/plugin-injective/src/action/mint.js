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
exports.MintActions = exports.GetAnnualProvisionsAction = exports.GetInflationAction = exports.GetMintModuleParamsAction = void 0;
const base_1 = require("./base");
const MintTemplates = __importStar(require("@injective/template/mint"));
const MintExamples = __importStar(require("@injective/examples/mint"));
const MintSimiles = __importStar(require("@injective/similes/mint"));
exports.GetMintModuleParamsAction = (0, base_1.createGenericAction)({
    name: "GET_MINT_MODULE_PARAMS",
    description: "Fetches the parameters of the Mint module",
    template: MintTemplates.getMintModuleParamsTemplate,
    examples: MintExamples.getMintModuleParamsExample,
    similes: MintSimiles.getMintModuleParamsSimiles,
    functionName: "getMintModuleParams",
    validateContent: () => true,
});
exports.GetInflationAction = (0, base_1.createGenericAction)({
    name: "GET_INFLATION",
    description: "Retrieves the current inflation rate",
    template: MintTemplates.getInflationTemplate,
    examples: MintExamples.getInflationExample,
    similes: MintSimiles.getInflationSimiles,
    functionName: "getInflation",
    validateContent: () => true,
});
exports.GetAnnualProvisionsAction = (0, base_1.createGenericAction)({
    name: "GET_ANNUAL_PROVISIONS",
    description: "Obtains the annual provisions",
    template: MintTemplates.getAnnualProvisionsTemplate,
    examples: MintExamples.getAnnualProvisionsExample,
    similes: MintSimiles.getAnnualProvisionsSimiles,
    functionName: "getAnnualProvisions",
    validateContent: () => true,
});
// Export all actions as a group
exports.MintActions = [
    exports.GetMintModuleParamsAction,
    exports.GetInflationAction,
    exports.GetAnnualProvisionsAction,
];
