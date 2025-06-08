import { PUBLIC_GATEWAY_URL } from "$env/static/public";

export const makeImageLink = (cid: string, width: number) => {
  return `https://${PUBLIC_GATEWAY_URL}/ipfs/${cid}?img-width=${width}`;
};
