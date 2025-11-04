import { PUBLIC_GATEWAY_URL } from "$env/static/public";

export const makeImageLink = (cid: string, width: number) => {
  return `https://${PUBLIC_GATEWAY_URL}/ipfs/${cid}?img-width=${width}`;
};

export const genres = [
  "Pop",
  "Rock",
  "Hip Hop",
  "Jazz",
  "Classical",
  "Electronic",
  "Country",
  "Reggae",
  "Blues",
  "Folk",
  "Metal",
  "R&B",
  "Soul",
  "Punk",
  "Disco",
  "Funk",
  "Gospel",
  "Ska",
  "Ambient",
  "Indie",
];
