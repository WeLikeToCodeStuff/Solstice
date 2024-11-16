import { Injectable, NestMiddleware } from '@nestjs/common';
import { FastifyRequest, FastifyReply } from 'fastify';

@Injectable()
export class HeaderMiddleware implements NestMiddleware {
    use(req: FastifyRequest['raw'], res: FastifyReply['raw'], next: () => void) {
        // Response headers
        res.setHeader('Server', 'Solstice');
        res.setHeader('X-Powered-By', 'Solstice');
        res.setHeader('X-Content-Type-Options', 'nosniff');
        res.setHeader('X-Frame-Options', 'SAMEORIGIN');
        res.setHeader('X-XSS-Protection', '1; mode=block');
        res.setHeader(
            'Strict-Transport-Security',
            'max-age=31536000; includeSubDomains',
        );
        res.setHeader('Content-Security-Policy', "default-src 'self'");
        res.setHeader('Referrer-Policy', 'no-referrer');
        next();
    }
}
