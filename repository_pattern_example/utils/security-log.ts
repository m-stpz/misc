// ============================================================
// SECURITY LOG — Log security events without leaking PII
// ============================================================
// Log auth failures, permission denials, and suspicious activity.
// NEVER log passwords, tokens, or PII.

export interface SecurityLogContext {
  userId?: string;
  action: string;
  ip?: string;
  metadata?: Record<string, unknown>;
}

/** Log a security-relevant event (auth failure, permission denial, etc.) */
export function securityErrorLog(context: SecurityLogContext, message: string): void {
  // In production, this goes to Cloud Logging / structured logger
  console.error(JSON.stringify({
    severity: 'WARNING',
    type: 'SECURITY',
    action: context.action,
    userId: context.userId ?? 'anonymous',
    ip: context.ip ?? 'unknown',
    message,
    timestamp: new Date().toISOString(),
    // NEVER log: passwords, tokens, request bodies with sensitive data
  }));
}
