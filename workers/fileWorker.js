// worker.js

const Bull = require('bull');
const thumbnail = require('image-thumbnail');
const { ObjectId } = require('mongodb');
const dbClient = require('./dbClient'); // Import your MongoDB client instance here

// Create a new Bull queue for generating thumbnails
const fileQueue = new Bull('fileQueue');

// Start the worker for processing the queue
fileQueue.process(async (job) => {
  const { userId, fileId } = job.data;

  if (!fileId) {
    throw new Error('Missing fileId');
  }

  if (!userId) {
    throw new Error('Missing userId');
  }

  const file = await dbClient.files.findOne({ _id: ObjectId(fileId), userId });

  if (!file) {
    throw new Error('File not found');
  }

  // Use image-thumbnail library to generate thumbnails
  const imagePath = file.localPath;
  const sizes = [500, 250, 100];

  for (const size of sizes) {
    const thumbnailPath = `${imagePath}_${size}`;
    await thumbnail.generate(imagePath, thumbnailPath, size, size);
  }
});
