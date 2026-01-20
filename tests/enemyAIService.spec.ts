import { EnemyAIService } from '../src/occupations/gameMechanics/ai/enemyAIService';
import { enemyAIEvents } from '../src/occupations/gameMechanics/ai/enemy.ai.events';

// Explicitly mock the enemyAIEvents module
jest.mock('../src/occupations/gameMechanics/ai/enemy.ai.events', () => ({
    enemyAIEvents: {
        on: jest.fn(),
        off: jest.fn(),
        emit: jest.fn(),
    },
}));

// We'll mock Phaser.Math.Distance.Between in beforeEach
// as it's used globally in EnemyAIService.ts

describe('EnemyAIService', () => {
    let enemyAIService: EnemyAIService;
    let phaserDistanceMock: jest.Mock; // To spy on the mocked Phaser function
    const enemyId = 'badGuy1';
    const playerPosition = { x: 100, y: 100 };
    const enemyPosition = { x: 100, y: 100 };

    beforeEach(() => {
        jest.clearAllMocks(); // Clear all mocks
        jest.useFakeTimers();

        // Setup global Phaser mock for each test
        global.Phaser = {
            Math: {
                Distance: {
                    Between: jest.fn((x1: number, y1: number, x2: number, y2: number) => {
                        // Default to in-range for most tests
                        return 10; // Assuming attackRange is 50, this is within range
                    })
                }
            }
        } as any;
        phaserDistanceMock = global.Phaser.Math.Distance.Between as jest.Mock;

        enemyAIService = new EnemyAIService({
            attackRange: 50,
            attackCooldown: 1000, // 1 second
            enemyId: enemyId
        });
    });

    afterEach(() => {
        jest.runOnlyPendingTimers();
        jest.useRealTimers();
        delete (global as any).Phaser;
    });

    it('should emit enemy-attack event when in range and off cooldown', () => {
        const initialTime = 0;
        enemyAIService.update(initialTime, playerPosition, enemyPosition); // First attack
        expect(enemyAIEvents.emit).toHaveBeenCalledTimes(1);
        expect(enemyAIEvents.emit).toHaveBeenCalledWith('enemy-attack', enemyId, playerPosition);

        // Advance time just past cooldown
        jest.advanceTimersByTime(1001);
        enemyAIService.update(initialTime + 1001, playerPosition, enemyPosition); // Second attack
        expect(enemyAIEvents.emit).toHaveBeenCalledTimes(2);
    });

    it('should not emit enemy-attack event when out of range', () => {
        phaserDistanceMock.mockReturnValue(100); // Out of range
        enemyAIService.update(0, playerPosition, enemyPosition); // No attack
        expect(enemyAIEvents.emit).not.toHaveBeenCalled();
    });

    it('should not emit enemy-attack event when on cooldown', () => {
        const initialTime = 0;
        enemyAIService.update(initialTime, playerPosition, enemyPosition); // First attack
        expect(enemyAIEvents.emit).toHaveBeenCalledTimes(1);

        // Try to attack again before cooldown is over
        jest.advanceTimersByTime(500); // 0.5 seconds
        enemyAIService.update(initialTime + 500, playerPosition, enemyPosition);
        expect(enemyAIEvents.emit).toHaveBeenCalledTimes(1); // Still only one call
    });

    it('should reset lastAttackTime after an attack', () => {
        const initialTime = 0;
        enemyAIService.update(initialTime, playerPosition, enemyPosition);
        expect(enemyAIEvents.emit).toHaveBeenCalledTimes(1);

        jest.advanceTimersByTime(500); // Advance time
        enemyAIService.update(initialTime + 500, playerPosition, enemyPosition); // Still on cooldown
        expect(enemyAIEvents.emit).toHaveBeenCalledTimes(1);

        jest.advanceTimersByTime(501); // Advance time past cooldown
        enemyAIService.update(initialTime + 1001, playerPosition, enemyPosition); // Should attack again
        expect(enemyAIEvents.emit).toHaveBeenCalledTimes(2); // Should have attacked twice
    });
});