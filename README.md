![Soli logo](./brand/assets/full-logo-black.png)

Soli is a thought experiment as much as anything else. The thought: **what might it look like if music streaming was built in service of musicians rather than to exploit them?**

This is the result - a music streaming platform with distributed file storage and direct, transparent micropayments between listeners and artists. It's far from perfect but hopefully a viable proof-of-concept.

A few tenets/aspirations:

- Transparent, direct remuneration process
- Decentralised (think peer-to-peer but with micropayments)
- Messy in a nice, human way
- Self-sustaining

The monorepo breaks down into a few key projects:

- **App ([soli.network](https://soli.network))**. Where people can top up credits, listen to music, and curate their personal libraries.
- **Dashboard ([dashboard.soli.network](https://dashboard.soli.network))**. Where artists can upload and manage their music
- **API ([api.soli.network](https://api.soli.network))**. The engine - or rhythm section if you like - of the whole affair
- **Payroll**. A weekly process for paying artists based on streams

Almost everything is built with [SvelteKit](https://svelte.dev), because it's great. [Stripe](https://stripe.com/gb) handles payments, [Pinata](https://pinata.cloud) provided IPFS file storage, and [Supabase](https://supabase.com) takes care of data and authorisation. All this is subject to change. The idea is for any given piece to be unessential and replaceable.

In principle there's no reason (beyond shoddy documentation) why collectives of enterprising artists can't use the code in this repository to spin up music streaming services of their own.

Soli is currently in a closed beta. Any interested artists or listeners are encouraged to get in touch.