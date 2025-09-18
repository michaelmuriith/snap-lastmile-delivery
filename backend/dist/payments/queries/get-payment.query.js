"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetPaymentsQuery = exports.GetPaymentQuery = void 0;
class GetPaymentQuery {
    id;
    constructor(id) {
        this.id = id;
    }
}
exports.GetPaymentQuery = GetPaymentQuery;
class GetPaymentsQuery {
    customerId;
    deliveryId;
    status;
    page;
    limit;
    constructor(customerId, deliveryId, status, page = 1, limit = 10) {
        this.customerId = customerId;
        this.deliveryId = deliveryId;
        this.status = status;
        this.page = page;
        this.limit = limit;
    }
}
exports.GetPaymentsQuery = GetPaymentsQuery;
//# sourceMappingURL=get-payment.query.js.map