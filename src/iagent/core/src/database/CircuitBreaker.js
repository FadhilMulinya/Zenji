"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CircuitBreaker = void 0;
class CircuitBreaker {
    constructor(config = {}) {
        this.config = config;
        this.state = "CLOSED";
        this.failureCount = 0;
        this.halfOpenSuccesses = 0;
        this.failureThreshold = config.failureThreshold ?? 5;
        this.resetTimeout = config.resetTimeout ?? 60000;
        this.halfOpenMaxAttempts = config.halfOpenMaxAttempts ?? 3;
    }
    async execute(operation) {
        if (this.state === "OPEN") {
            if (Date.now() - (this.lastFailureTime || 0) > this.resetTimeout) {
                this.state = "HALF_OPEN";
                this.halfOpenSuccesses = 0;
            }
            else {
                throw new Error("Circuit breaker is OPEN");
            }
        }
        try {
            const result = await operation();
            if (this.state === "HALF_OPEN") {
                this.halfOpenSuccesses++;
                if (this.halfOpenSuccesses >= this.halfOpenMaxAttempts) {
                    this.reset();
                }
            }
            return result;
        }
        catch (error) {
            this.handleFailure();
            throw error;
        }
    }
    handleFailure() {
        this.failureCount++;
        this.lastFailureTime = Date.now();
        if (this.state !== "OPEN" &&
            this.failureCount >= this.failureThreshold) {
            this.state = "OPEN";
        }
    }
    reset() {
        this.state = "CLOSED";
        this.failureCount = 0;
        this.lastFailureTime = undefined;
    }
    getState() {
        return this.state;
    }
}
exports.CircuitBreaker = CircuitBreaker;
