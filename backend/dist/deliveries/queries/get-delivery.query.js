"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetDeliveriesQuery = exports.GetDeliveryQuery = void 0;
class GetDeliveryQuery {
    id;
    constructor(id) {
        this.id = id;
    }
}
exports.GetDeliveryQuery = GetDeliveryQuery;
class GetDeliveriesQuery {
    customerId;
    driverId;
    status;
    page;
    limit;
    constructor(customerId, driverId, status, page = 1, limit = 10) {
        this.customerId = customerId;
        this.driverId = driverId;
        this.status = status;
        this.page = page;
        this.limit = limit;
    }
}
exports.GetDeliveriesQuery = GetDeliveriesQuery;
//# sourceMappingURL=get-delivery.query.js.map