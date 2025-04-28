export const prettifyDuration = (durationInSeconds: number) => {
	const minutes = Math.floor(durationInSeconds / 60);
	const seconds = durationInSeconds % 60;
	return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

export const prettifyBalance = (balance: number) => {
	const pounds = Math.floor(balance / 100);
	const pence = balance % 100;
	return `£${pounds}.${pence < 10 ? '0' : ''}${pence}`;
};
