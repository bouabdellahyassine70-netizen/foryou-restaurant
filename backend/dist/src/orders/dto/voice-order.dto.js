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
exports.VoiceOrderDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const order_dto_1 = require("./order.dto");
class VoiceOrderDto {
}
exports.VoiceOrderDto = VoiceOrderDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Voice AI order ID from SAWT IA system' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], VoiceOrderDto.prototype, "voiceOrderId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Customer phone number from voice call' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], VoiceOrderDto.prototype, "customerPhone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Customer name (if extracted from voice)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], VoiceOrderDto.prototype, "customerName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [order_dto_1.OrderItemDto], description: 'Order items extracted from voice' }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => order_dto_1.OrderItemDto),
    __metadata("design:type", Array)
], VoiceOrderDto.prototype, "items", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Order type determined from voice', enum: ['DINE_IN', 'TAKEAWAY', 'DELIVERY'] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], VoiceOrderDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Delivery address (if delivery order)', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], VoiceOrderDto.prototype, "deliveryAddress", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Special instructions from voice', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], VoiceOrderDto.prototype, "notes", void 0);
//# sourceMappingURL=voice-order.dto.js.map