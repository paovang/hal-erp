import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config } from 'dotenv';
import { I18nMiddleware, I18nValidationPipe } from 'nestjs-i18n';
import { CustomI18nValidationExceptionFilter } from '@common/infrastructure/exception-handler/custom-i18n-validation-exception.filter';

config();
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');

  app.use(I18nMiddleware);
  app.useGlobalPipes(
    new I18nValidationPipe({
      transform: true, // Automatically transform payloads to be objects typed according to their DTO classes
      whitelist: true, // Strip properties not existing in the DTO
    }),
  );
  app.useGlobalFilters(new CustomI18nValidationExceptionFilter());

  const PORT = process.env.PORT || 3000;
  await app.listen(PORT);
  console.log(`Server is running on http://localhost:${PORT}`);
}
bootstrap();
