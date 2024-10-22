import 'fastify';

declare module 'fastify' {
    interface FastifyRequest {
        timestamp?: number;
    }
}