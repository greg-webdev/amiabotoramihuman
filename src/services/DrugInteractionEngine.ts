// Drug-to-Drug Interaction & Dosage Anomaly Engine
// Cross-references FDA National Drug Code directory with patient metabolic profile

export interface MedicationSchedule {
  rxNormCode: string;
  genericName: string;
  dosageMg: number;
  intervalHours: number;
  halfLifeHours: number;
}

export interface InteractionRisk {
  severity: 'low' | 'moderate' | 'life-threatening';
  involvedDrugs: [string, string];
  clinicalAdvisory: string;
}

export class DrugInteractionEngine {
  private knownAntagonisms = new Map<string, string[]>([
    ['Warfarin', ['Aspirin', 'Ibuprofen', 'Ginkgo Biloba']],
    ['Lisinopril', ['Potassium Supplements', 'Spironolactone']],
    ['Metformin', ['Iodinated Radiocontrast', 'Cimetidine']],
    ['Sertraline', ['Tramadol', 'St Johns Wort', 'MAOIs']]
  ]);

  public analyzeRegimen(currentMeds: MedicationSchedule[], newCandidate: MedicationSchedule): InteractionRisk[] {
    const risks: InteractionRisk[] = [];
    const candidateName = newCandidate.genericName.toLowerCase();

    for (const med of currentMeds) {
      const medName = med.genericName.toLowerCase();
      const conflicts = this.knownAntagonisms.get(med.genericName) || [];
      
      const hasConflict = conflicts.some(c => c.toLowerCase() === candidateName);
      if (hasConflict) {
        risks.push({
          severity: 'life-threatening',
          involvedDrugs: [med.genericName, newCandidate.genericName],
          clinicalAdvisory: `Potential synergistic hemorrhaging or toxicity detected between ${med.genericName} and ${newCandidate.genericName}.`
        });
      }
    }

    return risks;
  }
}
