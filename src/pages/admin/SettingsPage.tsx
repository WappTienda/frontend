import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState, useEffect, useMemo } from 'react';
import { Save, Store, MessageCircle, Settings } from 'lucide-react';
import { settingsAdminApi } from '@/api';
import {
  Button,
  Input,
  Label,
  Card,
  LoadingSpinner,
} from '@/components/ui';
import { Spinner } from '@/components/ui/spinner';
import type { Setting } from '@/types';

// Group settings by key prefix
function groupSettings(settings: Setting[]) {
  const general: Setting[] = [];
  const whatsapp: Setting[] = [];
  const system: Setting[] = [];

  for (const setting of settings) {
    if (setting.key.startsWith('whatsapp_')) {
      whatsapp.push(setting);
    } else if (
      setting.key.startsWith('store_') ||
      setting.key.startsWith('site_')
    ) {
      general.push(setting);
    } else {
      system.push(setting);
    }
  }

  return { general, whatsapp, system };
}

const settingsSchema = z.record(z.string(), z.string().optional());
type SettingsFormData = z.infer<typeof settingsSchema>;

interface SettingsSectionProps {
  title: string;
  icon: React.ElementType;
  settings: Setting[];
  onSave: (data: SettingsFormData) => void;
  isPending: boolean;
  isError: boolean;
  isSuccess: boolean;
}

function SettingsSection({
  title,
  icon: Icon,
  settings,
  onSave,
  isPending,
  isError,
  isSuccess,
}: SettingsSectionProps) {
  const defaultValues = useMemo(() => {
    const values: SettingsFormData = {};
    for (const s of settings) {
      values[s.key] = s.value ?? '';
    }
    return values;
  }, [settings]);

  const { register, handleSubmit, reset } = useForm<SettingsFormData>({
    resolver: zodResolver(settingsSchema),
    defaultValues,
  });

  // Reset form values when settings data changes
  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  if (settings.length === 0) return null;

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4 pb-4 border-b">
        <Icon className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-semibold">{title}</h2>
      </div>
      <form onSubmit={handleSubmit(onSave)} className="space-y-4">
        {settings.map((setting) => (
          <div key={setting.key}>
            <Label htmlFor={setting.key}>
              {setting.description || setting.key}
            </Label>
            <Input
              id={setting.key}
              placeholder={setting.key}
              {...register(setting.key)}
            />
          </div>
        ))}

        {isError && (
          <div className="text-sm text-red-500 p-3 bg-red-50 rounded-lg">
            Error al guardar la configuración. Inténtelo de nuevo.
          </div>
        )}

        {isSuccess && (
          <div className="text-sm text-green-600 p-3 bg-green-50 rounded-lg">
            Configuración guardada correctamente.
          </div>
        )}

        <div className="flex justify-end pt-2">
          <Button type="submit" disabled={isPending} className="gap-2">
            {isPending ? <Spinner className="h-4 w-4" /> : <Save className="h-4 w-4" />}
            Guardar
          </Button>
        </div>
      </form>
    </Card>
  );
}

export function SettingsPage() {
  const queryClient = useQueryClient();
  const [successSection, setSuccessSection] = useState<string | null>(null);

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

  const handleSave = (section: string) => (data: SettingsFormData) => {
    const updates = Object.entries(data).map(([key, value]) => ({
      key,
      value: value ?? '',
    }));
    setSuccessSection(null);
    mutation.mutate(
      { settings: updates },
      {
        onSuccess: () => {
          setSuccessSection(section);
          setTimeout(() => setSuccessSection(null), 3000);
        },
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
          onSave={handleSave('general')}
          isPending={mutation.isPending}
          isError={mutation.isError && successSection === null}
          isSuccess={successSection === 'general'}
        />
        <SettingsSection
          title="Configuraciones de WhatsApp"
          icon={MessageCircle}
          settings={whatsapp}
          onSave={handleSave('whatsapp')}
          isPending={mutation.isPending}
          isError={mutation.isError && successSection === null}
          isSuccess={successSection === 'whatsapp'}
        />
        <SettingsSection
          title="Configuraciones del Sistema"
          icon={Settings}
          settings={system}
          onSave={handleSave('system')}
          isPending={mutation.isPending}
          isError={mutation.isError && successSection === null}
          isSuccess={successSection === 'system'}
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
