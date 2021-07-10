export enum ConnectionState {
  DISCONNECTED,
  CONNECTED
}
export interface ISeeder {
  seed: () => Promise<void>
}
