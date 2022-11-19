/**
 * Corresponds to ApkCertDTO on the server side
 */

export interface ApkCert {
  id: string,
  subject: string,
  issuer: string,
  notBefore: Date,
  notAfter: Date,
  path: string,
}