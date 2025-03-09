import { Database } from "./database.types";
import { createBrowserClient } from "@supabase/ssr";
import { VideoModel } from "./types";
const supabaseUrl = "https://mhezydornlecnirzrcva.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1oZXp5ZG9ybmxlY25pcnpyY3ZhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg3Njc1NjgsImV4cCI6MjA1NDM0MzU2OH0.MdypDytkc-8IFTfECb1DZmBufWIrOYA3lnxOQ7WNl6A";
const supabase = createBrowserClient<Database>(supabaseUrl, supabaseKey);

export async function getData(): Promise<VideoModel[] | undefined> {
  // Fetch data sorted by averageRating in descending order
  const { data, error } = await supabase
    .from("models")
    .select()
    .order("averageRating", { ascending: false }); // Change to `true` for ascending order

  if (error) {
    console.error("Error fetching data:", error);
  } else {
    return data;
  }
}

export async function getPhoto() {
  const { data, error } = await supabase
    .from("photo")
    .select()

  if (error) {
    console.error("Error fetching data:", error);
  } else {
    return data;
  }
}

export async function getOnlineRating(): Promise<VideoModel[] | undefined> {
  try {
    // Fetch data sorted by onlineCount (descending) and then by name (ascending)
    const { data, error } = await supabase
      .from("models")
      .select()
      .order("onlineCount", { ascending: false }) // Primary sort: onlineCount descending
      .order("name", { ascending: true }); // Secondary sort: name ascending (alphabetically)

    if (error) {
      console.error("Error fetching data:", error);
      return undefined;
    }

    return data;
  } catch (error) {
    console.error("Unexpected error:", error);
    return undefined;
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

export async function getUnrated(): Promise<VideoModel[] | undefined> {
  // Fetch data where averageRating is 0 or null, sorted by averageRating in descending order
  const { data, error } = await supabase
    .from("models")
    .select("*")
    .or("averageRating.eq.0,averageRating.is.null")
    .order("averageRating", { ascending: false });

  if (error) {
    console.error("Error fetching data:", error);
    return undefined;
  } else {
    return data;
  }
}

export async function geTopField(
  field: string
): Promise<VideoModel[] | undefined> {
  // Fetch data sorted by averageRating in descending order
  const { data, error } = await supabase
    .from("models")
    .select()
    .order(field, { ascending: false }) // Change to `true` for ascending order
    .order("name", { ascending: true }); // Secondary sort: name ascending (alphabetically)

  if (error) {
    console.error("Error fetching data:", error);
  } else {
    return data;
  }
}

export async function addPhoto(link: string) {
  const { data, error } = await supabase.from("photo").insert({link});
  console.log(data);
}

export async function add(updateData: any) {
  const { error } = await supabase.from("models").insert(updateData);
  console.log(error);
}

export async function update(updateData: VideoModel) {
  updateData.averageRating =
    updateData.ass * 8.8 +
    updateData.height * 9.5 +
    updateData.brest * 6.5 +
    updateData.face * 10 +
    updateData.wife * 7.1 +
    updateData.overall * 3.2 +
    updateData.content * 1.4;

  // const models = await getData()
  // await updateRank(models!)
  const { error } = await supabase
    .from("models")
    .update(updateData)
    .eq("id", updateData.id);
  console.log(error);
}

export async function updateVideoCount(id: number) {
  const { data: model, error } = await supabase
    .from("models")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching model:", error);
  }
  await supabase
    .from("models")
    .update({ videoCount: model.videoCount + 1 })
    .eq("id", model.id);
  console.log(error);
}

export async function updateRank(models: VideoModel[]) {
  models.forEach((element) => {
    element.averageRating =
      element.ass * 8.8 +
      element.height * 9.5 +
      element.brest * 6.5 +
      element.face * 10 +
      element.wife * 7.1 +
      element.overall * 3.2 +
      element.content * 1.4;
  });

  // Step 2: Upsert new data into the table
  const { error: upsertError } = await supabase
    .from("models")
    .upsert(models, { onConflict: "id" });

  if (upsertError) {
    console.error("Error during upsert:", upsertError);
  } else {
    console.log("Data upserted successfully.");
  }
}

export async function getById(name: string) {
  const { data: model, error } = await supabase
    .from("models")
    .select("*")
    .eq("name", name)
    .single();

  if (error) {
    console.error("Error fetching model:", error);
  }
  return model;
}

export async function uploadAvatar(id: number, link: string) {
  await supabase.from("models").update({ linkAvatar: link }).eq("id", id);
}

export const calculateAverageRating = (video: VideoModel): number => {
  const ratingFields = [
    video.brest,
    video.ass,
    video.face,
    video.overall,
    video.content,
    video.wife,
    video.height,
  ];

  const total = ratingFields.reduce((sum, rating) => sum + rating, 0);
  return parseFloat((total / ratingFields.length).toFixed(1)); // Rounded to 1 decimal place
};