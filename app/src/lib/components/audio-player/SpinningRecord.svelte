<script lang="ts">
	let { artworkUrl, isPaused }: { artworkUrl: string; isPaused: boolean } = $props();
</script>

<div class="record-container" class:paused={isPaused}>
	<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
		<defs>
			<clipPath id="label-clip">
				<circle cx="50" cy="50" r="15" />
			</clipPath>
		</defs>

		<g class="spin">
			<g class="wobble">
				<circle class="record" cx="50" cy="50" r="45" />

				<g class="grooves">
					{#each Array(28) as _, i}
						<circle
							cx="50"
							cy="50"
							r={18 + i}
							fill="none"
							stroke="rgba(255,255,255,0.035)"
							stroke-width="0.2"
						/>
					{/each}
				</g>

				<image
					href={artworkUrl}
					x="35"
					y="35"
					width="30"
					height="30"
					preserveAspectRatio="xMidYMid slice"
					clip-path="url(#label-clip)"
				/>

				<circle class="label" cx="50" cy="50" r="15" fill="none" />
				<circle cx="50" cy="50" r="1" fill="#222222" />
			</g>
		</g>
	</svg>
</div>

<style>
	.spin {
		transform-origin: 50% 50%;
		animation: spin 3s linear infinite;
	}

	.wobble {
		transform-origin: 50% 50%;
		animation: wobble 1.8s ease-in-out infinite;
	}

	.record {
		fill: #131313;
	}

	.paused * {
		animation-play-state: paused;
	}

	@keyframes spin {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(359deg);
		}
	}

	@keyframes wobble {
		0% {
			transform: rotate(0deg) translateX(0);
		}
		25% {
			transform: rotate(0deg) translateX(0.2px);
		}
		50% {
			transform: rotate(0deg) translateX(0);
		}
		75% {
			transform: rotate(0deg) translateX(-0.2px);
		}
		100% {
			transform: rotate(0deg) translateX(0);
		}
	}
	.record-container {
		position: relative;
		width: 100%;
	}

	.record-container::after {
		content: '';
		position: absolute;
		inset: 0;
		border-radius: 50%;

		background: conic-gradient(
			transparent 20deg,
			rgba(255, 255, 255, 0.1) 40deg,
			rgba(255, 255, 255, 0.1) 50deg,
			transparent 60deg,
			transparent 200deg,
			rgba(255, 255, 255, 0.08) 220deg,
			rgba(255, 255, 255, 0.08) 240deg,
			transparent 250deg,
			transparent 340deg
		);

		mix-blend-mode: screen;
		pointer-events: none;

		mask: radial-gradient(circle at center, #000 65%, transparent 66%);
		-webkit-mask: radial-gradient(circle at center, #000 65%, transparent 66%);
	}
</style>
