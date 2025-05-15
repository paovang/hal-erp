import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Department } from './typeorm/department.orm';
import { SeederLog } from './typeorm/seeder-log.orm';
import { SeederService } from './seeders/services/seeder.service';
import { DepartmentSeeder } from './seeders/department.seeder';
import { HelperSeeder } from './seeders/helper.seeder';
import { TransactionModule } from '../transaction/transaction.module';

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
        entities: [Department, SeederLog],
        subscribers: [],
        synchronize: Boolean(configService.get<string>('DB_SYNCHRONIZE')), // set false because i need use migrations
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([Department, SeederLog]), // ຖ້າບໍ່ໃຊ້ອັນນີ້ຈະບໍ່ສາມາດເອີ້ນໃຊ້ Repository<User>
  ],
  exports: [TypeOrmModule],
  providers: [DepartmentSeeder, SeederService, HelperSeeder],
})
export class TypeOrmRepositoryModule {}
