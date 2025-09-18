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
exports.GetPaymentsHandler = exports.GetPaymentHandler = void 0;
const cqrs_1 = require("@nestjs/cqrs");
const common_1 = require("@nestjs/common");
const get_payment_query_1 = require("./get-payment.query");
const payment_repository_1 = require("../repositories/payment.repository");
let GetPaymentHandler = class GetPaymentHandler {
    paymentRepository;
    constructor(paymentRepository) {
        this.paymentRepository = paymentRepository;
    }
    async execute(query) {
        return this.paymentRepository.findById(query.id);
    }
};
exports.GetPaymentHandler = GetPaymentHandler;
exports.GetPaymentHandler = GetPaymentHandler = __decorate([
    (0, cqrs_1.QueryHandler)(get_payment_query_1.GetPaymentQuery),
    __param(0, (0, common_1.Inject)('PaymentRepository')),
    __metadata("design:paramtypes", [payment_repository_1.PaymentRepository])
], GetPaymentHandler);
let GetPaymentsHandler = class GetPaymentsHandler {
    paymentRepository;
    constructor(paymentRepository) {
        this.paymentRepository = paymentRepository;
    }
    async execute(query) {
        return this.paymentRepository.findAll(query.page, query.limit, query.status);
    }
};
exports.GetPaymentsHandler = GetPaymentsHandler;
exports.GetPaymentsHandler = GetPaymentsHandler = __decorate([
    (0, cqrs_1.QueryHandler)(get_payment_query_1.GetPaymentsQuery),
    __param(0, (0, common_1.Inject)('PaymentRepository')),
    __metadata("design:paramtypes", [payment_repository_1.PaymentRepository])
], GetPaymentsHandler);
//# sourceMappingURL=get-payment.handler.js.map