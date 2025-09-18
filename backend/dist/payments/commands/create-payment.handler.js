"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreatePaymentHandler = void 0;
const cqrs_1 = require("@nestjs/cqrs");
const common_1 = require("@nestjs/common");
const create_payment_command_1 = require("./create-payment.command");
const payment_repository_1 = require("../repositories/payment.repository");
let CreatePaymentHandler = class CreatePaymentHandler {
    paymentRepository;
    constructor(paymentRepository) {
        this.paymentRepository = paymentRepository;
    }
    async execute(command) {
        const { paymentData } = command;
        return this.paymentRepository.create(paymentData);
    }
};
exports.CreatePaymentHandler = CreatePaymentHandler;
exports.CreatePaymentHandler = CreatePaymentHandler = __decorate([
    (0, cqrs_1.CommandHandler)(create_payment_command_1.CreatePaymentCommand),
    __param(0, (0, common_1.Inject)('PaymentRepository')),
    __metadata("design:paramtypes", [payment_repository_1.PaymentRepository])
], CreatePaymentHandler);
//# sourceMappingURL=create-payment.handler.js.map