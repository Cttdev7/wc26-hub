// Map fuzzy / alternative team names (those returned by API-Football) → our
// internal 3-letter codes used in components/wc26/data.ts.
// Single source of truth for /api/scores, /api/standings, etc. so that
// matchings stay consistent across endpoints.

export const NAME_TO_CODE: Record<string, string> = {
  'france': 'FRA', 'brazil': 'BRA', 'argentina': 'ARG', 'portugal': 'POR',
  'spain': 'ESP', 'england': 'ENG', 'germany': 'GER', 'netherlands': 'NED',
  'mexico': 'MEX', 'usa': 'USA', 'united states': 'USA', 'canada': 'CAN',
  'japan': 'JPN', 'saudi arabia': 'KSA', 'new zealand': 'NZL',
  'belgium': 'BEL', 'australia': 'AUS', 'norway': 'NOR', 'tunisia': 'TUN',
  'croatia': 'CRO', 'iran': 'IRN', 'senegal': 'SEN', 'ecuador': 'ECU',
  'panama': 'PAN', 'korea republic': 'KOR', 'south korea': 'KOR',
  'cameroon': 'CMR', 'paraguay': 'PAR', 'switzerland': 'SUI',
  'colombia': 'COL', 'ghana': 'GHA', 'uruguay': 'URU', 'morocco': 'MAR',
  'egypt': 'EGY', 'italy': 'ITA', 'scotland': 'SCO', 'nigeria': 'NGA',
  'jamaica': 'JAM', 'denmark': 'DEN', 'poland': 'POL', 'ivory coast': 'CIV',
  "côte d'ivoire": 'CIV', 'costa rica': 'CRC', 'turkey': 'TUR',
  'türkiye': 'TUR', 'austria': 'AUT', 'chile': 'CHI', 'qatar': 'QAT',
  'sweden': 'SUE', 'peru': 'PER', 'algeria': 'ALG', 'honduras': 'HON',
}

export function codeFromName(apiName: string | undefined | null): string | null {
  if (!apiName) return null
  return NAME_TO_CODE[apiName.toLowerCase().trim()] ?? null
}
