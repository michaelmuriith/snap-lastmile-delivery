import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../database/connection/database.service';
import { User, CreateUserData, UpdateUserData } from '../entities/user.entity';

@Injectable()
export class UserRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(userData: CreateUserData): Promise<User> {
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

  async findByEmail(email: string): Promise<User | null> {
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

  async findById(id: string): Promise<User | null> {
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

  async findAll(
    page: number = 1,
    limit: number = 10,
    role?: string
  ): Promise<{ users: User[]; total: number }> {
    const offset = (page - 1) * limit;
    
    let whereClause = '';
    let params: any[] = [limit, offset];
    
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

  async update(id: string, updateData: UpdateUserData): Promise<User | null> {
    const fields: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    Object.keys(updateData).forEach(key => {
      if (updateData[key as keyof UpdateUserData] !== undefined) {
        const dbKey = key === 'isVerified' ? 'is_verified' : key;
        fields.push(`${dbKey} = $${paramIndex}`);
        values.push(updateData[key as keyof UpdateUserData]);
        paramIndex++;
      }
    });

    if (fields.length === 0) return null;

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

  async delete(id: string): Promise<boolean> {
    const query = 'DELETE FROM users WHERE id = $1';
    const result = await this.databaseService.query(query, [id]);
    return result.rowCount > 0;
  }

  async findByRole(role: string): Promise<User[]> {
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
}