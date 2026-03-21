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
exports.AuthActions = exports.MsgRevokeAction = exports.MsgExecAction = exports.MsgGrantAction = exports.GetGranteeGrantsAction = exports.GetGranterGrantsAction = exports.GetGrantsAction = exports.GetAccountsAction = exports.GetAccountDetailsAction = exports.GetAuthModuleParamsAction = void 0;
const base_1 = require("./base");
const AuthTemplates = __importStar(require("@injective/template/auth"));
const AuthExamples = __importStar(require("@injective/examples/auth"));
const AuthSimilies = __importStar(require("@injective/similes/auth"));
// Auth Module Actions
exports.GetAuthModuleParamsAction = (0, base_1.createGenericAction)({
    name: "GET_AUTH_MODULE_PARAMS",
    description: "Fetches the authentication module parameters",
    template: AuthTemplates.getAuthModuleParamsTemplate,
    examples: AuthExamples.getAuthModuleParamsExample,
    similes: AuthSimilies.getAuthModuleParamsSimiles,
    functionName: "getAuthModuleParams",
    validateContent: () => true,
});
exports.GetAccountDetailsAction = (0, base_1.createGenericAction)({
    name: "GET_ACCOUNT_DETAILS",
    description: "Fetches the details of the current account",
    template: AuthTemplates.getAccountDetailsTemplate,
    examples: AuthExamples.getAccountDetailsExample,
    similes: AuthSimilies.getAccountDetailsSimiles,
    functionName: "getAccountDetails",
    validateContent: () => true,
});
exports.GetAccountsAction = (0, base_1.createGenericAction)({
    name: "GET_ACCOUNTS",
    description: "Fetches all accounts associated with the current address",
    template: AuthTemplates.getAccountsTemplate,
    examples: AuthExamples.getAccountsExample,
    similes: AuthSimilies.getAccountsSimiles,
    functionName: "getAccounts",
    validateContent: () => true,
});
exports.GetGrantsAction = (0, base_1.createGenericAction)({
    name: "GET_GRANTS",
    description: "Fetches all grants based on provided parameters",
    template: AuthTemplates.getGrantsTemplate,
    examples: AuthExamples.getGrantsExample,
    similes: AuthSimilies.getGrantsSimiles,
    functionName: "getGrants",
    validateContent: () => true,
});
exports.GetGranterGrantsAction = (0, base_1.createGenericAction)({
    name: "GET_GRANTER_GRANTS",
    description: "Fetches all grants granted by a specific granter",
    template: AuthTemplates.getGranterGrantsTemplate,
    examples: AuthExamples.getGranterGrantsExample,
    similes: AuthSimilies.getGranterGrantsSimiles,
    functionName: "getGranterGrants",
    validateContent: () => true,
});
exports.GetGranteeGrantsAction = (0, base_1.createGenericAction)({
    name: "GET_GRANTEE_GRANTS",
    description: "Fetches all grants received by a specific grantee",
    template: AuthTemplates.getGranteeGrantsTemplate,
    examples: AuthExamples.getGranteeGrantsExample,
    similes: AuthSimilies.getGranteeGrantsSimiles,
    functionName: "getGranteeGrants",
    validateContent: () => true,
});
exports.MsgGrantAction = (0, base_1.createGenericAction)({
    name: "MSG_GRANT",
    description: "Grants authorization to a grantee to perform specific actions",
    template: AuthTemplates.msgGrantTemplate,
    examples: AuthExamples.msgGrantExample,
    similes: AuthSimilies.msgGrantSimiles,
    functionName: "msgGrant",
    validateContent: () => true,
});
exports.MsgExecAction = (0, base_1.createGenericAction)({
    name: "MSG_EXEC",
    description: "Executes authorized messages on behalf of the grantee",
    template: AuthTemplates.msgExecTemplate,
    examples: AuthExamples.msgExecExample,
    similes: AuthSimilies.msgExecSimiles,
    functionName: "msgExec",
    validateContent: () => true,
});
exports.MsgRevokeAction = (0, base_1.createGenericAction)({
    name: "MSG_REVOKE",
    description: "Revokes previously granted authorizations from a grantee",
    template: AuthTemplates.msgRevokeTemplate,
    examples: AuthExamples.msgRevokeExample,
    similes: AuthSimilies.msgRevokeSimiles,
    functionName: "msgRevoke",
    validateContent: () => true,
});
exports.AuthActions = [
    exports.GetAuthModuleParamsAction,
    exports.GetAccountDetailsAction,
    exports.GetAccountsAction,
    exports.GetGrantsAction,
    exports.GetGranterGrantsAction,
    exports.GetGranteeGrantsAction,
    exports.MsgGrantAction,
    exports.MsgExecAction,
    exports.MsgRevokeAction,
];
