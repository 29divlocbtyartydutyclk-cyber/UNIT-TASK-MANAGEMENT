/**
 * Bangladesh government holidays, 2026.
 *
 * Fixed-date holidays (Independence Day, Victory Day, etc.) are exact.
 * Islamic calendar holidays (Eid, Shab-e-Barat, Ashura, etc.) depend on
 * moon sighting and are only confirmed by the government close to the
 * date - the dates below are best estimates from published 2026
 * calendars and may shift by a day. Update this file if an official
 * date differs.
 */
export interface Holiday {
  date: string; // YYYY-MM-DD
  name: string;
  estimated?: boolean;
}

export const BD_HOLIDAYS_2026: Holiday[] = [
  { date: "2026-02-04", name: "Shab-e-Barat", estimated: true },
  { date: "2026-02-21", name: "Language Martyrs' Day" },
  { date: "2026-03-17", name: "Shab-e-Qadr", estimated: true },
  { date: "2026-03-20", name: "Eid-ul-Fitr Holiday", estimated: true },
  { date: "2026-03-21", name: "Eid-ul-Fitr", estimated: true },
  { date: "2026-03-22", name: "Eid-ul-Fitr Holiday", estimated: true },
  { date: "2026-03-23", name: "Eid-ul-Fitr Holiday", estimated: true },
  { date: "2026-03-26", name: "Independence Day" },
  { date: "2026-04-14", name: "Bengali New Year" },
  { date: "2026-05-01", name: "May Day / Buddha Purnima" },
  { date: "2026-05-25", name: "Eid-ul-Adha Holiday", estimated: true },
  { date: "2026-05-26", name: "Eid-ul-Adha Holiday", estimated: true },
  { date: "2026-05-27", name: "Eid-ul-Adha", estimated: true },
  { date: "2026-05-28", name: "Eid-ul-Adha Holiday", estimated: true },
  { date: "2026-06-26", name: "Ashura", estimated: true },
  { date: "2026-08-05", name: "July Uprising Day" },
  { date: "2026-08-15", name: "National Mourning Day" },
  { date: "2026-08-26", name: "Eid-e-Miladunnabi", estimated: true },
  { date: "2026-09-04", name: "Janmashtami", estimated: true },
  { date: "2026-10-20", name: "Durga Puja", estimated: true },
  { date: "2026-10-21", name: "Vijaya Dashami", estimated: true },
  { date: "2026-11-07", name: "National Revolution and Solidarity Day" },
  { date: "2026-12-16", name: "Victory Day" },
  { date: "2026-12-25", name: "Christmas Day" },
];

export function getHoliday(date: Date): Holiday | undefined {
  const key = [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");
  return BD_HOLIDAYS_2026.find((h) => h.date === key);
}
