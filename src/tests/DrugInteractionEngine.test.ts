import { describe, it, expect } from 'vitest';
import { DrugInteractionEngine, MedicationSchedule } from '../services/DrugInteractionEngine';

describe('DrugInteractionEngine Medical Integrity', () => {
  const engine = new DrugInteractionEngine();

  it('flags Warfarin + Aspirin severe antagonism immediately', () => {
    const existing: MedicationSchedule[] = [{
      rxNormCode: '11289',
      genericName: 'Warfarin',
      dosageMg: 5,
      intervalHours: 24,
      halfLifeHours: 40
    }];

    const candidate: MedicationSchedule = {
      rxNormCode: '1191',
      genericName: 'Aspirin',
      dosageMg: 81,
      intervalHours: 24,
      halfLifeHours: 6
    };

    const conflicts = engine.analyzeRegimen(existing, candidate);
    expect(conflicts.length).toBeGreaterThan(0);
    expect(conflicts[0].severity).toBe('life-threatening');
  });
});
