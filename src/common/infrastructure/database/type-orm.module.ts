import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DepartmentOrmEntity } from './typeorm/department.orm';
import { SeederLogOrmEntity } from './typeorm/seeder-log.orm';
import { SeederService } from './seeders/services/seeder.service';
import { DepartmentSeeder } from './seeders/department.seeder';
import { HelperSeeder } from './seeders/helper.seeder';
import { TransactionModule } from '../transaction/transaction.module';
import { DocumentTypeOrmEntity } from './typeorm/document-type.orm';
import { models } from './index';
import { PermissionSeeder } from './seeders/permission.seeder';
import { PermissionGroupSeeder } from './seeders/permission-group.seeder';
import { RoleSeeder } from './seeders/role.seeder';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TransactionModule,
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        entities: [...models],
        subscribers: [],
        synchronize: Boolean(configService.get<string>('DB_SYNCHRONIZE')), // set false because i need use migrations
      }),
      inject: [ConfigService],
    }),
    // TypeOrmModule.forFeature([DepartmentOrmEntity, SeederLogOrmEntity, DocumentTypeOrmEntity]), // ຖ້າບໍ່ໃຊ້ອັນນີ້ຈະບໍ່ສາມາດເອີ້ນໃຊ້ Repository<User>
    TypeOrmModule.forFeature([...models]), // ຖ້າບໍ່ໃຊ້ອັນນີ້ຈະບໍ່ສາມາດເອີ້ນໃຊ້ Repository<User>
  ],
  exports: [TypeOrmModule],
  providers: [
    DepartmentSeeder, 
    SeederService, 
    HelperSeeder, 
    PermissionSeeder, 
    PermissionGroupSeeder,
    RoleSeeder,
  ],
})
export class TypeOrmRepositoryModule {}
