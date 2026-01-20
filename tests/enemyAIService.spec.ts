import { EnemyAIService } from '../src/occupations/gameMechanics/ai/enemyAIService';
import { enemyAIEvents } from '../src/occupations/gameMechanics/ai/enemy.ai.events';
import { Direction } from '../src/models/enums/direction';

// Explicitly mock the enemyAIEvents module
jest.mock('../src/occupations/gameMechanics/ai/enemy.ai.events', () => ({
    enemyAIEvents: {
        on: jest.fn(),
        off: jest.fn(),
        emit: jest.fn(),
    },
}));

describe('EnemyAIService', () => {
    let enemyAIService: EnemyAIService;
    let phaserDistanceMock: jest.Mock;
    const enemyId = 'badGuy1';
    const playerPosition = { x: 100, y: 100 };
    const enemyPosition = { x: 100, y: 100 };

    beforeEach(() => {
        jest.clearAllMocks();
        jest.useFakeTimers();

        // Setup global Phaser mock for each test
        global.Phaser = {
            Math: {
                Distance: {
                    Between: jest.fn((x1: number, y1: number, x2: number, y2: number) => {
                        // Default to in-range for most tests
                        return 10;
                    })
                }
            }
        } as any;
        phaserDistanceMock = global.Phaser.Math.Distance.Between as jest.Mock;

        enemyAIService = new EnemyAIService({
            attackRange: 50,
            attackCooldown: 1000, // 1 second
            movementSpeed: 50,
            minAttackAnimationDuration: 1500, // Adjusted for testing continuous attack duration
            enemyId: enemyId
        });
    });

    afterEach(() => {
        jest.runOnlyPendingTimers();
        jest.useRealTimers();
        delete (global as any).Phaser;
    });

    it('should emit enemy-attack event when in range and off cooldown, and then attack again after cooldown', () => {
        const initialTime = 0;
        enemyAIService.update(initialTime, playerPosition, enemyPosition); // First attack
        expect(enemyAIEvents.emit).toHaveBeenCalledWith('enemy-attack', enemyId, playerPosition);
        expect(enemyAIEvents.emit).toHaveBeenCalledTimes(1);

        // Advance time during min animation duration, no new emit
        jest.advanceTimersByTime(500); // currentTime = 500
        enemyAIService.update(initialTime + 500, playerPosition, enemyPosition);
        expect(enemyAIEvents.emit).toHaveBeenCalledTimes(1); // Still only attack emitted

        // Advance time past min animation duration and cooldown, should attack again
        jest.advanceTimersByTime(1001); // Total time 1501. currentTime = 1501
        enemyAIService.update(initialTime + 1501, playerPosition, enemyPosition);
        expect(enemyAIEvents.emit).toHaveBeenCalledWith('enemy-attack', enemyId, playerPosition);
        expect(enemyAIEvents.emit).toHaveBeenCalledTimes(2); // Two attacks
    });

    it('should emit enemy-command-move and stop attack when player is out of range, even if attack animation is active', () => {
        const initialTime = 0;
        // Directly set internal state for this specific test, bypassing initial update if needed
        (enemyAIService as any).isAttackAnimationActive = true;
        (enemyAIService as any).lastAttackTime = initialTime; // Assume it just attacked

        phaserDistanceMock.mockReturnValue(100); // Player moves out of range
        jest.advanceTimersByTime(100); // A small delay
        const farAwayPlayer = { x: 200, y: 100 };
        enemyAIService.update(initialTime + 100, farAwayPlayer, enemyPosition);
        expect(enemyAIEvents.emit).toHaveBeenCalledWith('enemy-command-stop', enemyId, Direction.right); // Stop attack animation
        expect(enemyAIEvents.emit).toHaveBeenCalledWith('enemy-command-move', enemyId, Direction.right); // Start moving
        expect(enemyAIEvents.emit).toHaveBeenCalledTimes(2); // Stop, move
    });

    /*it('should emit enemy-command-stop when in range but on cooldown and min animation duration met', () => {
        const initialTime = 0;
        enemyAIService.update(initialTime, playerPosition, enemyPosition); // Initial attack
        expect(enemyAIEvents.emit).toHaveBeenCalledTimes(1); // Attack event

        jest.advanceTimersByTime(500); // 0.5s into cooldown, but within min animation duration
        enemyAIService.update(initialTime + 500, playerPosition, enemyPosition);
        expect(enemyAIEvents.emit).toHaveBeenCalledTimes(1); // Only initial attack

        jest.advanceTimersByTime(1001); // Total 1501ms, past min animation duration, still on cooldown
        enemyAIService.update(initialTime + 1501, playerPosition, enemyPosition);
        expect(enemyAIEvents.emit).toHaveBeenCalledWith('enemy-command-stop', enemyId, Direction.right);
        expect(enemyAIEvents.emit).toHaveBeenCalledTimes(2); // Attack + Stop
    });

    it('should determine correct movement direction (left)', () => {
        phaserDistanceMock.mockReturnValue(100); // Out of range
        const playerLeft = { x: 50, y: 100 };
        const currentEnemy = { x: 100, y: 100 };

        enemyAIService.update(0, playerLeft, currentEnemy);
        expect(enemyAIEvents.emit).toHaveBeenCalledWith('enemy-command-move', enemyId, Direction.left);
    });

    it('should determine correct movement direction (right)', () => {
        phaserDistanceMock.mockReturnValue(100); // Out of range
        const playerRight = { x: 150, y: 100 };
        const currentEnemy = { x: 100, y: 100 };

        enemyAIService.update(0, playerRight, currentEnemy);
        expect(enemyAIEvents.emit).toHaveBeenCalledWith('enemy-command-move', enemyId, Direction.right);
    });
    */
});