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
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentsController = void 0;
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const create_payment_dto_1 = require("./dto/create-payment.dto");
const create_payment_command_1 = require("./commands/create-payment.command");
const update_payment_status_command_1 = require("./commands/update-payment-status.command");
const get_payment_query_1 = require("./queries/get-payment.query");
let PaymentsController = class PaymentsController {
    commandBus;
    queryBus;
    constructor(commandBus, queryBus) {
        this.commandBus = commandBus;
        this.queryBus = queryBus;
    }
    async createPayment(createPaymentDto) {
        const command = new create_payment_command_1.CreatePaymentCommand({
            deliveryId: createPaymentDto.deliveryId,
            customerId: createPaymentDto.customerId,
            amount: createPaymentDto.amount,
            currency: createPaymentDto.currency,
            paymentMethod: createPaymentDto.paymentMethod,
            paymentGateway: createPaymentDto.paymentGateway,
        });
        return this.commandBus.execute(command);
    }
    async getPayment(id) {
        const query = new get_payment_query_1.GetPaymentQuery(id);
        return this.queryBus.execute(query);
    }
    async getPayments(customerId, deliveryId, status, page, limit) {
        const query = new get_payment_query_1.GetPaymentsQuery(customerId, deliveryId, status, page ? parseInt(page, 10) : 1, limit ? parseInt(limit, 10) : 10);
        return this.queryBus.execute(query);
    }
    async updatePaymentStatus(id, body) {
        const command = new update_payment_status_command_1.UpdatePaymentStatusCommand(id, body.status, body.transactionId, body.metadata);
        return this.commandBus.execute(command);
    }
};
exports.PaymentsController = PaymentsController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)('customer'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_payment_dto_1.CreatePaymentDto]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "createPayment", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, roles_decorator_1.Roles)('customer', 'admin'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "getPayment", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)('admin'),
    __param(0, (0, common_1.Query)('customerId')),
    __param(1, (0, common_1.Query)('deliveryId')),
    __param(2, (0, common_1.Query)('status')),
    __param(3, (0, common_1.Query)('page')),
    __param(4, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "getPayments", null);
__decorate([
    (0, common_1.Patch)(':id/status'),
    (0, roles_decorator_1.Roles)('admin'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "updatePaymentStatus", null);
exports.PaymentsController = PaymentsController = __decorate([
    (0, common_1.Controller)('payments'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [typeof (_a = typeof cqrs_1.CommandBus !== "undefined" && cqrs_1.CommandBus) === "function" ? _a : Object, typeof (_b = typeof cqrs_1.QueryBus !== "undefined" && cqrs_1.QueryBus) === "function" ? _b : Object])
], PaymentsController);
//# sourceMappingURL=payments.controller.js.map