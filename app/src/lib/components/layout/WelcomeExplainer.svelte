<script>
	import SpinningRecord from '../audio-player/SpinningRecord.svelte';
</script>

<div class="grid-wrapper">
	<p class="p-1"><span class="bold">Soli</span> is a thought experiment.</p>
	<p class="p-2">
		The thought: <span class="bold"
			>What might music streaming look like if it was built for musicians rather than to exploit
			them?</span
		>
	</p>
	<div class="record-container">
		<SpinningRecord artworkUrl="/icon-512.png" isPaused={false} />
	</div>
	<p class="p-3">
		This is the experiment bit - an <span class="bold"
			><a href="https://github.com/gonzo-engineering/soli">open source</a>, not-for-profit</span
		>
		music streaming network with <span class="bold">direct, transparent payments to artists</span>.
	</p>
	<p class="p-4">
		Sound like your kind of jam? <a href="/contact">Join the closed beta</a>.
	</p>
</div>

<hr />

<style>
	.bold {
		font-weight: bold;
	}
	.record-container {
		margin-bottom: 1.5rem;
	}
	hr {
		margin: 2rem 0;
		opacity: 0.2;
	}
	@media (min-width: 600px) {
		.grid-wrapper {
			display: grid;
			grid-template-columns: 2fr 1fr;
			grid-template-rows: auto auto auto auto;
			gap: 0 1rem;
			align-items: center;
			max-width: 800px;
			margin: 0 auto;
		}
		.record-container {
			grid-column: 2 / 3;
			grid-row: 1 / 5;
		}
		.p-1 {
			grid-column: 1 / 2;
			grid-row: 1 / 2;
		}
		.p-2 {
			grid-column: 1 / 2;
			grid-row: 2 / 3;
		}
		.p-3 {
			grid-column: 1 / 2;
			grid-row: 3 / 4;
		}
		.p-4 {
			grid-column: 1 / 2;
			grid-row: 4 / 5;
		}
	}
</style>
