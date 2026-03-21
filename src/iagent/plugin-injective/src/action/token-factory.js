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
exports.TokenFactoryActions = exports.MsgSetDenomMetadataAction = exports.MsgMintAction = exports.MsgCreateDenomAction = exports.MsgChangeAdminAction = exports.MsgBurnAction = exports.GetTokenFactoryModuleStateAction = exports.GetTokenFactoryModuleParamsAction = exports.GetDenomAuthorityMetadataAction = exports.GetDenomsFromCreatorAction = void 0;
const base_1 = require("./base");
const TokenFactoryTemplates = __importStar(require("@injective/template/token-factory"));
const TokenFactoryExamples = __importStar(require("@injective/examples/token-factory"));
const TokenFactorySimiles = __importStar(require("@injective/similes/token-factory"));
// Query Actions
exports.GetDenomsFromCreatorAction = (0, base_1.createGenericAction)({
    name: "GET_DENOMS_FROM_CREATOR",
    description: "Fetches all denominations created by a specific creator",
    template: TokenFactoryTemplates.getDenomsFromCreatorTemplate,
    examples: TokenFactoryExamples.getDenomsFromCreatorExample,
    similes: TokenFactorySimiles.getDenomsFromCreatorSimiles,
    functionName: "getDenomsFromCreator",
    validateContent: () => true,
});
exports.GetDenomAuthorityMetadataAction = (0, base_1.createGenericAction)({
    name: "GET_DENOM_AUTHORITY_METADATA",
    description: "Fetches the authority metadata for a specific denomination",
    template: TokenFactoryTemplates.getDenomAuthorityMetadataTemplate,
    examples: TokenFactoryExamples.getDenomAuthorityMetadataExample,
    similes: TokenFactorySimiles.getDenomAuthorityMetadataSimiles,
    functionName: "getDenomAuthorityMetadata",
    validateContent: () => true,
});
exports.GetTokenFactoryModuleParamsAction = (0, base_1.createGenericAction)({
    name: "GET_TOKEN_FACTORY_MODULE_PARAMS",
    description: "Fetches the parameters of the Token Factory module",
    template: TokenFactoryTemplates.getTokenFactoryModuleParamsTemplate,
    examples: TokenFactoryExamples.getTokenFactoryModuleParamsExample,
    similes: TokenFactorySimiles.getTokenFactoryModuleParamsSimiles,
    functionName: "getTokenFactoryModuleParams",
    validateContent: () => true,
});
exports.GetTokenFactoryModuleStateAction = (0, base_1.createGenericAction)({
    name: "GET_TOKEN_FACTORY_MODULE_STATE",
    description: "Fetches the current state of the Token Factory module",
    template: TokenFactoryTemplates.getTokenFactoryModuleStateTemplate,
    examples: TokenFactoryExamples.getTokenFactoryModuleStateExample,
    similes: TokenFactorySimiles.getTokenFactoryModuleStateSimiles,
    functionName: "getTokenFactoryModuleState",
    validateContent: () => true,
});
// Message Actions
exports.MsgBurnAction = (0, base_1.createGenericAction)({
    name: "MSG_BURN",
    description: "Broadcasts a message to burn tokens",
    template: TokenFactoryTemplates.msgBurnTemplate,
    examples: TokenFactoryExamples.msgBurnExample,
    similes: TokenFactorySimiles.msgBurnSimiles,
    functionName: "msgBurn",
    validateContent: () => true,
});
exports.MsgChangeAdminAction = (0, base_1.createGenericAction)({
    name: "MSG_CHANGE_ADMIN",
    description: "Broadcasts a message to change the admin of a denomination",
    template: TokenFactoryTemplates.msgChangeAdminTemplate,
    examples: TokenFactoryExamples.msgChangeAdminExample,
    similes: TokenFactorySimiles.msgChangeAdminSimiles,
    functionName: "msgChangeAdmin",
    validateContent: () => true,
});
exports.MsgCreateDenomAction = (0, base_1.createGenericAction)({
    name: "MSG_CREATE_DENOM",
    description: "Broadcasts a message to create a new denomination",
    template: TokenFactoryTemplates.msgCreateDenomTemplate,
    examples: TokenFactoryExamples.msgCreateDenomExample,
    similes: TokenFactorySimiles.msgCreateDenomSimiles,
    functionName: "msgCreateDenom",
    validateContent: () => true,
});
exports.MsgMintAction = (0, base_1.createGenericAction)({
    name: "MSG_MINT",
    description: "Broadcasts a message to mint new tokens",
    template: TokenFactoryTemplates.msgMintTemplate,
    examples: TokenFactoryExamples.msgMintExample,
    similes: TokenFactorySimiles.msgMintSimiles,
    functionName: "msgMint",
    validateContent: () => true,
});
exports.MsgSetDenomMetadataAction = (0, base_1.createGenericAction)({
    name: "MSG_SET_DENOM_METADATA",
    description: "Broadcasts a message to set metadata for a denomination",
    template: TokenFactoryTemplates.msgSetDenomMetadataTemplate,
    examples: TokenFactoryExamples.msgSetDenomMetadataExample,
    similes: TokenFactorySimiles.msgSetDenomMetadataSimiles,
    functionName: "msgSetDenomMetadata",
    validateContent: () => true,
});
// Export all actions as a group
exports.TokenFactoryActions = [
    // Query Actions
    exports.GetDenomsFromCreatorAction,
    exports.GetDenomAuthorityMetadataAction,
    exports.GetTokenFactoryModuleParamsAction,
    exports.GetTokenFactoryModuleStateAction,
    // Message Actions
    exports.MsgBurnAction,
    exports.MsgChangeAdminAction,
    exports.MsgCreateDenomAction,
    exports.MsgMintAction,
    exports.MsgSetDenomMetadataAction,
];
