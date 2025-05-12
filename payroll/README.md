# Payroll

The humble accountant of the operation, payroll will run regularly. Let's say weekly for now. Its role is to check the stream logs for the preceding week, calculate how much is owed each artist, take the amounts out of the Soli 'vault', and send the payouts on their way.

A few early considerations:

- A way of ensuring no streams/payouts slip through the cracks. Perhaps storing the exact timestamp of the last qualifying stream(s) from the previous week? Or having an established cutoff a little before it runs?
- Email notifications to artists and listeners. The former will appreciate a summary of their earnings, and the latter might like to see the very real way their listens support artists
- Could also create and publish summaries/reports for anyone interested

Early doors but a key part of the puzzle.

## Development

For local development in the early stages running `npx tsx payroll.ts` does nicely.