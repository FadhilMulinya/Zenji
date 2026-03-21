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
exports.PermissionsActions = exports.GetVouchersForAddressAction = exports.GetNamespaceByDenomAction = exports.GetPermissionsModuleParamsAction = exports.GetAllNamespacesAction = exports.GetAddressRolesAction = exports.GetAddressesByRoleAction = void 0;
const base_1 = require("./base");
const PermissionsTemplates = __importStar(require("@injective/template/permissions"));
const PermissionsExamples = __importStar(require("@injective/examples/permissions"));
const PermissionsSimiles = __importStar(require("@injective/similes/permissions"));
exports.GetAddressesByRoleAction = (0, base_1.createGenericAction)({
    name: "GET_ADDRESSES_BY_ROLE",
    description: "Fetches addresses associated with a specific role",
    template: PermissionsTemplates.getAddressesByRoleTemplate,
    examples: PermissionsExamples.getAddressesByRoleExample,
    similes: PermissionsSimiles.getAddressesByRoleSimiles,
    functionName: "getAddressesByRole",
    validateContent: () => true,
});
exports.GetAddressRolesAction = (0, base_1.createGenericAction)({
    name: "GET_ADDRESS_ROLES",
    description: "Retrieves roles associated with a specific address",
    template: PermissionsTemplates.getAddressRolesTemplate,
    examples: PermissionsExamples.getAddressRolesExample,
    similes: PermissionsSimiles.getAddressRolesSimiles,
    functionName: "getAddressRoles",
    validateContent: () => true,
});
exports.GetAllNamespacesAction = (0, base_1.createGenericAction)({
    name: "GET_ALL_NAMESPACES",
    description: "Retrieves all namespaces within the permissions module",
    template: PermissionsTemplates.getAllNamespacesTemplate,
    examples: PermissionsExamples.getAllNamespacesExample,
    similes: PermissionsSimiles.getAllNamespacesSimiles,
    functionName: "getAllNamespaces",
    validateContent: () => true,
});
exports.GetPermissionsModuleParamsAction = (0, base_1.createGenericAction)({
    name: "GET_PERMISSIONS_MODULE_PARAMS",
    description: "Fetches the parameters of the Permissions module",
    template: PermissionsTemplates.getPermissionsModuleParamsTemplate,
    examples: PermissionsExamples.getPermissionsModuleParamsExample,
    similes: PermissionsSimiles.getPermissionsModuleParamsSimiles,
    functionName: "getPermissionsModuleParams",
    validateContent: () => true,
});
exports.GetNamespaceByDenomAction = (0, base_1.createGenericAction)({
    name: "GET_NAMESPACE_BY_DENOM",
    description: "Retrieves the namespace associated with a specific denomination",
    template: PermissionsTemplates.getNamespaceByDenomTemplate,
    examples: PermissionsExamples.getNamespaceByDenomExample,
    similes: PermissionsSimiles.getNamespaceByDenomSimiles,
    functionName: "getNamespaceByDenom",
    validateContent: () => true,
});
exports.GetVouchersForAddressAction = (0, base_1.createGenericAction)({
    name: "GET_VOUCHERS_FOR_ADDRESS",
    description: "Retrieves vouchers associated with a specific address",
    template: PermissionsTemplates.getVouchersForAddressTemplate,
    examples: PermissionsExamples.getVouchersForAddressExample,
    similes: PermissionsSimiles.getVouchersForAddressSimiles,
    functionName: "getVouchersForAddress",
    validateContent: () => true,
});
// Export all actions as a group
exports.PermissionsActions = [
    exports.GetAddressesByRoleAction,
    exports.GetAddressRolesAction,
    exports.GetAllNamespacesAction,
    exports.GetPermissionsModuleParamsAction,
    exports.GetNamespaceByDenomAction,
    exports.GetVouchersForAddressAction,
];
