import { ServerResponse } from 'http';
import { HeaderMiddleware } from './headers.middleware';
import { FastifyReply } from 'fastify';

describe('HeaderMiddleware', () => {
    it('should be defined', () => {
        expect(new HeaderMiddleware()).toBeDefined();
    });

    it('should set headers', () => {
        const middleware = new HeaderMiddleware();
        const res = {
            setHeader: jest.fn(),
            getHeaders: jest.fn(),
        } as unknown as FastifyReply['raw'];
        const next = jest.fn();

        middleware.use(null, res as unknown as ServerResponse, next);

        res.setHeader('Test-Platform', 'Jest');
        expect(res.setHeader).toHaveBeenCalledTimes(9);
        expect(res.setHeader).toHaveBeenCalledWith('Server', 'Solstice');
        expect(res.setHeader).toHaveBeenCalledWith('X-Powered-By', 'Solstice');
    });
});
