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
exports.EmailService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
let EmailService = class EmailService {
    configService;
    constructor(configService) {
        this.configService = configService;
    }
    async send(to, subject, message, metadata) {
        try {
            const apiKey = this.configService.get('EMAIL_API_KEY');
            const fromEmail = this.configService.get('EMAIL_FROM', 'noreply@snap.com');
            console.log(`📧 EMAIL SERVICE: Sending email to ${to}`);
            console.log(`Subject: ${subject}`);
            console.log(`Message: ${message}`);
            console.log(`From: ${fromEmail}`);
            console.log(`API Key configured: ${!!apiKey}`);
            return true;
        }
        catch (error) {
            console.error('Email service error:', error);
            return false;
        }
    }
};
exports.EmailService = EmailService;
exports.EmailService = EmailService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], EmailService);
//# sourceMappingURL=email.service.js.map