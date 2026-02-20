import { loadLocales } from './loader';
import Metadata from './locales/metadata.json';

export interface I18nMetadata {
    defaultLocale: string;
    supportedLocales: string[];
}

export interface I18nProviderInterface {
    t(key: string, variables: Record<string, string>): string;
}

export class I18nProvider implements I18nProviderInterface {
    private static metadata: I18nMetadata = Metadata;
    private static locales = loadLocales();
    
    private locale: string;

    constructor(locale: string) {
        this.locale = this.resolve(locale);
    }

    private get data() {
        return I18nProvider.locales.get(this.locale);
    }

    private resolve(locale: string): string {
        if (!locale || !I18nProvider.locales.has(locale))
            return I18nProvider.metadata.defaultLocale;

        return locale;
    }

    public get<T = unknown>(key: string): T | undefined {
        let value: any = this.data;

        for (const part of key.split('.')) {
            if (value == null) return undefined;
            value = value[part];
        }

        return value as T | undefined;
    }

    public t(key: string, placeholders: Record<string, string>): string {
        const value = this.get<string>(key);

        if (typeof value !== 'string') return key;
        if (!placeholders) return value;

        return Object.entries(placeholders).reduce(
            (result, [k, v]) => result.replaceAll(`{{${k}}}`, v),
            value
        );
    }
}