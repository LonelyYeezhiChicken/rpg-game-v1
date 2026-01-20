import { Warrior } from '../src/occupations/warrior';
import { AbilityDto } from '../src/models/dtos/ability.dto';

describe('Warrior', () => {
    let warrior: Warrior;
    let baseAbility: AbilityDto;

    beforeEach(() => {
        warrior = new Warrior();
        baseAbility = new AbilityDto();
        baseAbility.attack = 10;
        baseAbility.actionPoint = 10;
        baseAbility.health = 100;
        baseAbility.intelligence = 5; // Add other properties to ensure they are not changed
    });

    it('should correctly apply warrior ability modifiers', () => {
        const warriorAbility = warrior.ability(baseAbility);

        // Based on warrior.ts, attack, actionPoint, and health are multiplied by 1.5
        expect(warriorAbility.attack).toBe(15);
        expect(warriorAbility.actionPoint).toBe(15);
        expect(warriorAbility.health).toBe(150);

        // Ensure other properties are not changed
        expect(warriorAbility.intelligence).toBe(5);
    });
});
