import type { Artist, Label } from '@soli/shared/types/core';
import type { LabelHydrated } from '@soli/shared/types/hydrated';

export const dashboardState: {
	activeArtist: Artist | null;
	activeLabel: LabelHydrated | null;
	activeSection: DashboardSectionId;
} = $state({
	activeArtist: null,
	activeLabel: null,
	activeSection: 'profile'
});

export type DashboardSectionId = 'profile' | 'music' | 'stats' | 'payouts' | 'artists';
