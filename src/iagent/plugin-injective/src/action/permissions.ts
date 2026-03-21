import { createGenericAction } from "./base.ts";
import * as PermissionsTemplates from "@injective/template/permissions";

import * as PermissionsSimiles from "@injective/similes/permissions";
export const GetAddressesByRoleAction = createGenericAction({
	name: "GET_ADDRESSES_BY_ROLE",
	description: "Fetches addresses associated with a specific role",
	template: PermissionsTemplates.getAddressesByRoleTemplate,
	examples: [],
	similes: PermissionsSimiles.getAddressesByRoleSimiles,
	functionName: "getAddressesByRole",
	validateContent: () => true,
});

export const GetAddressRolesAction = createGenericAction({
	name: "GET_ADDRESS_ROLES",
	description: "Retrieves roles associated with a specific address",
	template: PermissionsTemplates.getAddressRolesTemplate,
	examples: [],
	similes: PermissionsSimiles.getAddressRolesSimiles,
	functionName: "getAddressRoles",
	validateContent: () => true,
});

export const GetAllNamespacesAction = createGenericAction({
	name: "GET_ALL_NAMESPACES",
	description: "Retrieves all namespaces within the permissions module",
	template: PermissionsTemplates.getAllNamespacesTemplate,
	examples: [],
	similes: PermissionsSimiles.getAllNamespacesSimiles,
	functionName: "getAllNamespaces",
	validateContent: () => true,
});

export const GetPermissionsModuleParamsAction = createGenericAction({
	name: "GET_PERMISSIONS_MODULE_PARAMS",
	description: "Fetches the parameters of the Permissions module",
	template: PermissionsTemplates.getPermissionsModuleParamsTemplate,
	examples: [],
	similes: PermissionsSimiles.getPermissionsModuleParamsSimiles,
	functionName: "getPermissionsModuleParams",
	validateContent: () => true,
});

export const GetNamespaceByDenomAction = createGenericAction({
	name: "GET_NAMESPACE_BY_DENOM",
	description:
		"Retrieves the namespace associated with a specific denomination",
	template: PermissionsTemplates.getNamespaceByDenomTemplate,
	examples: [],
	similes: PermissionsSimiles.getNamespaceByDenomSimiles,
	functionName: "getNamespaceByDenom",
	validateContent: () => true,
});

export const GetVouchersForAddressAction = createGenericAction({
	name: "GET_VOUCHERS_FOR_ADDRESS",
	description: "Retrieves vouchers associated with a specific address",
	template: PermissionsTemplates.getVouchersForAddressTemplate,
	examples: [],
	similes: PermissionsSimiles.getVouchersForAddressSimiles,
	functionName: "getVouchersForAddress",
	validateContent: () => true,
});

// Export all actions as a group
export const PermissionsActions = [
	GetAddressesByRoleAction,
	GetAddressRolesAction,
	GetAllNamespacesAction,
	GetPermissionsModuleParamsAction,
	GetNamespaceByDenomAction,
	GetVouchersForAddressAction,
];




