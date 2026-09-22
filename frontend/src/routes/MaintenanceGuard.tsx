import { useAuth } from '../context/AuthContext';
import { settingsService } from '../services/settingsService';
import { MaintenancePage } from '../pages/public/MaintenancePage';

interface MaintenanceGuardProps {
    children: React.ReactNode;
}

export function MaintenanceGuard({ children }: MaintenanceGuardProps) {
    const { user } = useAuth();
    const isMaintenance = settingsService.isMaintenanceMode();

    if (isMaintenance && user?.role !== 'admin') {
        return <MaintenancePage />;
    }

    return <>{children}</>;
}
