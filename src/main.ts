import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
    FastifyAdapter,
    NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { HeaderMiddleware } from './middleware/headers/headers.middleware';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import metadata from './metadata';
import { WsAdapter } from '@nestjs/platform-ws';

async function bootstrap() {
    const app = await NestFactory.create<NestFastifyApplication>(
        AppModule,
        new FastifyAdapter(),
    );
    app.use(new HeaderMiddleware().use);
    app.useGlobalPipes(new ValidationPipe());
    app.enableVersioning({
        type: VersioningType.URI,
    });

    const config = new DocumentBuilder()
        .setTitle('Solstice API')
        .setDescription('An API designed to manage uptime servers')
        .setVersion('1.0')
        .addBearerAuth()
        .addTag('Global', 'Global endpoints')
        .addTag('Authentication', 'Authentication endpoints')
        .addTag('V1', 'Version 1 of the API')
        .addServer('http://localhost:3000')
        .build();
    await SwaggerModule.loadPluginMetadata(metadata); // <-- here
    const documentFactory = () => SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, documentFactory, {
        customSiteTitle: 'Solstice API',
        jsonDocumentUrl: '/api-json',
    });

    await app.listen({ host: '0.0.0.0', port: 3000 });
}
bootstrap();
