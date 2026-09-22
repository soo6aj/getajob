export interface PlatformConfig {
    siteName: string;
    supportEmail: string;
    allowStudentRegistration: boolean;
    allowRecruiterRegistration: boolean;
    requireCompanyVerification: boolean;
    maintenanceMode: boolean;
}

const SETTINGS_KEY = 'getajob_settings';

const defaultConfig: PlatformConfig = {
    siteName: 'getAjob',
    supportEmail: 'support@getajob.careers',
    allowStudentRegistration: true,
    allowRecruiterRegistration: true,
    requireCompanyVerification: true,
    maintenanceMode: false,
};

export const settingsService = {
    getSettings(): PlatformConfig {
        try {
            const stored = localStorage.getItem(SETTINGS_KEY);
            if (stored) return { ...defaultConfig, ...JSON.parse(stored) };
        } catch { /* fallback to default */ }
        return defaultConfig;
    },

    saveSettings(config: PlatformConfig): void {
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(config));
    },

    updateSettings(updates: Partial<PlatformConfig>): PlatformConfig {
        const current = this.getSettings();
        const updated = { ...current, ...updates };
        this.saveSettings(updated);
        return updated;
    },

    isMaintenanceMode(): boolean {
        return this.getSettings().maintenanceMode;
    }
};
