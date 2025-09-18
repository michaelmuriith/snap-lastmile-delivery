"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentsModule = void 0;
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const database_module_1 = require("../database/database.module");
const payment_repository_1 = require("./repositories/payment.repository");
const create_payment_handler_1 = require("./commands/create-payment.handler");
const update_payment_status_handler_1 = require("./commands/update-payment-status.handler");
const get_payment_handler_1 = require("./queries/get-payment.handler");
const payments_controller_1 = require("./payments.controller");
let PaymentsModule = class PaymentsModule {
};
exports.PaymentsModule = PaymentsModule;
exports.PaymentsModule = PaymentsModule = __decorate([
    (0, common_1.Module)({
        imports: [cqrs_1.CqrsModule, database_module_1.DatabaseModule],
        controllers: [payments_controller_1.PaymentsController],
        providers: [
            {
                provide: 'PaymentRepository',
                useClass: payment_repository_1.PaymentRepository,
            },
            create_payment_handler_1.CreatePaymentHandler,
            update_payment_status_handler_1.UpdatePaymentStatusHandler,
            get_payment_handler_1.GetPaymentHandler,
        ],
        exports: ['PaymentRepository'],
    })
], PaymentsModule);
//# sourceMappingURL=payments.module.js.map