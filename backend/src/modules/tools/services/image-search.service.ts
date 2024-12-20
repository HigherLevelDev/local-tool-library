import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class ImageSearchService {
  private readonly logger = new Logger(ImageSearchService.name);
  private readonly apiKey: string;
  private readonly apiUrl: string;
  private readonly defaultImageUrl: string;
  private readonly searchEndpoint: string;
  private readonly maxResults: number;

  constructor(private configService: ConfigService) {
    this.apiKey = this.configService.get<string>('imageSearch.apiKey');
    this.apiUrl = this.configService.get<string>('imageSearch.apiUrl');
    this.defaultImageUrl = this.configService.get<string>('imageSearch.defaultImageUrl');
    this.searchEndpoint = this.configService.get<string>('imageSearch.searchEndpoint');
    this.maxResults = this.configService.get<number>('imageSearch.maxResults');
  }

  /**
   * Search for a tool image based on the tool title
   * @param toolTitle The title of the tool to search for
   * @returns Promise<string> The URL of the found image or default image
   */
  async searchToolImage(toolTitle: string): Promise<string> {
    try {
      if (!this.apiKey) {
        this.logger.warn('No API key configured for image search, using default image');
        return this.defaultImageUrl;
      }

      const searchQuery = `${toolTitle} tool`;
      const response = await axios.get(`${this.apiUrl}${this.searchEndpoint}`, {
        headers: {
          Authorization: `Client-ID ${this.apiKey}`,
        },
        params: {
          query: searchQuery,
          per_page: this.maxResults,
        },
      });

      if (response.data.results && response.data.results.length > 0) {
        const imageUrl = response.data.results[0].urls.regular;
        if (await this.validateImageUrl(imageUrl)) {
          return imageUrl;
        }
      }

      this.logger.debug(`No valid images found for tool: ${toolTitle}, using default image`);
      return this.defaultImageUrl;
    } catch (error) {
      this.logger.error(`Error searching for tool image: ${error.message}`);
      return this.defaultImageUrl;
    }
  }

  /**
   * Validate that a URL points to a valid image
   * @param url The URL to validate
   * @returns Promise<boolean> Whether the URL is valid
   */
  private async validateImageUrl(url: string): Promise<boolean> {
    try {
      const response = await axios.head(url);
      const contentType = response.headers['content-type'];
      return contentType && contentType.startsWith('image/');
    } catch (error) {
      this.logger.warn(`Failed to validate image URL: ${url}`);
      return false;
    }
  }
}