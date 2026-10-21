import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index } from 'typeorm';

export enum AlertSeverity {
  NORMAL = 'NORMAL',
  MILD_ANOMALY = 'MILD_ANOMALY',
  CRITICAL_ARRHYTHMIA = 'CRITICAL_ARRHYTHMIA',
  HYPOTENSION_SHOCK = 'HYPOTENSION_SHOCK'
}

@Entity('patient_telemetry_records')
@Index(['patientId', 'recordedAt'])
export class PatientTelemetry {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 64 })
  patientId!: string;

  @Column({ type: 'float' })
  heartRateBpm!: number;

  @Column({ type: 'float' })
  spo2BloodOxygen!: number;

  @Column({ type: 'float' })
  systolicBp!: number;

  @Column({ type: 'float' })
  diastolicBp!: number;

  @Column({ type: 'float', nullable: true })
  heartRateVariabilityMs?: number;

  @Column({
    type: 'enum',
    enum: AlertSeverity,
    default: AlertSeverity.NORMAL
  })
  anomalyStatus!: AlertSeverity;

  @CreateDateColumn()
  recordedAt!: Date;
}
