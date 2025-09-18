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
exports.UserRepository = void 0;
const common_1 = require("@nestjs/common");
const database_service_1 = require("../../database/connection/database.service");
let UserRepository = class UserRepository {
    databaseService;
    constructor(databaseService) {
        this.databaseService = databaseService;
    }
    async create(userData) {
        const query = `
      INSERT INTO users (name, email, phone, password, role, is_verified, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING id, name, email, phone, password, role, is_verified, created_at, updated_at
    `;
        const values = [
            userData.name,
            userData.email,
            userData.phone,
            userData.password,
            userData.role || 'customer',
            userData.isVerified || false,
            new Date(),
            new Date(),
        ];
        const result = await this.databaseService.query(query, values);
        const user = result.rows[0];
        return {
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            password: user.password,
            role: user.role,
            isVerified: user.is_verified,
            createdAt: user.created_at,
            updatedAt: user.updated_at,
        };
    }
    async findByEmail(email) {
        const query = `
      SELECT id, name, email, phone, password, role, is_verified, created_at, updated_at
      FROM users
      WHERE email = $1
    `;
        const result = await this.databaseService.query(query, [email]);
        if (result.rows.length === 0) {
            return null;
        }
        const user = result.rows[0];
        return {
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            password: user.password,
            role: user.role,
            isVerified: user.is_verified,
            createdAt: user.created_at,
            updatedAt: user.updated_at,
        };
    }
    async findById(id) {
        const query = `
      SELECT id, name, email, phone, password, role, is_verified, created_at, updated_at
      FROM users
      WHERE id = $1
    `;
        const result = await this.databaseService.query(query, [id]);
        if (result.rows.length === 0) {
            return null;
        }
        const user = result.rows[0];
        return {
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            password: user.password,
            role: user.role,
            isVerified: user.is_verified,
            createdAt: user.created_at,
            updatedAt: user.updated_at,
        };
    }
    async findAll(page = 1, limit = 10, role) {
        const offset = (page - 1) * limit;
        let whereClause = '';
        let params = [limit, offset];
        if (role) {
            whereClause = 'WHERE role = $3';
            params.push(role);
        }
        const countQuery = `SELECT COUNT(*) FROM users ${whereClause}`;
        const dataQuery = `
      SELECT id, name, email, phone, password, role, is_verified, created_at, updated_at
      FROM users
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT $1 OFFSET $2
    `;
        const [countResult, dataResult] = await Promise.all([
            this.databaseService.query(countQuery, role ? [role] : []),
            this.databaseService.query(dataQuery, params),
        ]);
        const users = dataResult.rows.map(user => ({
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            password: user.password,
            role: user.role,
            isVerified: user.is_verified,
            createdAt: user.created_at,
            updatedAt: user.updated_at,
        }));
        return {
            users,
            total: parseInt(countResult.rows[0].count),
        };
    }
    async update(id, updateData) {
        const fields = [];
        const values = [];
        let paramIndex = 1;
        Object.keys(updateData).forEach(key => {
            if (updateData[key] !== undefined) {
                const dbKey = key === 'isVerified' ? 'is_verified' : key;
                fields.push(`${dbKey} = $${paramIndex}`);
                values.push(updateData[key]);
                paramIndex++;
            }
        });
        if (fields.length === 0)
            return null;
        values.push(id);
        const query = `
      UPDATE users
      SET ${fields.join(', ')}, updated_at = NOW()
      WHERE id = $${paramIndex}
      RETURNING id, name, email, phone, password, role, is_verified, created_at, updated_at
    `;
        const result = await this.databaseService.query(query, values);
        if (result.rows.length === 0) {
            return null;
        }
        const user = result.rows[0];
        return {
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            password: user.password,
            role: user.role,
            isVerified: user.is_verified,
            createdAt: user.created_at,
            updatedAt: user.updated_at,
        };
    }
    async delete(id) {
        const query = 'DELETE FROM users WHERE id = $1';
        const result = await this.databaseService.query(query, [id]);
        return result.rowCount > 0;
    }
    async findByRole(role) {
        const query = `
      SELECT id, name, email, phone, password, role, is_verified, created_at, updated_at
      FROM users
      WHERE role = $1
      ORDER BY created_at DESC
    `;
        const result = await this.databaseService.query(query, [role]);
        return result.rows.map(user => ({
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            password: user.password,
            role: user.role,
            isVerified: user.is_verified,
            createdAt: user.created_at,
            updatedAt: user.updated_at,
        }));
    }
};
exports.UserRepository = UserRepository;
exports.UserRepository = UserRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_service_1.DatabaseService])
], UserRepository);
//# sourceMappingURL=user.repository.js.map