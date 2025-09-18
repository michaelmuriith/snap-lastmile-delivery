"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeliveriesModule = void 0;
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const database_module_1 = require("../database/database.module");
const delivery_repository_1 = require("./repositories/delivery.repository");
const create_delivery_handler_1 = require("./commands/create-delivery.handler");
const update_delivery_handler_1 = require("./commands/update-delivery.handler");
const get_delivery_handler_1 = require("./queries/get-delivery.handler");
const deliveries_controller_1 = require("./deliveries.controller");
let DeliveriesModule = class DeliveriesModule {
};
exports.DeliveriesModule = DeliveriesModule;
exports.DeliveriesModule = DeliveriesModule = __decorate([
    (0, common_1.Module)({
        imports: [cqrs_1.CqrsModule, database_module_1.DatabaseModule],
        controllers: [deliveries_controller_1.DeliveriesController],
        providers: [
            {
                provide: 'DeliveryRepository',
                useClass: delivery_repository_1.DeliveryRepository,
            },
            create_delivery_handler_1.CreateDeliveryHandler,
            update_delivery_handler_1.UpdateDeliveryHandler,
            update_delivery_handler_1.AssignDriverHandler,
            update_delivery_handler_1.UpdateDeliveryStatusHandler,
            get_delivery_handler_1.GetDeliveryHandler,
            get_delivery_handler_1.GetDeliveriesHandler,
        ],
        exports: ['DeliveryRepository'],
    })
], DeliveriesModule);
//# sourceMappingURL=deliveries.module.js.map