import { PoliciesGuard } from './policies-guard.guard';

describe('PoliciesGuard', () => {
    it('should be defined', () => {
        expect(new PoliciesGuard(null, null, null)).toBeDefined();
    });
});
