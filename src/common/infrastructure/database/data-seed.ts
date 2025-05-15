import { NestFactory } from '@nestjs/core';
import { SeederService } from './seeders/services/seeder.service';
import { TypeOrmRepositoryModule } from './type-orm.module';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(
    TypeOrmRepositoryModule,
  );
  const seeder = app.get(SeederService);

  try {
    await seeder.seed();
  } catch (error) {
    console.log('error for notification seeder', error);
  }
  await app.close();
}

bootstrap().catch((error) => console.log('rrror seeding database: ', error));
