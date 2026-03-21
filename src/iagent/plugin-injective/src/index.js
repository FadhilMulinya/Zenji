"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.injectivePlugin = void 0;
const action_1 = __importDefault(require("./action"));
exports.injectivePlugin = {
    name: "injective",
    description: "A plugin for interacting with the Injective blockchain",
    actions: action_1.default,
    evaluators: [],
    providers: [], //TODO: Integrate with injective-trader to run MM and Taking Strats
};
exports.default = exports.injectivePlugin;
