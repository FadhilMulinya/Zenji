import { createGenericAction } from "./base.ts";
import * as AuthTemplates from "@injective/template/auth";

import * as AuthSimilies from "@injective/similes/auth";
// Auth Module Actions
export const GetAuthModuleParamsAction = createGenericAction({
	name: "GET_AUTH_MODULE_PARAMS",
	description: "Fetches the authentication module parameters",
	template: AuthTemplates.getAuthModuleParamsTemplate,
	examples: [],
	similes: AuthSimilies.getAuthModuleParamsSimiles,
	functionName: "getAuthModuleParams",
	validateContent: () => true,
});

export const GetAccountDetailsAction = createGenericAction({
	name: "GET_ACCOUNT_DETAILS",
	description: "Fetches the details of the current account",
	template: AuthTemplates.getAccountDetailsTemplate,
	examples: [],
	similes: AuthSimilies.getAccountDetailsSimiles,
	functionName: "getAccountDetails",
	validateContent: () => true,
});

export const GetAccountsAction = createGenericAction({
	name: "GET_ACCOUNTS",
	description: "Fetches all accounts associated with the current address",
	template: AuthTemplates.getAccountsTemplate,
	examples: [],
	similes: AuthSimilies.getAccountsSimiles,
	functionName: "getAccounts",
	validateContent: () => true,
});

export const GetGrantsAction = createGenericAction({
	name: "GET_GRANTS",
	description: "Fetches all grants based on provided parameters",
	template: AuthTemplates.getGrantsTemplate,
	examples: [],
	similes: AuthSimilies.getGrantsSimiles,
	functionName: "getGrants",
	validateContent: () => true,
});

export const GetGranterGrantsAction = createGenericAction({
	name: "GET_GRANTER_GRANTS",
	description: "Fetches all grants granted by a specific granter",
	template: AuthTemplates.getGranterGrantsTemplate,
	examples: [],
	similes: AuthSimilies.getGranterGrantsSimiles,
	functionName: "getGranterGrants",
	validateContent: () => true,
});

export const GetGranteeGrantsAction = createGenericAction({
	name: "GET_GRANTEE_GRANTS",
	description: "Fetches all grants received by a specific grantee",
	template: AuthTemplates.getGranteeGrantsTemplate,
	examples: [],
	similes: AuthSimilies.getGranteeGrantsSimiles,
	functionName: "getGranteeGrants",
	validateContent: () => true,
});

export const MsgGrantAction = createGenericAction({
	name: "MSG_GRANT",
	description: "Grants authorization to a grantee to perform specific actions",
	template: AuthTemplates.msgGrantTemplate,
	examples: [],
	similes: AuthSimilies.msgGrantSimiles,
	functionName: "msgGrant",
	validateContent: () => true,
});

export const MsgExecAction = createGenericAction({
	name: "MSG_EXEC",
	description: "Executes authorized messages on behalf of the grantee",
	template: AuthTemplates.msgExecTemplate,
	examples: [],
	similes: AuthSimilies.msgExecSimiles,
	functionName: "msgExec",
	validateContent: () => true,
});

export const MsgRevokeAction = createGenericAction({
	name: "MSG_REVOKE",
	description: "Revokes previously granted authorizations from a grantee",
	template: AuthTemplates.msgRevokeTemplate,
	examples: [],
	similes: AuthSimilies.msgRevokeSimiles,
	functionName: "msgRevoke",
	validateContent: () => true,
});

export const AuthActions = [
	GetAuthModuleParamsAction,
	GetAccountDetailsAction,
	GetAccountsAction,
	GetGrantsAction,
	GetGranterGrantsAction,
	GetGranteeGrantsAction,
	MsgGrantAction,
	MsgExecAction,
	MsgRevokeAction,
];




