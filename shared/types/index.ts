export interface UserProfile {
  first_name: string;
  tokens_balance: number;
  pay_per_stream: number;
}

export interface ArtistRaw {
  id: string;
  name: string;
  bio?: string;
  website_url?: string;
  stripe_account_id: string;
  pinata_group_id: string;
  created_at: string;
  image_ipfs_cid?: string;
}

export interface TrackRaw {
  id: string;
  artist_id: string;
  title: string;
  ipfs_cid: string;
  duration_seconds: number;
  created_at: string;
}

export interface ReleaseHydrated {
  id: string;
  title: string;
  artwork_ipfs_cid: string;
  release_type: "album" | "ep" | "single";
  release_date: string;
  artist_id: string;
  artist_name: string;
  tags: string[];
  tracks: TrackRaw[];
}

// Not currently using as the API returns the hydrated version

export interface ReleaseRaw {
  id: string;
  artist_id: string;
  title: string;
  release_type: string;
  artwork_ipfs_cid: string;
  release_date: string;
  tags: string[];
  ipfs_manifest_cid?: string;
  created_at: string;
  updated_at: string;
}

export interface StreamLog {
  id: string;
  streamed_at: string;
  user_id: string;
  track_id: string;
  artist_id: string;
  tokens_used: number;
}

export interface LikedTrackObject {
  track: TrackRaw;
  release: ReleaseHydrated;
}
