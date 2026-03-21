// import { AuctionActions } from "./auction.ts";
import { AuthActions } from "./auth.ts";
import { BankActions } from "./bank.ts";
import { DistributionActions } from "./distribution.ts";
import { ExchangeActions } from "./exchange.ts";
import { ExplorerActions } from "./explorer.ts";
import { GovActions } from "./gov.ts";
import { IbcActions } from "./ibc.ts";
import { InsuranceActions } from "./insurance.ts";
import { MintActions } from "./mint.ts";
// import { MitoActions } from "./mito.ts";
import { PeggyActions } from "./peggy.ts";
import { PermissionsActions } from "./permissions.ts";
import { StakingActions } from "./staking.ts";
// import { TokenFactoryActions } from "./token-factory.ts";
// import { WasmActions } from "./wasm.ts";
// Exporting all actions
export * from "./auction.ts";
export * from "./auth.ts";
export * from "./bank.ts";
export * from "./distribution.ts";
export * from "./exchange.ts";
export * from "./explorer.ts";
export * from "./gov.ts";
export * from "./ibc.ts";
export * from "./insurance.ts";
export * from "./mint.ts";
export * from "./mito.ts";
export * from "./peggy.ts";
export * from "./permissions.ts";
export * from "./staking.ts";
export * from "./token-factory.ts";
export * from "./wasm.ts";

export const InjectiveActions = [
	...ExchangeActions,
	// ...AuctionActions,
	...AuthActions,
	...BankActions,
	...DistributionActions,
	...ExplorerActions,
	...GovActions,
	...IbcActions,
	...InsuranceActions,
	...MintActions,
	// ...MitoActions,
	...PeggyActions,
	...PermissionsActions,
	...StakingActions,
	// ...TokenFactoryActions,
	// ...WasmActions,
];

export default InjectiveActions;




