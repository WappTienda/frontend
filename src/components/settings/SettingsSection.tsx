import { useMemo, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Save } from 'lucide-react';
import {
  Button,
  Input,
  Label,
  Card,
} from '@/components/ui';
import { Spinner } from '@/components/ui/spinner';
import type { Setting } from '@/types';

const settingsSchema = z.record(z.string(), z.string().optional());
type SettingsFormData = z.infer<typeof settingsSchema>;

interface SettingsSectionProps {
  title: string;
  icon: React.ElementType;
  settings: Setting[];
  onSave: (data: SettingsFormData) => void;
  isPending: boolean;
}

export function SettingsSection({
  title,
  icon: Icon,
  settings,
  onSave,
  isPending,
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
