export interface Seeder {
  seed: () => void
}

export enum ConnectionState {
  DISCONNECTED,
  CONNECTED
}
