// @ts-nocheck
export * from "./base.ts";
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

// Generic Standard Response
export interface StandardResponse<T = any> {
	success: boolean;
	result: T;
}

// Helper functions with generic success type parameter
export function createSuccessResponse<T>(data: T): StandardResponse<T> {
	return {
		success: true,
		result: data,
	};
}
// Helper functions with generic error type parameter
export function createErrorResponse(
	code: string,
	details?: unknown,
): StandardResponse {
	return {
		success: false,
		result: {
			code,
			details,
		},
	};
}



