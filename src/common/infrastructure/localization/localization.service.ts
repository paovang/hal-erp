import { Injectable } from '@nestjs/common';
import { I18nContext, I18nService } from 'nestjs-i18n';
import { ILocalizationService } from './interface/localization.interface';
// import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

@Injectable()
export class LocalizationService implements ILocalizationService {
  // Cache to store translations and avoid repetitive lookups
  private readonly translationCache = new Map<string, string>();
  private readonly MAX_CACHE_SIZE = 1000;

  constructor(
    private readonly i18nService: I18nService,
    // @InjectPinoLogger(LocalizationService.name)
    // private readonly logger: PinoLogger,
  ) {}

  /**
   * Translates a text given a translation key and optional arguments for interpolation.
   *
   * This method will not throw exceptions on translation failures to prevent cascading errors
   * when used within the exception filter. Instead, it logs the error and returns a fallback value.
   *
   * @param key - The translation key.
   * @param args - Optional arguments for interpolation, used for dynamic translations.
   * @returns The translated string or the key if translation fails.
   */
  public async translate<T extends object>(
    key: string,
    args?: T,
  ): Promise<string> {
    try {
      // Return early if key is not a valid translation key format
      if (!key) {
        return key || 'Unknown error';
      }

      const lang = I18nContext.current()?.lang ?? 'lo'; // Default to 'lo' if not detected

      // Create a cache key that includes the arguments
      const cacheKey = `${lang}:${key}:${JSON.stringify(args || {})}`;

      // Check if we have a cached translation
      if (this.translationCache.has(cacheKey)) {
        return this.translationCache.get(cacheKey)!;
      }

      // Attempt translation
      const message = await this.i18nService.t(key, { lang, args });

      // Only cache successful translations
      if (message && message !== key) {
        // Implement cache size management
        if (this.translationCache.size >= this.MAX_CACHE_SIZE) {
          // Clear oldest 20% of entries when reaching the limit
          const keysToDelete = Array.from(this.translationCache.keys()).slice(
            0,
            Math.floor(this.MAX_CACHE_SIZE * 0.2),
          );
          keysToDelete.forEach((k) => this.translationCache.delete(k));
        }

        this.translationCache.set(cacheKey, message as string);
      }

      return message as string;
    } catch (error) {
      //   const errorMessage =
      //     error instanceof Error ? error.message : 'Unknown error';
      //   this.logger.warn(`Translation failed for key '${key}': ${errorMessage}`);

      return key;
    }
  }
}
