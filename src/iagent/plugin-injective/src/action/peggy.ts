import { createGenericAction } from "./base.ts";
import * as PeggyTemplates from "@injective/template/peggy";

import * as PeggySimiles from "@injective/similes/peggy";
// Query Actions
export const GetPeggyModuleParamsAction = createGenericAction({
	name: "GET_PEGGY_MODULE_PARAMS",
	description: "Fetches the parameters of the Peggy module",
	template: PeggyTemplates.getPeggyModuleParamsTemplate,
	examples: [],
	functionName: "getPeggyModuleParams",
	similes: PeggySimiles.getPeggyModuleParamsSimiles,
	validateContent: () => true,
});

// Message Actions
export const MsgSendToEthAction = createGenericAction({
	name: "MSG_SEND_TO_ETH",
	description:
		"Broadcasts a message to send tokens to an Ethereum address via IBC transfer",
	template: PeggyTemplates.msgSendToEthTemplate,
	examples: [],
	functionName: "msgSendToEth",
	similes: PeggySimiles.msgSendToEthSimiles,
	validateContent: () => true,
});

// Export all actions as a group
export const PeggyActions = [GetPeggyModuleParamsAction, MsgSendToEthAction];




