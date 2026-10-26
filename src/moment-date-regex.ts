import { DEFAULT_DATE_FORMAT, DATE_REGEX } from './constants';
import { moment } from "obsidian";

type MomentFormatter = (date: Date) => { format: (format: string) => string };

export default class MomentDateRegex {
    replace(input: string): string {
        //A regex to capture multiple matches, each with a target group ({date:YYMMDD}) and date group (YYMMDD)
        const matches = [...input.matchAll(DATE_REGEX)];
        //Return the input unchanged if no dates are found
        if(matches.length === 0){
          return input;
        }
        const now = new Date();
        //Transform date matches into moment formatted dates
        const formattedDates: [string, string][] = matches.map(m => {
          //Default to YYYYMMDDHHmm if {{date}} is used
          const dateFormat = m.groups?.date ? m.groups.date : DEFAULT_DATE_FORMAT;
          return [m.groups?.target ?? '', this.getMoment(now, dateFormat)];
        });

        let output = input;
        formattedDates.forEach(([target, formatted]) => {
          output = output.replace(target, formatted);
        });
        return output;
      }

      getMoment(now: Date, dateFormat: string): string {
          const format = moment as unknown as MomentFormatter;
          return format(now).format(dateFormat);
      }
}
