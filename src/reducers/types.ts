export interface SettingsFields {
  baseSlnPath: string;
  uiPackageJsonPath: string;
  nuGetApiKey: string;
  npmAutoLogin: boolean;
  npmLogin: string;
  npmPassword: string;
  npmEmail: string;
}

export interface Settings extends SettingsFields {
  hash: string;
  mainError?: string;
  isBaseSlnPathValid: boolean;
  isNuGetApiKeyValid: boolean;
  isUiPackageJsonPathValid: boolean;
  isNpmLoginValid: boolean;
  isNpmPasswordValid: boolean;
  isNpmEmailValid: boolean;
}

export interface AppState {
  settings: Settings;
  displaySettingsView: boolean;
}
