// Import the required modules
import { Router } from 'itty-router';
import ytdl from 'https://cdn.skypack.dev/ytdl-core'

// Create a router instance
const router = Router();

// Define the endpoint for downloading YouTube videos
router.get('/watch', async (request) => {
  // Get the video id from the query string
  const videoId = new URL(request.url).searchParams.get('v');

  // Validate the video id
  if (!videoId) {
    // Return a 400 error if no video id is provided
    return new Response('No video id specified', { status: 400 });
  }

  try {
    // Get the video info from YouTube
    const info = await ytdl.getInfo(videoId);

    // Choose the best format to download
    // You can modify this logic to suit your needs
    const format = ytdl.chooseFormat(info.formats, { quality: 'highest' });

    // Create a response with the video stream
    const response = new Response(ytdl.downloadFromInfo(info, { format: format }));

    // Set the response headers
    // You can change the file name and the content type according to the format
    response.headers.set('Content-Disposition', `attachment; filename="${info.videoDetails.title}.mp4"`);
    response.headers.set('Content-Type', 'video/mp4');

    // Return the response
    return response;
  } catch (error) {
    // Return a 500 error if something goes wrong
    console.error(error);
    return new Response('Something went wrong', { status: 500 });
  }
});

// Export the default module
export default {
  async fetch(request, environment, context) {
    // Delegate the request to the router
    return router.handle(request);
  }
};
