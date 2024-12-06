// groupingHelpers.ts
import Handlebars from 'handlebars';
import moment from 'moment';
import { GroupByOptions, FieldType } from './types';

export function registerGroupingHelpers(hbs: typeof Handlebars): void {
  hbs.registerHelper('vGroupBy', function(data: any[], options: GroupByOptions): string {
    const getGroupKey = (value: any, type: FieldType, format?: string): string => {
      switch (type) {
        case 'date':
          return moment(value).format(format || 'MMMM YYYY');
        case 'number':
          return String(value).padStart(20, '0');
        default:
          return String(value);
      }
    };

    const getDisplayValue = (value: any, type: FieldType, format?: string): string => {
      switch (type) {
        case 'date':
          return moment(value).format(format || 'MMMM YYYY');
        case 'number':
          return new Intl.NumberFormat('ru-RU').format(value);
        default:
          return String(value);
      }
    };

    const groups: { [key: string]: any[] } = {};
    const displayValues: { [key: string]: string } = {};

    data.forEach(item => {
      const value = item[options.hash.field];
      const groupKey = getGroupKey(value, options.hash.type, options.hash.format);
      
      if (!groups[groupKey]) {
        groups[groupKey] = [];
        displayValues[groupKey] = getDisplayValue(value, options.hash.type, options.hash.format);
      }
      groups[groupKey].push(item);
    });

    let result = '';
    Object.keys(groups).sort().forEach(key => {
      const context = {
        '@key': key,
        this: groups[key],
        displayValue: displayValues[key]
      };
      result += options.fn(context);
    });

    return result;
  });
}