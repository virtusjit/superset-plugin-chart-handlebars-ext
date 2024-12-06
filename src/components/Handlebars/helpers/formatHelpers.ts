// formatHelpers.ts
import Handlebars from 'handlebars';
import moment from 'moment';
import { NumberFormatOptions } from './types';

export function registerFormatHelpers(hbs: typeof Handlebars): void {
  // Date formatting helper
  hbs.registerHelper('dateFormat', function(context: any, block: any) {
    const format = block.hash.format || 'YYYY-MM-DD';
    return moment(context).format(format);
  });

  // Number formatting helper
  hbs.registerHelper('vFormatNumber', function(value: any, handlebarsOptions: any): string {
    if (value == null) {
      return '-';
    }

    const numValue = Number(value);
    if (isNaN(numValue)) {
      console.warn('vformatNumber: cannot convert to number:', value);
      return '-';
    }

    const options: NumberFormatOptions = handlebarsOptions.hash || {};
    const isPercent = options.isPercent || false;
    const autoPercent = options.autoPercent ?? true;
    
    let pattern = options.pattern;
    if (!pattern) {
      pattern = isPercent ? '# ##0.#%' : '# ### ###.###';
    }
    const signPosition = options.signPosition || 'left';

    try {
      let processedValue = numValue;
      if (isPercent) {
        processedValue = (autoPercent && Math.abs(numValue) > 1) 
          ? numValue 
          : numValue * 100;
      }

      const [rawPattern, hasPercentSign] = isPercent 
        ? [pattern.replace('%', ''), pattern.includes('%')]
        : [pattern, false];
      const [intPattern, decPattern = ''] = rawPattern.split('.');
      let [intValue, decValue = ''] = Math.abs(processedValue).toString().split('.');

      const fillPattern = (value: string, pattern: string): string => {
        const digits = value.split('').reverse();
        const result: string[] = [];
        let digitIndex = 0;

        for (let i = pattern.length - 1; i >= 0; i--) {
          if (pattern[i] === '#' || pattern[i] === '0') {
            const digit = digits[digitIndex++] || '0';
            result.unshift(digit || pattern[i] === '0' ? digit : '');
          } else {
            result.unshift(pattern[i]);
          }
        }

        while (result.length > 1 && result[0] === '0' && pattern[0] !== '0') {
          const nextCharIsDelimiter = result[1] === ' ' || result[1] === ',';
          result.shift();
          if (nextCharIsDelimiter) result.shift();
        }

        return result.join('');
      };

      const hasDecimalPart = decValue.length > 0;
      const needsMinFraction = typeof options.minFraction === 'number' && options.minFraction > 0;

      if (hasDecimalPart || needsMinFraction) {
        if (typeof options.maxFraction === 'number') {
          decValue = decValue.slice(0, options.maxFraction);
        }

        if (typeof options.minFraction === 'number') {
          while (decValue.length < options.minFraction) {
            decValue += '0';
          }
        }
        
        if (decPattern) {
          decValue = fillPattern(decValue, decPattern);
        }
      }

      const formattedInt = fillPattern(intValue, intPattern);
      const formattedDec = decValue.length > 0 ? ',' + decValue : '';
      const formattedNumber = formattedInt + formattedDec + (hasPercentSign ? '%' : '');
      
      if (processedValue >= 0) {
        return formattedNumber;
      }

      switch (signPosition) {
        case 'left':
          return '-' + formattedNumber;
        case 'right':
          return formattedNumber + '-';
        case 'brackets':
          return '(' + formattedNumber + ')';
        case 'none':
          return formattedNumber;
        default:
          return '-' + formattedNumber;
      }

    } catch (error) {
      console.error('vformatNumber: formatting error:', error);
      return String(numValue) + (isPercent ? '%' : '');
    }
  });

  // Object stringification helper
  hbs.registerHelper('stringify', (obj: any, obj2: any) => {
    if (obj2 === undefined) {
      throw Error('Please specify an object. Example: `stringify myObj`');
    }
    return typeof obj === 'object' ? JSON.stringify(obj) : String(obj);
  });
}