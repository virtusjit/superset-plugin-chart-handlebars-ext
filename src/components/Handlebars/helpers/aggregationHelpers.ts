// aggregationHelpers.ts
import Handlebars from 'handlebars';

export function registerAggregationHelpers(hbs: typeof Handlebars): void {
  // Sum helper
  hbs.registerHelper('vSum', function(context: any, field: string): number {
    const items = Array.isArray(context) ? context : context?.this;
    return items.reduce((sum: number, item: any) => {
      const value = item[field];
      const numValue = Number(value);
      return sum + numValue;
    }, 0);
  });

  // Average helper
  hbs.registerHelper('vAvg', function(context: any, field: string): number {
    const items = Array.isArray(context) ? context : context?.this;
    
    if (items.length > 0) {
      const total = items.reduce((sum: number, item: any) => {
        const value = item[field];
        const numValue = Number(value);
        return sum + numValue;
      }, 0);
      return total / items.length;
    }
    return 0;
  });

  // Count helper
  hbs.registerHelper('vCount', function(context: any): number {
    if (context == null) {
      console.warn('aCount: received empty context');
      return 0;
    }

    const items = Array.isArray(context) ? context : context?.this;
    
    if (!Array.isArray(items)) {
      console.warn('aCount: could not get array from context:', context);
      return 0;
    }

    return items.length;
  });

  // Distinct count helper
  hbs.registerHelper('vDistinctCount', function(context: any, field: string): number {
    const items = Array.isArray(context) ? context : context?.this;

    if (!Array.isArray(items)) {
      console.warn('distinctCount: received non-array:', context);
      return 0;
    }

    if (!field) {
      console.warn('distinctCount: no field specified');
      return 0;
    }

    const uniqueValues = new Set(
      items
        .map(item => item[field])
        .filter(value => value != null)
        .map(value => String(value).trim())
    );

    return uniqueValues.size;
  });
}