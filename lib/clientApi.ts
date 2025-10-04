export async function getModels() {
  const url = new URL("http://localhost:3001/model");

  const response = await fetch(url.toString(), {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  return await response.json();
}

export async function deleteModel(id: number) {
  const url = new URL(`http://localhost:3001/model/${id}`);

  const response = await fetch(url, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to delete model links. Status: ${response.status}`);
  }
  return response.json();
}

export async function getVideosPaths(page = 1, pageSize = 6) {
  const url = new URL(`http://localhost:3001/vids`);
  url.searchParams.append("page", String(page));
  url.searchParams.append("pageSize", String(pageSize));

  const response = await fetch(url.toString(), {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to get videos paths. Status: ${response.status}`);
  }

  return await response.json();
}
