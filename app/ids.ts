import { useParams } from "next/navigation";
import { Database } from "./database.types";
import { createBrowserClient } from "@supabase/ssr";
import { VideoModel } from "./types";
const supabaseUrl = 'https://lrsgsgkissnmromalfsu.supabase.co';
const supabaseKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxyc2dzZ2tpc3NubXJvbWFsZnN1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ1NDExMzEsImV4cCI6MjA2MDExNzEzMX0.OlXZpo0mgZDnKK9iiEyrzF1avMlPdwa3YSuf3H0-YK4';

const supabase = createBrowserClient<Database>(supabaseUrl, supabaseKey);


export async function getRandomeModel(): Promise<VideoModel> {
  const url = new URL("http://localhost:3001/model/random");

  const response = await fetch(url.toString(), {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  return await response.json();
}

export async function getModelById({
  id,
  name,
}: {
  id?: string;
  name?: string;
}): Promise<VideoModel> {
  if (!id && !name) {
    throw new Error("At least one parameter (id or name) must be provided");
  }

  const url = new URL("http://localhost:3001/model/by-id");
  if (id) {
    url.searchParams.append("id", id);
  }
  if (name) {
    url.searchParams.append("name", name);
  }

  try {
    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch model. Status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching model:", error);
    throw error;
  }
}

export async function getVideoRating(): Promise<VideoModel[] | undefined> {
  // Fetch data sorted by averageRating in descending order
  const { data, error } = await supabase
    .from("models")
    .select()
    .order("videoCount", { ascending: false }) // Change to `true` for ascending order
    .order("name", { ascending: true }); // Secondary sort: name ascending (alphabetically)

  if (error) {
    console.error("Error fetching data:", error);
  } else {
    return data;
  }
}

export async function add(name: string) {
  const url = new URL("http://localhost:3001/model");

  await fetch(url.toString(), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name }),
  });
}

export async function getVideos() {
  const url = new URL("http://localhost:3001/vids");

  const response = await fetch(url.toString(), {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  return await response.json();
}

export async function getOnlineModels(opts?: { pinned?: boolean; status?: string }) {
  const url = new URL("http://localhost:3001/model/cb");
  if (opts?.pinned) url.searchParams.append("pinned", "true");
  if (opts?.status) url.searchParams.append("status", opts.status);

  const response = await fetch(url.toString(), {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to load online models. Status: ${response.status}`);
  }

  return await response.json();
}
