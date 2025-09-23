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
exports.DeliveriesController = void 0;
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const create_delivery_dto_1 = require("./dto/create-delivery.dto");
const create_delivery_command_1 = require("./commands/create-delivery.command");
const update_delivery_command_1 = require("./commands/update-delivery.command");
const get_delivery_query_1 = require("./queries/get-delivery.query");
let DeliveriesController = class DeliveriesController {
    commandBus;
    queryBus;
    constructor(commandBus, queryBus) {
        this.commandBus = commandBus;
        this.queryBus = queryBus;
    }
    async createDelivery(createDeliveryDto) {
        const command = new create_delivery_command_1.CreateDeliveryCommand({
            customerId: createDeliveryDto.customerId,
            type: createDeliveryDto.type,
            pickupAddress: createDeliveryDto.pickupAddress,
            pickupLatitude: createDeliveryDto.pickupLatitude,
            pickupLongitude: createDeliveryDto.pickupLongitude,
            deliveryAddress: createDeliveryDto.deliveryAddress,
            deliveryLatitude: createDeliveryDto.deliveryLatitude,
            deliveryLongitude: createDeliveryDto.deliveryLongitude,
            packageDescription: createDeliveryDto.packageDescription,
            packageValue: createDeliveryDto.packageValue,
            recipientName: createDeliveryDto.recipientName,
            recipientPhone: createDeliveryDto.recipientPhone,
        });
        return this.commandBus.execute(command);
    }
    async getDelivery(id) {
        const query = new get_delivery_query_1.GetDeliveryQuery(id);
        return this.queryBus.execute(query);
    }
    async getDeliveries(customerId, driverId, status, page, limit) {
        const query = new get_delivery_query_1.GetDeliveriesQuery(customerId, driverId, status, page ? parseInt(page, 10) : 1, limit ? parseInt(limit, 10) : 10);
        return this.queryBus.execute(query);
    }
    async assignDriver(deliveryId, driverId) {
        const command = new update_delivery_command_1.AssignDriverCommand(deliveryId, driverId);
        return this.commandBus.execute(command);
    }
    async updateDeliveryStatus(deliveryId, status, estimatedDeliveryTime, actualDeliveryTime) {
        const command = new update_delivery_command_1.UpdateDeliveryStatusCommand(deliveryId, status, estimatedDeliveryTime, actualDeliveryTime);
        return this.commandBus.execute(command);
    }
};
exports.DeliveriesController = DeliveriesController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)('customer'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_delivery_dto_1.CreateDeliveryDto]),
    __metadata("design:returntype", Promise)
], DeliveriesController.prototype, "createDelivery", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, roles_decorator_1.Roles)('customer', 'driver', 'admin'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DeliveriesController.prototype, "getDelivery", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)('customer', 'driver', 'admin'),
    __param(0, (0, common_1.Query)('customerId')),
    __param(1, (0, common_1.Query)('driverId')),
    __param(2, (0, common_1.Query)('status')),
    __param(3, (0, common_1.Query)('page')),
    __param(4, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], DeliveriesController.prototype, "getDeliveries", null);
__decorate([
    (0, common_1.Put)(':id/assign-driver'),
    (0, roles_decorator_1.Roles)('admin'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('driverId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], DeliveriesController.prototype, "assignDriver", null);
__decorate([
    (0, common_1.Patch)(':id/status'),
    (0, roles_decorator_1.Roles)('driver', 'admin'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('status')),
    __param(2, (0, common_1.Body)('estimatedDeliveryTime')),
    __param(3, (0, common_1.Body)('actualDeliveryTime')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Date,
        Date]),
    __metadata("design:returntype", Promise)
], DeliveriesController.prototype, "updateDeliveryStatus", null);
exports.DeliveriesController = DeliveriesController = __decorate([
    (0, common_1.Controller)('deliveries'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [typeof (_a = typeof cqrs_1.CommandBus !== "undefined" && cqrs_1.CommandBus) === "function" ? _a : Object, typeof (_b = typeof cqrs_1.QueryBus !== "undefined" && cqrs_1.QueryBus) === "function" ? _b : Object])
], DeliveriesController);
//# sourceMappingURL=deliveries.controller.js.map