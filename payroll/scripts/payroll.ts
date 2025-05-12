import { createClient } from "@supabase/supabase-js";
import "dotenv/config";

interface Stream {
  id: string;
  streamed_at: string;
  user_id: string;
  track_id: string;
  artist_id: string;
  tokens_used: number;
}

const supabase = createClient(
  process.env.PUBLIC_SUPABASE_URL || "",
  process.env.PUBLIC_SUPABASE_ANON_KEY || ""
);

const { data, error } = await supabase.from("streams").select();

if (error) {
  console.error("Error fetching streams:", error);
}

if (!data) {
  console.error("No data found");
  process.exit(1);
}

const today = new Date();
const sevenDaysAgo = new Date(today.getDate() - 7);

const streamsFromLastSevenDays: Stream[] = data.filter((stream) => {
  const streamDate = new Date(stream.streamed_at);
  return streamDate >= sevenDaysAgo && streamDate < today;
});

const artistEarnings = streamsFromLastSevenDays.reduce<
  Record<string, { total_streams: number; total_earnings: number }>
>((acc, stream) => {
  const { artist_id, tokens_used } = stream;
  if (!acc[artist_id]) {
    acc[artist_id] = {
      total_streams: 0,
      total_earnings: 0,
    };
  }
  acc[artist_id].total_streams += 1;
  acc[artist_id].total_earnings += tokens_used;
  return acc;
}, {});

console.log("Artist earnings from last seven days:", artistEarnings);

// Send a payout to each artist

// Log the payout

// Send a notification to each artist

// Send notifications to listeners telling them where their money went
