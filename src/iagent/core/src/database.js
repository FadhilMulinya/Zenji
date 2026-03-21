"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseAdapter = void 0;
const CircuitBreaker_1 = require("./database/CircuitBreaker");
const logger_1 = require("./logger");
/**
 * An abstract class representing a database adapter for managing various entities
 * like accounts, memories, actors, goals, and rooms.
 */
class DatabaseAdapter {
    /**
     * Creates a new DatabaseAdapter instance with optional circuit breaker configuration.
     *
     * @param circuitBreakerConfig - Configuration options for the circuit breaker
     * @param circuitBreakerConfig.failureThreshold - Number of failures before circuit opens (defaults to 5)
     * @param circuitBreakerConfig.resetTimeout - Time in ms before attempting to close circuit (defaults to 60000)
     * @param circuitBreakerConfig.halfOpenMaxAttempts - Number of successful attempts needed to close circuit (defaults to 3)
     */
    constructor(circuitBreakerConfig) {
        this.circuitBreaker = new CircuitBreaker_1.CircuitBreaker(circuitBreakerConfig);
    }
    /**
     * Executes an operation with circuit breaker protection.
     * @param operation A function that returns a Promise to be executed with circuit breaker protection
     * @param context A string describing the context/operation being performed for logging purposes
     * @returns A Promise that resolves to the result of the operation
     * @throws Will throw an error if the circuit breaker is open or if the operation fails
     * @protected
     */
    async withCircuitBreaker(operation, context) {
        try {
            return await this.circuitBreaker.execute(operation);
        }
        catch (error) {
            logger_1.elizaLogger.error(`Circuit breaker error in ${context}:`, {
                error: error instanceof Error ? error.message : String(error),
                state: this.circuitBreaker.getState(),
            });
            throw error;
        }
    }
}
exports.DatabaseAdapter = DatabaseAdapter;
