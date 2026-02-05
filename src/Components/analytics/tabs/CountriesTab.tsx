import { useState } from 'react';
import { Globe, MapPin } from 'lucide-react';
import type { QuizAnalyticsDto } from '../../../types/analytics';

interface CountriesTabProps {
  analytics: QuizAnalyticsDto;
}

const COUNTRY_NAMES: Record<string, string> = {
  US: 'United States', GB: 'United Kingdom', CA: 'Canada', AU: 'Australia',
  DE: 'Germany', FR: 'France', IN: 'India', BR: 'Brazil', JP: 'Japan',
  MX: 'Mexico', ES: 'Spain', IT: 'Italy', NL: 'Netherlands', SE: 'Sweden',
  NO: 'Norway', DK: 'Denmark', FI: 'Finland', PL: 'Poland', PT: 'Portugal',
  IE: 'Ireland', NZ: 'New Zealand', SG: 'Singapore', KR: 'South Korea',
  CN: 'China', RU: 'Russia', ZA: 'South Africa', AR: 'Argentina',
  CO: 'Colombia', CL: 'Chile', PH: 'Philippines', ID: 'Indonesia',
  TH: 'Thailand', MY: 'Malaysia', VN: 'Vietnam', PK: 'Pakistan',
  BD: 'Bangladesh', NG: 'Nigeria', EG: 'Egypt', KE: 'Kenya',
  AE: 'United Arab Emirates', SA: 'Saudi Arabia', IL: 'Israel',
  TR: 'Turkey', UA: 'Ukraine', CZ: 'Czech Republic', RO: 'Romania',
  HU: 'Hungary', GR: 'Greece', AT: 'Austria', CH: 'Switzerland',
  BE: 'Belgium', HK: 'Hong Kong', TW: 'Taiwan',
};

function getCountryName(code: string): string {
  return COUNTRY_NAMES[code] || code;
}

const BAR_COLORS = [
  '#8B5CF6', '#3B82F6', '#10B981', '#F59E0B', '#EF4444',
  '#EC4899', '#6366F1', '#14B8A6', '#F97316', '#06B6D4',
];

export function CountriesTab({ analytics }: CountriesTabProps) {
  const { countryDistribution } = analytics;
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);

  if (!countryDistribution || countryDistribution.length === 0) {
    return (
      <div className="space-y-6">
        <section className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Globe className="mb-3 h-12 w-12 text-zinc-700" />
            <h3 className="mb-1 text-lg font-medium text-zinc-300">No location data yet</h3>
            <p className="text-sm text-zinc-500">
              Country data will appear as new users take the quiz.
            </p>
          </div>
        </section>
      </div>
    );
  }

  const maxCount = countryDistribution[0]?.count || 1;

  return (
    <div className="space-y-6">
      {/* Country breakdown */}
      <section className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
        <h3 className="mb-1 text-lg font-medium text-zinc-100">Users by Country</h3>
        <p className="mb-6 text-sm text-zinc-500">
          {countryDistribution.length} countr{countryDistribution.length !== 1 ? 'ies' : 'y'} detected
          {' \u2022 '}Hover to see cities
        </p>

        <div className="space-y-3">
          {countryDistribution.map((item, idx) => (
            <div
              key={item.country}
              className="group relative"
              onMouseEnter={() => setHoveredCountry(item.country)}
              onMouseLeave={() => setHoveredCountry(null)}
            >
              <div className="flex items-center gap-4">
                {/* Country name */}
                <div className="w-40 shrink-0">
                  <span className="text-sm font-medium text-zinc-200">
                    {getCountryName(item.country)}
                  </span>
                </div>

                {/* Bar */}
                <div className="flex-1">
                  <div className="h-8 overflow-hidden rounded-md bg-zinc-800/50">
                    <div
                      className="flex h-full items-center rounded-md px-3 transition-all duration-500"
                      style={{
                        width: `${Math.max((item.count / maxCount) * 100, 8)}%`,
                        backgroundColor: BAR_COLORS[idx % BAR_COLORS.length],
                        opacity: hoveredCountry === null || hoveredCountry === item.country ? 1 : 0.3,
                      }}
                    >
                      <span className="text-xs font-medium text-white drop-shadow-sm">
                        {item.count.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Percentage */}
                <div className="w-14 shrink-0 text-right">
                  <span className="text-sm text-zinc-400">{item.percentage}%</span>
                </div>
              </div>

              {/* Cities tooltip on hover */}
              {hoveredCountry === item.country && item.cities.length > 0 && (
                <div className="absolute left-44 top-full z-20 mt-1 w-64 rounded-lg border border-zinc-700 bg-zinc-800 p-3 shadow-xl">
                  <div className="mb-2 flex items-center gap-1.5 text-xs font-medium text-zinc-400">
                    <MapPin className="h-3 w-3" />
                    Cities in {getCountryName(item.country)}
                  </div>
                  <div className="max-h-48 space-y-1.5 overflow-y-auto">
                    {item.cities.map((city) => (
                      <div key={city.city} className="flex items-center justify-between">
                        <span className="text-sm text-zinc-300">{city.city}</span>
                        <span className="text-xs text-zinc-500">{city.count.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
