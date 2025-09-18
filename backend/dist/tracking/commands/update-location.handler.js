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
exports.UpdateLocationHandler = void 0;
const cqrs_1 = require("@nestjs/cqrs");
const common_1 = require("@nestjs/common");
const update_location_command_1 = require("./update-location.command");
const tracking_repository_1 = require("../repositories/tracking.repository");
let UpdateLocationHandler = class UpdateLocationHandler {
    trackingRepository;
    constructor(trackingRepository) {
        this.trackingRepository = trackingRepository;
    }
    async execute(command) {
        const { trackingData } = command;
        return this.trackingRepository.create(trackingData);
    }
};
exports.UpdateLocationHandler = UpdateLocationHandler;
exports.UpdateLocationHandler = UpdateLocationHandler = __decorate([
    (0, cqrs_1.CommandHandler)(update_location_command_1.UpdateLocationCommand),
    __param(0, (0, common_1.Inject)('TrackingRepository')),
    __metadata("design:paramtypes", [tracking_repository_1.TrackingRepository])
], UpdateLocationHandler);
//# sourceMappingURL=update-location.handler.js.map