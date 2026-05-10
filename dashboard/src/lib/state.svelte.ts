import type { Artist, Label } from '../../../shared/types/core';

export const dashboardState: {
	activeArtist: Artist | null;
	activeLabel: Label | null;
	activeSection: DashboardSectionId;
} = $state({
	activeArtist: null,
	activeLabel: null,
	activeSection: 'profile'
});

export type DashboardSectionId = 'profile' | 'music' | 'stats' | 'payouts';
