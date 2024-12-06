import Handlebars from 'handlebars';
//import moment from 'moment';

export function registerMathFunctionHelpers(hbs: typeof Handlebars): void {

  hbs.registerHelper('vDiv', function(obj: number, obj1: number) {
    if (obj1!=0) {
      const quotient = obj/obj1;
      return quotient;
    }
    else return 0;
  });
}