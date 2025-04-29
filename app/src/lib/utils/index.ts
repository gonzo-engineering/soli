export const prettifyDuration = (durationInSeconds: number) => {
	const minutes = Math.floor(durationInSeconds / 60);
	const seconds = durationInSeconds % 60;
	return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

export const prettifyBalance = (tokensBalance: number) => {
	return tokensBalance.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};
