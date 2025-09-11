---
slug: remuneration
title: Remuneration
description: How artists are paid.
---

# Data

Soli data is mostly stored in [Supabase](https://supabase.com/) at present. There are tables for:

- Users
- Artists
- Artist members
- Tracks
- Releases
- Release tracks
- Streams

There is also a beta users table for the time being to limit access as the proof of concept comes together.

What's stored in the tables listed above is roughly captured by [the project's TypeScript interfaces](../src/lib/types/index.ts). The interplay of information in them is enough to power the app interface, let people top up their token balance, stream songs, have those streams logged, and make weekly payouts to artists.

## Files

Audio files, release artwork, and artist images are uploaded to [IPFS](https://ipfs.tech) courtesy of [Pinata](https://pinata.cloud). The audio files are private and only accessible by permitted platforms - i.e. Soli.

## Finances

Payments are handled by [Stripe](https://stripe.com) so Soli never sees anyone's card details. The only financial information stored is artists' Stripe account IDs, through which they're paid.
