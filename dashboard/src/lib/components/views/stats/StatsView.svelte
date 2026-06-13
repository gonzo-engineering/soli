<script lang="ts">
	import type { StreamLog } from '@soli/shared/types/core';

	const { streams }: { streams: StreamLog[] } = $props();

	const calculateAveragePayout = (streams: StreamLog[]) => {
		const total = streams.reduce((acc, stream) => acc + stream.tokens_used, 0);
		return total / streams.length || 0;
	};

	const calculateTotalEarnings = (
		streams: StreamLog[],
		outputFormat: 'readable-string' | 'raw'
	) => {
		const total = streams.reduce((acc, stream) => acc + stream.tokens_used, 0);
		return outputFormat === 'readable-string' ? `£${(total / 100).toFixed(2)}` : total / 100;
	};
</script>

<div class="artist-stats">
	<h2>Stats</h2>
	<div><strong>Total streams:</strong> {streams.length}</div>
	<div>
		<strong>Average payout per stream:</strong>
		{calculateAveragePayout(streams).toFixed(2)}p
	</div>
	<div>
		<strong>Total earnings:</strong>
		{calculateTotalEarnings(streams, 'readable-string')}
	</div>
</div>
