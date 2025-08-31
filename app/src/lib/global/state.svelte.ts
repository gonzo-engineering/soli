import type { ReleaseHydrated, TrackRaw } from '../../../../shared/types';

interface UserState {
	activeSong: TrackRaw | null;
	activeSongRelease: ReleaseHydrated | null;
	activeSongUrl: string | null;
	activeSongIsPaused: boolean;
	autoPlay: boolean;
	liveBalance: number | null;
	payPerStream: number;
}

export const userState: UserState = $state({
	activeSong: null,
	activeSongRelease: null,
	activeSongUrl: null,
	activeSongIsPaused: false,
	autoPlay: false,
	liveBalance: 0,
	payPerStream: 3
});

const logStream = async (userId: string, artistId: string, trackId: string, tokensUsed: number) => {
	console.log(`Logging stream for '${trackId}' by user ${userId}`);
	const { status } = await fetch('/api/streams', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ userId, artistId, trackId, tokensUsed })
	});
	if (status === 200) {
		console.log('Stream logged successfully');
	} else {
		console.error('Error logging stream:', status);
	}
};

export const updateUserTokensBalance = async (
	userId: string,
	tokens: number,
	addOrSubtract: 'add' | 'subtract'
) => {
	const balanceChange = addOrSubtract === 'add' ? tokens : -tokens;
	const response = await fetch(`/api/users/${userId}`, {
		method: 'PATCH',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ balanceChange })
	});

	if (!response.ok) {
		console.error('Error updating user balance:', response.statusText);
	}
	const data = await response.json();
	if (userState.liveBalance !== null) {
		userState.liveBalance += balanceChange;
	}
	return { data, error: response.ok ? null : new Error(response.statusText) };
};

export const setActiveSong = async (
	song: TrackRaw,
	release: ReleaseHydrated,
	userId: string,
	userBalance: number,
	userPayPerStream: number
) => {
	if (userBalance < userPayPerStream) {
		throw new Error('Not enough balance to play this song');
	}

	const songUrl = await fetch('/api/links/' + song.ipfs_cid).then((res) => res.text());

	userState.activeSong = song;
	userState.activeSongRelease = release;
	userState.activeSongUrl = songUrl;

	// TODO: Improve this to use a more accurate timer
	// Deduct the pay per stream after 30 of playtime
	setTimeout(() => {
		updateUserTokensBalance(userId, userPayPerStream, 'subtract');
		logStream(userId, release.artist_id, song.id, userPayPerStream);
	}, 30000);
};
