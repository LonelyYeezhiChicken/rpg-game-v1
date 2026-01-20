import { HealthService } from '../src/occupations/gameMechanics/health/healthService';
import { healthEvents } from '../src/occupations/gameMechanics/health/health.events';

describe('HealthService', () => {
    let healthService: HealthService;

    beforeEach(() => {
        healthService = new HealthService(100);
    });

    it('should correctly initialize with max health', () => {
        expect(healthService.getHealth()).toBe(100);
        expect(healthService.getMaxHealth()).toBe(100);
    });

    it('should take damage and reduce health', () => {
        healthService.takeDamage(20);
        expect(healthService.getHealth()).toBe(80);
    });

    it('should not allow health to go below zero', () => {
        healthService.takeDamage(120);
        expect(healthService.getHealth()).toBe(0);
    });

    it('should heal and increase health', () => {
        healthService.takeDamage(50);
        healthService.heal(30);
        expect(healthService.getHealth()).toBe(80);
    });

    it('should not allow health to go above max health', () => {
        healthService.heal(20);
        expect(healthService.getHealth()).toBe(100);
    });

    it('should emit an event when health changes', () => {
        const spy = jest.fn();
        healthEvents.on('health-changed', spy);

        healthService.takeDamage(10);
        expect(spy).toHaveBeenCalledWith(90, 100);

        healthService.heal(5);
        expect(spy).toHaveBeenCalledWith(95, 100);
    });
});
