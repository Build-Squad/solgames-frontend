export interface User {
  id: string;
  email: string;
  name: string;
  profileImage: any;
  typeOfLogin: string;
  verifier: string;
  verifierId: string;
  aggregateVerifier: string;
  isMfaEnabled: boolean;
  idToken: string;
  publicKey: string;
}
