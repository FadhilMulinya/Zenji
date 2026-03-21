import { createGenericAction } from "./base.ts";
import * as MintTemplates from "@injective/template/mint";

import * as MintSimiles from "@injective/similes/mint";
export const GetMintModuleParamsAction = createGenericAction({
	name: "GET_MINT_MODULE_PARAMS",
	description: "Fetches the parameters of the Mint module",
	template: MintTemplates.getMintModuleParamsTemplate,
	examples: [],
	similes: MintSimiles.getMintModuleParamsSimiles,
	functionName: "getMintModuleParams",
	validateContent: () => true,
});

export const GetInflationAction = createGenericAction({
	name: "GET_INFLATION",
	description: "Retrieves the current inflation rate",
	template: MintTemplates.getInflationTemplate,
	examples: [],
	similes: MintSimiles.getInflationSimiles,
	functionName: "getInflation",
	validateContent: () => true,
});

export const GetAnnualProvisionsAction = createGenericAction({
	name: "GET_ANNUAL_PROVISIONS",
	description: "Obtains the annual provisions",
	template: MintTemplates.getAnnualProvisionsTemplate,
	examples: [],
	similes: MintSimiles.getAnnualProvisionsSimiles,
	functionName: "getAnnualProvisions",
	validateContent: () => true,
});

// Export all actions as a group
export const MintActions = [
	GetMintModuleParamsAction,
	GetInflationAction,
	GetAnnualProvisionsAction,
];




