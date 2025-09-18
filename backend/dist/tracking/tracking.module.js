"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrackingModule = void 0;
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const jwt_1 = require("@nestjs/jwt");
const database_module_1 = require("../database/database.module");
const tracking_gateway_1 = require("./tracking.gateway");
const tracking_repository_1 = require("./repositories/tracking.repository");
const update_location_handler_1 = require("./commands/update-location.handler");
let TrackingModule = class TrackingModule {
};
exports.TrackingModule = TrackingModule;
exports.TrackingModule = TrackingModule = __decorate([
    (0, common_1.Module)({
        imports: [cqrs_1.CqrsModule, database_module_1.DatabaseModule, jwt_1.JwtModule],
        providers: [
            tracking_gateway_1.TrackingGateway,
            {
                provide: 'TrackingRepository',
                useClass: tracking_repository_1.TrackingRepository,
            },
            update_location_handler_1.UpdateLocationHandler,
        ],
        exports: ['TrackingRepository', tracking_gateway_1.TrackingGateway],
    })
], TrackingModule);
//# sourceMappingURL=tracking.module.js.map