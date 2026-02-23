import type { Setting } from '@/types';

export function groupSettings(settings: Setting[]) {
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
