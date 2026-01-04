import versionConfig from "../../version.json";

export interface Version {
  id: string;
  label: string;
  path: string; // e.g., "/docs" or "/v0.1/docs"
  isLatest: boolean;
}

export interface VersionConfig {
  current: string;
  versions: Version[];
}

export function getVersionConfig(): VersionConfig {
  return versionConfig as VersionConfig;
}

export function getCurrentVersion(): Version {
  const config = getVersionConfig();
  const current = config.versions.find((v) => v.isLatest);
  if (!current) {
    // Fallback to first version if no latest flag
    return config.versions[0];
  }
  return current;
}

export function getVersions(): Version[] {
  return getVersionConfig().versions;
}

export function getVersionById(id: string): Version | undefined {
  return getVersionConfig().versions.find((v) => v.id === id);
}
