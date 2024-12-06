import Handlebars from 'handlebars';
//import moment from 'moment';

export function registerStringFunctionHelpers(hbs: typeof Handlebars): void {

  hbs.registerHelper('vContains', function(obj: string, obj1: string, fromIndex?: number) {
    const check = obj.includes(obj1, fromIndex);
    return check;
  });
}