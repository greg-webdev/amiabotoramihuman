import { Server, Socket } from 'socket.io';

export class VitalTelemetrySocketGateway {
  constructor(private io: Server) {}

  public registerHandlers(): void {
    this.io.on('connection', (socket: Socket) => {
      const patientId = socket.handshake.auth.patientId;
      console.log(`[VitalGuard WS] Connected stream socket for patient: ${patientId}`);

      socket.join(`stream:${patientId}`);

      socket.on('telemetry_tick', (packet: { bpm: number; hrv: number; timestamp: number }) => {
        // Broadcast to doctor/family caregiver dashboard
        this.io.to(`caregiver:${patientId}`).emit('realtime_vitals', {
          patientId,
          ...packet,
          latencyMs: Date.now() - packet.timestamp
        });
      });

      socket.on('disconnect', () => {
        console.log(`[VitalGuard WS] Stream dropped for patient ${patientId}`);
      });
    });
  }
}
