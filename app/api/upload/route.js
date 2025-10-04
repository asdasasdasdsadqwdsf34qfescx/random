// app/api/upload/route.js
import fs from 'fs';
import path from 'path';

export const config = {
  runtime: 'nodejs', // ensure Node.js runtime is used
};

export async function POST(request) {
  try {
    // Parse the incoming form data
    const formData = await request.formData();
    const file = formData.get('file');
    if (!file) {
      return new Response(
        JSON.stringify({ error: 'No file provided' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Read file contents into a Buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Ensure the upload directory exists
    const uploadDir = './public/uploads';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Create a unique filename based on timestamp and file extension
    const ext = path.extname(file.name);
    const filename = `${Date.now()}${ext}`;
    const filepath = path.join(uploadDir, filename);

    // Save the file to disk
    fs.writeFileSync(filepath, buffer);

    // Respond with the URL of the uploaded file
    return new Response(
      JSON.stringify({ fileUrl: `/uploads/${filename}` }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
