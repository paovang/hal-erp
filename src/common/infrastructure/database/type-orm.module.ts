import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SeederService } from './seeders/services/seeder.service';
import { DepartmentSeeder } from './seeders/department.seeder';
import { HelperSeeder } from './seeders/helper.seeder';
import { TransactionModule } from '../transaction/transaction.module';
import { models } from './index';
import { PermissionSeeder } from './seeders/permission.seeder';
import { PermissionGroupSeeder } from './seeders/permission-group.seeder';
import { RoleSeeder } from './seeders/role.seeder';
import { ProvinceSeeder } from './seeders/province.seeder';
import { UserSeeder } from './seeders/user.seeder';
import { VatSeeder } from './seeders/vat.seeder';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TransactionModule,
    TypeOrmModule.forRootAsync({
      name: process.env.WRITE_CONNECTION_NAME,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.getOrThrow<string>('WRITE_DB_HOST'),
        port: configService.getOrThrow<number>('WRITE_DB_PORT'),
        username: configService.getOrThrow<string>('WRITE_DB_USERNAME'),
        password: configService.getOrThrow<string>('WRITE_DB_PASSWORD'),
        database: configService.getOrThrow<string>('WRITE_DB_NAME'),
        entities: [...models],
        subscribers: [],
        synchronize:
          configService.getOrThrow<never>('WRITE_DB_SYNCHRONIZE') == 'true', // set false because i need use migrations
        logging: configService.getOrThrow<boolean>('WRITE_DB_LOGGING'),
        migrationsTableName: 'migrations',
      }),
    }),
    TypeOrmModule.forRootAsync({
      name: process.env.READ_CONNECTION_NAME,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.getOrThrow<string>('READ_DB_HOST'),
        port: configService.getOrThrow<number>('READ_DB_PORT'),
        username: configService.getOrThrow<string>('READ_DB_USERNAME'),
        password: configService.getOrThrow<string>('READ_DB_PASSWORD'),
        database: configService.getOrThrow<string>('READ_DB_NAME'),
        entities: [...models],
        subscribers: [],
        synchronize:
          configService.getOrThrow<never>('READ_DB_SYNCHRONIZE') == 'true', // set false because i need use migrations
        logging: configService.getOrThrow<boolean>('READ_DB_LOGGING'),
        migrationsTableName: 'migrations',
      }),
    }),
    TypeOrmModule.forFeature([...models]), // ຖ້າບໍ່ໃຊ້ອັນນີ້ຈະບໍ່ສາມາດເອີ້ນໃຊ້ Repository<User>
  ],
  exports: [TypeOrmModule],
  providers: [
    DepartmentSeeder,
    SeederService,
    HelperSeeder,
    PermissionGroupSeeder,
    PermissionSeeder,
    RoleSeeder,
    ProvinceSeeder,
    UserSeeder,
    VatSeeder,
  ],
})
export class TypeOrmRepositoryModule {}
