import { createTRPCProxyClient } from '@trpc/client';
import { ipcLink } from 'electron-trpc/renderer';

// @ts-ignore - Import from built main process
import type { AppRouter } from '../../main/trpc/router';

export const trpc = createTRPCProxyClient<AppRouter>({
  links: [ipcLink()],
});
