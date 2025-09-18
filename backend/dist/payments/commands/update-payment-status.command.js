"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdatePaymentStatusCommand = void 0;
class UpdatePaymentStatusCommand {
    paymentId;
    status;
    transactionId;
    metadata;
    constructor(paymentId, status, transactionId, metadata) {
        this.paymentId = paymentId;
        this.status = status;
        this.transactionId = transactionId;
        this.metadata = metadata;
    }
}
exports.UpdatePaymentStatusCommand = UpdatePaymentStatusCommand;
//# sourceMappingURL=update-payment-status.command.js.map