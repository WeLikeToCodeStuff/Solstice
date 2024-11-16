import 'fastify';

declare module 'fastify' {
    /**
     * @author Adrian
     * @since 1.0
     * @see {class} RequestInterceptor
     * Adds a timestamp number to the request object so that we can calculate the amount of time it took to process the request
     */
    interface FastifyRequest {
        timestamp?: number;
    }
}