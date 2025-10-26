<script lang="ts">
	const { link, label }: { link: string; label: string } = $props();
</script>

<div class="section-link">
	> <a href={link}>{label}</a>
</div>

<style>
	.section-link {
		margin-bottom: 1rem;
	}
</style>
