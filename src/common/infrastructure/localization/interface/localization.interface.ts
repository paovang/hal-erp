export interface ILocalizationService {
  translate<T extends object>(key: string, args?: T): Promise<string>;
}
