import { createGenericAction } from "./base.ts";
import * as InsuranceTemplates from "@injective/template/insurance";

import * as InsuranceSimiles from "@injective/similes/insurance";
// Query Actions
export const GetInsuranceModuleParamsAction = createGenericAction({
	name: "GET_INSURANCE_MODULE_PARAMS",
	description: "Fetches the insurance module parameters",
	template: InsuranceTemplates.getInsuranceModuleParamsTemplate,
	examples: [],
	similes: InsuranceSimiles.getInsuranceModuleParamsSimiles,
	functionName: "getInsuranceModuleParams",
	validateContent: () => true,
});

export const GetInsuranceFundsAction = createGenericAction({
	name: "GET_INSURANCE_FUNDS",
	description: "Fetches a list of all insurance funds",
	template: InsuranceTemplates.getInsuranceFundsTemplate,
	examples: [],
	similes: InsuranceSimiles.getInsuranceFundsSimiles,
	functionName: "getInsuranceFunds",
	validateContent: () => true,
});

export const GetInsuranceFundAction = createGenericAction({
	name: "GET_INSURANCE_FUND",
	description: "Fetches details of a specific insurance fund by its market ID",
	template: InsuranceTemplates.getInsuranceFundTemplate,
	examples: [],
	similes: InsuranceSimiles.getInsuranceFundSimiles,
	functionName: "getInsuranceFund",
	validateContent: () => true,
});

export const GetEstimatedRedemptionsAction = createGenericAction({
	name: "GET_ESTIMATED_REDEMPTIONS",
	description: "Fetches estimated redemptions based on provided parameters",
	template: InsuranceTemplates.getEstimatedRedemptionsTemplate,
	examples: [],
	similes: InsuranceSimiles.getEstimatedRedemptionsSimiles,
	functionName: "getEstimatedRedemptions",
	validateContent: () => true,
});

export const GetPendingRedemptionsAction = createGenericAction({
	name: "GET_PENDING_REDEMPTIONS",
	description: "Fetches pending redemptions based on provided parameters",
	template: InsuranceTemplates.getPendingRedemptionsTemplate,
	examples: [],
	similes: InsuranceSimiles.getPendingRedemptionsSimiles,
	functionName: "getPendingRedemptions",
	validateContent: () => true,
});

// Message Actions
export const MsgCreateInsuranceFundAction = createGenericAction({
	name: "MSG_CREATE_INSURANCE_FUND",
	description: "Broadcasts a message to create a new insurance fund",
	template: InsuranceTemplates.msgCreateInsuranceFundTemplate,
	examples: [],
	similes: InsuranceSimiles.msgCreateInsuranceFundSimiles,
	functionName: "msgCreateInsuranceFund",
	validateContent: () => true,
});

export const MsgRequestRedemptionAction = createGenericAction({
	name: "MSG_REQUEST_REDEMPTION",
	description:
		"Broadcasts a message to request a redemption from an insurance fund",
	template: InsuranceTemplates.msgRequestRedemptionTemplate,
	examples: [],
	similes: InsuranceSimiles.msgRequestRedemptionSimiles,
	functionName: "msgRequestRedemption",
	validateContent: () => true,
});

export const MsgUnderwriteAction = createGenericAction({
	name: "MSG_UNDERWRITE",
	description: "Broadcasts a message to underwrite an insurance fund",
	template: InsuranceTemplates.msgUnderwriteTemplate,
	examples: [],
	similes: InsuranceSimiles.msgUnderwriteSimiles,
	functionName: "msgUnderwrite",
	validateContent: () => true,
});

// Export all actions as a group
export const InsuranceActions = [
	GetInsuranceModuleParamsAction,
	GetInsuranceFundsAction,
	GetInsuranceFundAction,
	GetEstimatedRedemptionsAction,
	GetPendingRedemptionsAction,
	MsgCreateInsuranceFundAction,
	MsgRequestRedemptionAction,
	MsgUnderwriteAction,
];




