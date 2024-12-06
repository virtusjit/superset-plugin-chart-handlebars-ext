// initializeHelpers.ts
import Handlebars from 'handlebars';
import Helpers from 'just-handlebars-helpers';
import { registerFormatHelpers } from './formatHelpers';
import { registerAggregationHelpers } from './aggregationHelpers';
import { registerGroupingHelpers } from './groupingHelpers';
import { registerStringFunctionHelpers } from './stringFunctionHelpers';
import { registerMathFunctionHelpers } from './mathFunctionHelpers';


export function initializeCustomHelpers(): boolean {
  try {
    // Register format helpers
    registerFormatHelpers(Handlebars);

    // Register string function helpers
    registerStringFunctionHelpers(Handlebars);

    // Register string function helpers
    registerMathFunctionHelpers(Handlebars);

    // Register aggregation helpers
    registerAggregationHelpers(Handlebars);

    // Register grouping helpers
    registerGroupingHelpers(Handlebars);

    // Register additional helpers from just-handlebars-helpers
    Helpers.registerHelpers(Handlebars);

    return true;
  } catch (error) {
    console.error('Error initializing helpers:', error);
    return false;
  }
}