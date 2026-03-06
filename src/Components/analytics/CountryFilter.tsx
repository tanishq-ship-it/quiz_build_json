import { useState, useRef, useEffect } from 'react';
import { Globe, ChevronDown, X } from 'lucide-react';

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

interface CountryFilterProps {
  countries: string[];
  selectedCountry: string | null;
  onSelect: (country: string | null) => void;
}

export function CountryFilter({ countries, selectedCountry, onSelect }: CountryFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (countries.length === 0) return null;

  return (
    <div className="relative" ref={ref}>
      <div className="flex items-center gap-2">
        <span className="text-xs font-medium uppercase tracking-wide text-zinc-500">
          Country
        </span>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-all ${
            selectedCountry
              ? 'border border-violet-500/50 bg-violet-500/10 text-violet-300 shadow-sm shadow-violet-500/10'
              : 'border border-zinc-700/50 bg-zinc-800/50 text-zinc-300 hover:bg-zinc-800 hover:text-zinc-200'
          }`}
        >
          <Globe className="h-3.5 w-3.5" />
          <span>{selectedCountry ? getCountryName(selectedCountry) : 'All Countries'}</span>
          <ChevronDown className={`h-3 w-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>
        {selectedCountry && (
          <button
            onClick={() => onSelect(null)}
            className="flex h-6 w-6 items-center justify-center rounded-md text-zinc-500 transition-colors hover:bg-zinc-800 hover:text-zinc-300"
            title="Clear country filter"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {isOpen && (
        <div className="absolute right-0 top-full z-30 mt-2 max-h-64 w-56 overflow-y-auto rounded-lg border border-zinc-700 bg-zinc-800 py-1 shadow-xl">
          <button
            onClick={() => { onSelect(null); setIsOpen(false); }}
            className={`flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition-colors ${
              !selectedCountry
                ? 'bg-violet-500/10 text-violet-300'
                : 'text-zinc-300 hover:bg-zinc-700/50'
            }`}
          >
            <Globe className="h-3.5 w-3.5 text-zinc-500" />
            All Countries
          </button>
          {countries.map((code) => (
            <button
              key={code}
              onClick={() => { onSelect(code); setIsOpen(false); }}
              className={`flex w-full items-center justify-between px-3 py-2 text-left text-sm transition-colors ${
                selectedCountry === code
                  ? 'bg-violet-500/10 text-violet-300'
                  : 'text-zinc-300 hover:bg-zinc-700/50'
              }`}
            >
              <span>{getCountryName(code)}</span>
              <span className="text-xs text-zinc-500">{code}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
