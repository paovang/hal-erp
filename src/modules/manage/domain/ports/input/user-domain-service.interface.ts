/* eslint-disable prettier/prettier */
import { ResponseResult } from '@common/infrastructure/pagination/pagination.interface';
import { EntityManager } from 'typeorm';
import { UserEntity } from '../../entities/user.entity';
import { CreateUserDto } from '@src/modules/manage/application/dto/create/user/create.dto';
import { UserQueryDto } from '@src/modules/manage/application/dto/query/user-query.dto';
import { UpdateUserDto } from '@src/modules/manage/application/dto/create/user/update.dto';
import { ChangePasswordDto } from '@src/modules/manage/application/dto/create/user/change-password.dto';
import { SendMailDto } from '@src/modules/manage/application/dto/create/user/send-email.dto';
import { ForgotPasswordDto } from '@src/modules/manage/application/dto/create/user/forgot-password.dto';
import { ResetPasswordDto } from '@src/modules/manage/application/dto/create/user/reset-password.dto';
import { AdminChangePasswordDto } from '@src/modules/manage/application/dto/create/user/admin-change-password.dto';

export interface IUserServiceInterface {
  login(dto: any): Promise<any>;
  
  getAll(
    dto: UserQueryDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<UserEntity>>;

  getOne(
    id: number,
    manager?: EntityManager,
  ): Promise<ResponseResult<UserEntity>>;

  create(
    dto: CreateUserDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<UserEntity>>;

  update(
    id: number,
    dto: UpdateUserDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<UserEntity>>;

  changePassword(
    id: number,
    dto: ChangePasswordDto,
    manager?: EntityManager,
  ): Promise<{ message: string }>;

  adminChangePassword(
    id: number,
    dto: AdminChangePasswordDto,
    manager?: EntityManager,
  ): Promise<{ message: string }>;

  forgotPassword(
    dto: ForgotPasswordDto,
    manager?: EntityManager,
  ): Promise<{ message: string }>;

  resetPassword(
    dto: ResetPasswordDto,
    manager?: EntityManager,
  ): Promise<{ message: string }>;

  sendMail(
    dto: SendMailDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<UserEntity>>;

  delete(id: number, manager?: EntityManager): Promise<void>;
}
