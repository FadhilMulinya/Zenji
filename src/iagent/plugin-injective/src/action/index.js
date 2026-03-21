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
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InjectiveActions = void 0;
const auction_1 = require("./auction");
const auth_1 = require("./auth");
const bank_1 = require("./bank");
const distribution_1 = require("./distribution");
const exchange_1 = require("./exchange");
const explorer_1 = require("./explorer");
const gov_1 = require("./gov");
const ibc_1 = require("./ibc");
const insurance_1 = require("./insurance");
const mint_1 = require("./mint");
const mito_1 = require("./mito");
const peggy_1 = require("./peggy");
const permissions_1 = require("./permissions");
const staking_1 = require("./staking");
const token_factory_1 = require("./token-factory");
const wasm_1 = require("./wasm");
// Exporting all actions
__exportStar(require("./auction"), exports);
__exportStar(require("./auth"), exports);
__exportStar(require("./bank"), exports);
__exportStar(require("./distribution"), exports);
__exportStar(require("./exchange"), exports);
__exportStar(require("./explorer"), exports);
__exportStar(require("./gov"), exports);
__exportStar(require("./ibc"), exports);
__exportStar(require("./insurance"), exports);
__exportStar(require("./mint"), exports);
__exportStar(require("./mito"), exports);
__exportStar(require("./peggy"), exports);
__exportStar(require("./permissions"), exports);
__exportStar(require("./staking"), exports);
__exportStar(require("./token-factory"), exports);
__exportStar(require("./wasm"), exports);
exports.InjectiveActions = [
    ...exchange_1.ExchangeActions,
    ...auction_1.AuctionActions,
    ...auth_1.AuthActions,
    ...bank_1.BankActions,
    ...distribution_1.DistributionActions,
    ...explorer_1.ExplorerActions,
    ...gov_1.GovActions,
    ...ibc_1.IbcActions,
    ...insurance_1.InsuranceActions,
    ...mint_1.MintActions,
    ...mito_1.MitoActions,
    ...peggy_1.PeggyActions,
    ...permissions_1.PermissionsActions,
    ...staking_1.StakingActions,
    ...token_factory_1.TokenFactoryActions,
    ...wasm_1.WasmActions,
];
exports.default = exports.InjectiveActions;
