'use strict';

const cloudinary = require('cloudinary').v2;

// Return "https" URLs by setting secure: true
cloudinary.config({
  cloud_name: 'projectshopecommerce',
  api_key: '254745345484422',
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Log the configuration
// console.log(cloudinary.config());

module.exports = cloudinary;
