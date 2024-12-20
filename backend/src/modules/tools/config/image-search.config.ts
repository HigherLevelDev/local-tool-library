import { registerAs } from '@nestjs/config';

export default registerAs('imageSearch', () => ({
  // Using Unsplash API as an example - you would need to replace with actual API key
  apiKey: process.env.IMAGE_SEARCH_API_KEY || '',
  apiUrl: process.env.IMAGE_SEARCH_API_URL || 'https://api.unsplash.com',
  defaultImageUrl: process.env.DEFAULT_TOOL_IMAGE_URL || 'https://via.placeholder.com/300x300?text=Tool+Image',
  searchEndpoint: '/search/photos',
  maxResults: 1,
}));