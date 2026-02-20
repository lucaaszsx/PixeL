import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import yamlParser from 'yaml';

type AnyObject = Record<string, any>;

function isObject(value: any): boolean {
    return value && typeof value === 'object' && !Array.isArray(value);
}

function deepMerge(target: AnyObject, source: AnyObject): AnyObject {
    for (const key of Object.keys(source)) {
        const targetValue = target[key];
        const sourceValue = source[key];

        if (isObject(sourceValue) && isObject(targetValue))
            target[key] = deepMerge({ ...targetValue }, sourceValue);
        else
            target[key] = sourceValue;
    }

    return target;
}

function loadDirectory(dir: string, accumulator: AnyObject = {}): AnyObject {
    for (const entry of readdirSync(dir)) {
        const fullPath = join(dir, entry);
        
        if (statSync(fullPath).isDirectory()) {
            loadDirectory(fullPath, accumulator);
            continue;
        }
        if (!/\.(yaml|yml)$/.test(entry)) continue;

        const content = readFileSync(fullPath, 'utf-8');

        deepMerge(accumulator, yamlParser.parse(content)); 
    }

    return accumulator;
}

export function loadLocales() {
    const localesPath = join(__dirname, 'locales');
    const locales = new Map<string, AnyObject>();

    for (const locale of readdirSync(localesPath)) {
        const localeDir = join(localesPath, locale);

        if (!statSync(localeDir).isDirectory()) continue;

        const data = loadDirectory(localeDir);

        locales.set(locale, Object.freeze(data));
    }

    return locales;
}