import { createNestApp } from '@fiap-burger/setup';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await createNestApp(AppModule);
  await app.listen(3000);
}
bootstrap();
