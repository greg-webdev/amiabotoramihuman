import React, { useEffect, useRef } from 'react';

interface VitalsHUDProps {
  bpm: number;
  spo2: number;
  anomalyDetected: boolean;
}

export const VitalsHUD: React.FC<VitalsHUDProps> = ({ bpm, spo2, anomalyDetected }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let offset = 0;
    let animId: number;

    const renderWave = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = anomalyDetected ? '#f43f5e' : '#38bdf8';
      ctx.lineWidth = 2.5;
      ctx.beginPath();

      for (let x = 0; x < canvas.width; x++) {
        const y = 40 + Math.sin((x + offset) * 0.08) * 15 * (Math.sin(x * 0.02) > 0.7 ? 2.5 : 0.3);
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      offset += 2;
      animId = requestAnimationFrame(renderWave);
    };

    renderWave();
    return () => cancelAnimationFrame(animId);
  }, [anomalyDetected]);

  return (
    <div className="p-4 rounded-xl border border-cyan-500/20 bg-slate-900/60 backdrop-blur">
      <div className="flex justify-between items-center mb-2">
        <h4 className="text-cyan-400 font-mono text-sm tracking-wide">EKG TELEMETRY FEED</h4>
        <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400">LIVE BLE SYNC</span>
      </div>
      <canvas ref={canvasRef} width={380} height={80} className="w-full rounded bg-slate-950/80 mb-3" />
      <div className="grid grid-cols-2 gap-4">
        <div>
          <span className="text-xs text-slate-400">HEART RATE</span>
          <p className="text-2xl font-bold font-mono text-white">{bpm} <span className="text-xs text-slate-500">BPM</span></p>
        </div>
        <div>
          <span className="text-xs text-slate-400">BLOOD O2 (SPO2)</span>
          <p className="text-2xl font-bold font-mono text-emerald-400">{spo2} <span className="text-xs text-slate-500">%</span></p>
        </div>
      </div>
    </div>
  );
};
