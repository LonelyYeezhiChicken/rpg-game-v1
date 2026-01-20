import { Mage } from '../src/occupations/mage';
import { AbilityDto } from '../src/models/dtos/ability.dto';

describe('Mage', () => {
    let mage: Mage;
    let baseAbility: AbilityDto;

    beforeEach(() => {
        mage = new Mage();
        baseAbility = new AbilityDto();
        baseAbility.intelligence = 10;
        baseAbility.magic = 100;
        baseAbility.health = 80;
        baseAbility.mattack = 10;
        baseAbility.strength = 5; // Add other properties to ensure they are not changed
    });

    it('should correctly apply mage ability modifiers', () => {
        const mageAbility = mage.ability(baseAbility);

        // Based on mage.ts, intelligence and magic are multiplied by 1.5, health by 0.8, and mattack by 2
        expect(mageAbility.intelligence).toBe(15);
        expect(mageAbility.magic).toBe(150);
        expect(mageAbility.health).toBe(64); // 80 * 0.8
        expect(mageAbility.mattack).toBe(20);

        // Ensure other properties are not changed
        expect(mageAbility.strength).toBe(5);
    });
});
