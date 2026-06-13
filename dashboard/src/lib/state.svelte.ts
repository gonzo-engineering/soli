import type { Artist, LabelHydrated } from '@soli/shared/types';

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
