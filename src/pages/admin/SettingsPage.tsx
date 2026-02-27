import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Store, MessageCircle, Settings } from 'lucide-react';
import { settingsAdminApi } from '@/api';
import {
  Card,
  LoadingSpinner,
} from '@/components/ui';
import { SettingsSection } from '@/components/settings/SettingsSection';
import { groupSettings } from '@/lib/settingsUtils';
import { useNotificationStore } from '@/stores/notificationStore';

export function SettingsPage() {
  const queryClient = useQueryClient();
  const { success, error } = useNotificationStore();

  const { data: settings, isLoading } = useQuery({
    queryKey: ['admin-settings'],
    queryFn: settingsAdminApi.getAll,
  });

  const mutation = useMutation({
    mutationFn: settingsAdminApi.update,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-settings'] });
    },
  });

  const handleSave = () => (data: Record<string, string | undefined>) => {
    const updates = Object.entries(data).map(([key, value]) => ({
      key,
      value: value ?? '',
    }));
    mutation.mutate(
      { settings: updates },
      {
        onSuccess: () => success('Configuración guardada correctamente.'),
        onError: () => error('Error al guardar la configuración. Inténtelo de nuevo.'),
      }
    );
  };

  if (isLoading) return <LoadingSpinner />;

  const allSettings = settings ?? [];
  const { general, whatsapp, system } = groupSettings(allSettings);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Configuraciones</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Administra las configuraciones del sitio
        </p>
      </div>

      <div className="space-y-6">
        <SettingsSection
          title="Configuraciones Generales"
          icon={Store}
          settings={general}
          onSave={handleSave()}
          isPending={mutation.isPending}
        />
        <SettingsSection
          title="Configuraciones de WhatsApp"
          icon={MessageCircle}
          settings={whatsapp}
          onSave={handleSave()}
          isPending={mutation.isPending}
        />
        <SettingsSection
          title="Configuraciones del Sistema"
          icon={Settings}
          settings={system}
          onSave={handleSave()}
          isPending={mutation.isPending}
        />

        {allSettings.length === 0 && (
          <Card className="p-12 text-center">
            <p className="text-muted-foreground">
              No hay configuraciones disponibles
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}
