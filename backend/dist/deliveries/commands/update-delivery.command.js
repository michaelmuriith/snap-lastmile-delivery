"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateDeliveryStatusCommand = exports.AssignDriverCommand = exports.UpdateDeliveryCommand = void 0;
class UpdateDeliveryCommand {
    id;
    updateData;
    constructor(id, updateData) {
        this.id = id;
        this.updateData = updateData;
    }
}
exports.UpdateDeliveryCommand = UpdateDeliveryCommand;
class AssignDriverCommand {
    deliveryId;
    driverId;
    constructor(deliveryId, driverId) {
        this.deliveryId = deliveryId;
        this.driverId = driverId;
    }
}
exports.AssignDriverCommand = AssignDriverCommand;
class UpdateDeliveryStatusCommand {
    deliveryId;
    status;
    estimatedDeliveryTime;
    actualDeliveryTime;
    constructor(deliveryId, status, estimatedDeliveryTime, actualDeliveryTime) {
        this.deliveryId = deliveryId;
        this.status = status;
        this.estimatedDeliveryTime = estimatedDeliveryTime;
        this.actualDeliveryTime = actualDeliveryTime;
    }
}
exports.UpdateDeliveryStatusCommand = UpdateDeliveryStatusCommand;
//# sourceMappingURL=update-delivery.command.js.map