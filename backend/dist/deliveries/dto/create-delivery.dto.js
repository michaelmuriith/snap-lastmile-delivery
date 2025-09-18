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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateDeliveryDto = exports.DeliveryTypeEnum = void 0;
const class_validator_1 = require("class-validator");
var DeliveryTypeEnum;
(function (DeliveryTypeEnum) {
    DeliveryTypeEnum["SEND"] = "send";
    DeliveryTypeEnum["RECEIVE"] = "receive";
    DeliveryTypeEnum["STORE_PICKUP"] = "store_pickup";
})(DeliveryTypeEnum || (exports.DeliveryTypeEnum = DeliveryTypeEnum = {}));
class CreateDeliveryDto {
    customerId;
    type;
    pickupAddress;
    pickupLatitude;
    pickupLongitude;
    deliveryAddress;
    deliveryLatitude;
    deliveryLongitude;
    packageDescription;
    packageValue;
    recipientName;
    recipientPhone;
}
exports.CreateDeliveryDto = CreateDeliveryDto;
__decorate([
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateDeliveryDto.prototype, "customerId", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(DeliveryTypeEnum),
    __metadata("design:type", String)
], CreateDeliveryDto.prototype, "type", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateDeliveryDto.prototype, "pickupAddress", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateDeliveryDto.prototype, "pickupLatitude", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateDeliveryDto.prototype, "pickupLongitude", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateDeliveryDto.prototype, "deliveryAddress", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateDeliveryDto.prototype, "deliveryLatitude", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateDeliveryDto.prototype, "deliveryLongitude", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateDeliveryDto.prototype, "packageDescription", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateDeliveryDto.prototype, "packageValue", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateDeliveryDto.prototype, "recipientName", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateDeliveryDto.prototype, "recipientPhone", void 0);
//# sourceMappingURL=create-delivery.dto.js.map