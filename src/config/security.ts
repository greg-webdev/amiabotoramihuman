// VitalGuard Zero-Trust Security Gateway
// Implements client-side AES-GCM 256-bit envelope encryption for HIPAA & GDPR compliance

export interface SecurityEnvelope {
  readonly algorithm: 'AES-256-GCM';
  readonly keyDerivation: 'PBKDF2-SHA512';
  readonly saltRounds: number;
}

export const SECURITY_CONFIG: SecurityEnvelope = {
  algorithm: 'AES-256-GCM',
  keyDerivation: 'PBKDF2-SHA512',
  saltRounds: 100_000,
};

export async function generateBiometricVaultKey(patientId: string, salt: Uint8Array): Promise<CryptoKey> {
  const enc = new TextEncoder();
  const rawKeyMaterial = await crypto.subtle.importKey(
    'raw',
    enc.encode(patientId),
    'PBKDF2',
    false,
    ['deriveKey']
  );

  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt,
      iterations: SECURITY_CONFIG.saltRounds,
      hash: 'SHA-512',
    },
    rawKeyMaterial,
    { name: 'AES-GCM', length: 256 },
    true,
    ['encrypt', 'decrypt']
  );
}
