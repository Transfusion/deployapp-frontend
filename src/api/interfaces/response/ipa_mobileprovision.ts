/**
 * Corresponds to IpaMobileprovisionDTO on the server side
 */

export interface IpaMobileprovision {
  id: string,
  name?: string,
  appName: string,
  type: string,
  platform: string,
  teamName: string,
  profileName: string,
  createdDate?: Date,
  expiredDate?: Date,
  adhoc: boolean,
  development: boolean,
  enterprise: boolean,
  appstore: boolean,
  inhouse: boolean,
  platforms?: string[],
  devices?: string[],
  team_identifier?: string[],
  enabled_capabilities?: string[],
}