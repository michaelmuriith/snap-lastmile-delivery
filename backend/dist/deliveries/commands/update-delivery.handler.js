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
exports.UpdateDeliveryStatusHandler = exports.AssignDriverHandler = exports.UpdateDeliveryHandler = void 0;
const cqrs_1 = require("@nestjs/cqrs");
const common_1 = require("@nestjs/common");
const update_delivery_command_1 = require("./update-delivery.command");
const delivery_repository_1 = require("../repositories/delivery.repository");
let UpdateDeliveryHandler = class UpdateDeliveryHandler {
    deliveryRepository;
    constructor(deliveryRepository) {
        this.deliveryRepository = deliveryRepository;
    }
    async execute(command) {
        const { id, updateData } = command;
        return this.deliveryRepository.update(id, updateData);
    }
};
exports.UpdateDeliveryHandler = UpdateDeliveryHandler;
exports.UpdateDeliveryHandler = UpdateDeliveryHandler = __decorate([
    (0, cqrs_1.CommandHandler)(update_delivery_command_1.UpdateDeliveryCommand),
    __param(0, (0, common_1.Inject)('DeliveryRepository')),
    __metadata("design:paramtypes", [delivery_repository_1.DeliveryRepository])
], UpdateDeliveryHandler);
let AssignDriverHandler = class AssignDriverHandler {
    deliveryRepository;
    constructor(deliveryRepository) {
        this.deliveryRepository = deliveryRepository;
    }
    async execute(command) {
        const { deliveryId, driverId } = command;
        return this.deliveryRepository.update(deliveryId, {
            driverId,
            status: 'assigned',
        });
    }
};
exports.AssignDriverHandler = AssignDriverHandler;
exports.AssignDriverHandler = AssignDriverHandler = __decorate([
    (0, cqrs_1.CommandHandler)(update_delivery_command_1.AssignDriverCommand),
    __param(0, (0, common_1.Inject)('DeliveryRepository')),
    __metadata("design:paramtypes", [delivery_repository_1.DeliveryRepository])
], AssignDriverHandler);
let UpdateDeliveryStatusHandler = class UpdateDeliveryStatusHandler {
    deliveryRepository;
    constructor(deliveryRepository) {
        this.deliveryRepository = deliveryRepository;
    }
    async execute(command) {
        const { deliveryId, status, estimatedDeliveryTime, actualDeliveryTime } = command;
        return this.deliveryRepository.update(deliveryId, {
            status: status,
            estimatedDeliveryTime,
            actualDeliveryTime,
        });
    }
};
exports.UpdateDeliveryStatusHandler = UpdateDeliveryStatusHandler;
exports.UpdateDeliveryStatusHandler = UpdateDeliveryStatusHandler = __decorate([
    (0, cqrs_1.CommandHandler)(update_delivery_command_1.UpdateDeliveryStatusCommand),
    __param(0, (0, common_1.Inject)('DeliveryRepository')),
    __metadata("design:paramtypes", [delivery_repository_1.DeliveryRepository])
], UpdateDeliveryStatusHandler);
//# sourceMappingURL=update-delivery.handler.js.map