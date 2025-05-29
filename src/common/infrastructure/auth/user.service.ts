// src/users/user.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserOrmEntity } from '../database/typeorm/user.orm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserOrmEntity)
    private readonly userRepository: Repository<UserOrmEntity>,
  ) {}

  async findByUsername(username: string): Promise<UserOrmEntity | null> {
    return this.userRepository.findOne({ where: { username } });
  }

  async findById(id: number): Promise<UserOrmEntity | null> {
    return this.userRepository.findOne({ where: { id } });
  }

  // เพิ่มฟังก์ชันอื่น ๆ ได้ตามต้องการ เช่น validatePassword ฯลฯ
}
