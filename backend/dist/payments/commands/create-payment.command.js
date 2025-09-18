"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdatePaymentStatusCommand = exports.CreatePaymentCommand = void 0;
class CreatePaymentCommand {
    paymentData;
    constructor(paymentData) {
        this.paymentData = paymentData;
    }
}
exports.CreatePaymentCommand = CreatePaymentCommand;
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
//# sourceMappingURL=create-payment.command.js.map