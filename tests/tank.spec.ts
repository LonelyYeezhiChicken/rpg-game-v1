import { Tank } from '../src/occupations/tank';
import { AbilityDto } from '../src/models/dtos/ability.dto';

describe('Tank', () => {
    let tank: Tank;
    let baseAbility: AbilityDto;

    beforeEach(() => {
        tank = new Tank();
        baseAbility = new AbilityDto();
        baseAbility.accuracy = 10;
        baseAbility.health = 100;
        baseAbility.luck = 10;
        baseAbility.agility = 10;
        baseAbility.strength = 10; // Add other properties to ensure they are not changed
    });

    it('should correctly apply tank ability modifiers', () => {
        const tankAbility = tank.ability(baseAbility);

        // Based on tank.ts, accuracy is multiplied by 0.8, health by 2, luck by 2, and agility by 1.5
        expect(tankAbility.accuracy).toBe(8);
        expect(tankAbility.health).toBe(200);
        expect(tankAbility.luck).toBe(20);
        expect(tankAbility.agility).toBe(15);

        // Ensure other properties are not changed
        expect(tankAbility.strength).toBe(10);
    });
});
