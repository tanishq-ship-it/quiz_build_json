import { useState, useEffect } from 'react';
import { Globe, MousePointerClick, Link2, Earth, Search, ArrowLeft } from 'lucide-react';
import Lottie from 'lottie-react';
import { AnimatedCounter } from '../AnimatedCounter';
import { getBlogs } from '../../../services/api';
import type { BlogDto } from '../../../services/api';
import loadingAnimation from '../../../assests/Loding.json';

interface ButtonClickEntry { url: string; num_of_clicks: number }
interface CountryViewEntry { country: string; num: number }

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

function getBlogStats(blog: BlogDto) {
  const clicks: ButtonClickEntry[] = (blog.buttonClicks as ButtonClickEntry[] | null) ?? [];
  const views: CountryViewEntry[] = (blog.countryViews as CountryViewEntry[] | null) ?? [];
  return {
    totalClicks: clicks.reduce((sum, e) => sum + e.num_of_clicks, 0),
    totalViews: views.reduce((sum, e) => sum + e.num, 0),
    countries: views.length,
  };
}

export function BlogAnalyticsTab() {
  const [blogs, setBlogs] = useState<BlogDto[]>([]);
  const [selectedBlogId, setSelectedBlogId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hoveredClick, setHoveredClick] = useState<string | null>(null);
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getBlogs();
        setBlogs(data.filter((b) => !b.deletion));
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to load blogs');
      } finally {
        setIsLoading(false);
      }
    };
    void load();
  }, []);

  // Trigger mount animation when selecting a blog
  useEffect(() => {
    if (selectedBlogId) {
      setMounted(false);
      const t = setTimeout(() => setMounted(true), 50);
      return () => clearTimeout(t);
    }
  }, [selectedBlogId]);

  const selectedBlog = blogs.find((b) => b.id === selectedBlogId) ?? null;
  const buttonClicks: ButtonClickEntry[] = (selectedBlog?.buttonClicks as ButtonClickEntry[] | null) ?? [];
  const countryViews: CountryViewEntry[] = (selectedBlog?.countryViews as CountryViewEntry[] | null) ?? [];

  const totalClicks = buttonClicks.reduce((sum, e) => sum + e.num_of_clicks, 0);
  const totalViews = countryViews.reduce((sum, e) => sum + e.num, 0);
  const uniqueCountries = countryViews.length;
  const uniqueUrls = buttonClicks.length;

  const maxClicks = buttonClicks.length > 0 ? Math.max(...buttonClicks.map((e) => e.num_of_clicks)) : 1;
  const maxViews = countryViews.length > 0 ? Math.max(...countryViews.map((e) => e.num)) : 1;

  const sortedClicks = [...buttonClicks].sort((a, b) => b.num_of_clicks - a.num_of_clicks);
  const sortedViews = [...countryViews].sort((a, b) => b.num - a.num);

  const filteredBlogs = blogs.filter((b) =>
    b.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-40 w-40">
          <Lottie animationData={loadingAnimation} loop autoplay />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">
        {error}
      </div>
    );
  }

  if (blogs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <Globe className="mb-4 h-16 w-16 text-zinc-700" />
        <h3 className="mb-2 text-lg font-medium text-zinc-300">No blogs found</h3>
        <p className="text-sm text-zinc-500">Create a blog post first to see analytics.</p>
      </div>
    );
  }

  // ─── Blog selection view (no blog selected) ───
  if (!selectedBlogId) {
    return (
      <div className="space-y-6">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search blogs..."
            className="w-full rounded-xl border border-zinc-800 bg-zinc-900/50 py-3 pl-11 pr-4 text-sm text-zinc-200 placeholder-zinc-500 outline-none transition-colors focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20"
          />
        </div>

        {/* Blog Cards Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredBlogs.map((blog, index) => {
            const stats = getBlogStats(blog);
            return (
              <button
                key={blog.id}
                onClick={() => setSelectedBlogId(blog.id)}
                className="group relative overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/50 p-5 text-left transition-all duration-200 hover:border-violet-500/30 hover:shadow-lg hover:shadow-violet-500/5"
                style={{
                  animationDelay: `${index * 60}ms`,
                }}
              >
                {/* Glow on hover */}
                <div className="pointer-events-none absolute -right-6 -top-6 h-28 w-28 rounded-full bg-violet-500 opacity-0 blur-3xl transition-opacity duration-300 group-hover:opacity-10" />

                <div className="relative">
                  {/* Title + Status */}
                  <div className="mb-3 flex items-start justify-between gap-2">
                    <h3 className="line-clamp-2 text-sm font-semibold text-zinc-100 transition-colors group-hover:text-violet-200">
                      {blog.title}
                    </h3>
                    {blog.published ? (
                      <span className="shrink-0 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-400">
                        Live
                      </span>
                    ) : (
                      <span className="shrink-0 rounded-full bg-zinc-700/50 px-2 py-0.5 text-[10px] font-medium text-zinc-400">
                        Draft
                      </span>
                    )}
                  </div>

                  {/* Mini Stats Row */}
                  <div className="flex items-center gap-4 text-xs text-zinc-500">
                    <span className="flex items-center gap-1">
                      <MousePointerClick className="h-3 w-3" />
                      {stats.totalClicks} clicks
                    </span>
                    <span className="flex items-center gap-1">
                      <Earth className="h-3 w-3" />
                      {stats.totalViews} views
                    </span>
                    <span className="flex items-center gap-1">
                      <Globe className="h-3 w-3" />
                      {stats.countries} countries
                    </span>
                  </div>

                  {/* Date */}
                  <p className="mt-3 text-[11px] text-zinc-600">
                    {new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {filteredBlogs.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Search className="mb-3 h-10 w-10 text-zinc-700" />
            <p className="text-sm text-zinc-400">No blogs match "{searchQuery}"</p>
          </div>
        )}
      </div>
    );
  }

  // ─── Blog analytics detail view ───
  const kpiCards = [
    { label: 'Total Button Clicks', value: totalClicks, icon: MousePointerClick, color: '#8B5CF6' },
    { label: 'Total Page Views', value: totalViews, icon: Earth, color: '#3B82F6' },
    { label: 'Unique Countries', value: uniqueCountries, icon: Globe, color: '#10B981' },
    { label: 'Tracked URLs', value: uniqueUrls, icon: Link2, color: '#F59E0B' },
  ];

  return (
    <div className="space-y-6">
      {/* Back Button + Blog Title */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => { setSelectedBlogId(null); setSearchQuery(''); }}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-zinc-700/50 bg-zinc-800/50 text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-200"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="min-w-0">
          <h2 className="truncate text-lg font-semibold text-zinc-100">{selectedBlog?.title}</h2>
          <p className="text-xs text-zinc-500">
            {selectedBlog?.published ? 'Published' : 'Draft'}
            {' \u2022 '}
            {selectedBlog && new Date(selectedBlog.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpiCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className="group relative overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 transition-all hover:border-zinc-700 hover:shadow-lg"
              style={{
                opacity: mounted ? 1 : 0,
                transform: mounted ? 'translateY(0)' : 'translateY(12px)',
                transition: `opacity 0.5s ease ${index * 100}ms, transform 0.5s ease ${index * 100}ms`,
              }}
            >
              <div
                className="pointer-events-none absolute -right-4 -top-4 h-24 w-24 rounded-full opacity-10 blur-2xl transition-opacity group-hover:opacity-20"
                style={{ backgroundColor: card.color }}
              />
              <div className="relative">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-xs font-medium uppercase tracking-wide text-zinc-500">{card.label}</span>
                  <Icon className="h-4 w-4" style={{ color: card.color }} />
                </div>
                <AnimatedCounter
                  value={card.value}
                  className="text-2xl font-semibold text-zinc-100"
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Button Clicks Chart */}
      <section className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
        <div className="mb-1 flex items-center gap-2">
          <MousePointerClick className="h-5 w-5 text-violet-400" />
          <h3 className="text-lg font-medium text-zinc-100">Button Clicks by URL</h3>
        </div>
        <p className="mb-6 text-sm text-zinc-500">
          {sortedClicks.length} URL{sortedClicks.length !== 1 ? 's' : ''} tracked
          {totalClicks > 0 && ` \u2022 ${totalClicks.toLocaleString()} total clicks`}
        </p>

        {sortedClicks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <MousePointerClick className="mb-3 h-12 w-12 text-zinc-700" />
            <h3 className="mb-1 text-base font-medium text-zinc-300">No button clicks yet</h3>
            <p className="text-sm text-zinc-500">Click data will appear when users click buttons in this blog.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {sortedClicks.map((entry, idx) => (
              <div
                key={entry.url}
                className="group relative"
                onMouseEnter={() => setHoveredClick(entry.url)}
                onMouseLeave={() => setHoveredClick(null)}
                style={{
                  opacity: mounted ? 1 : 0,
                  transform: mounted ? 'translateX(0)' : 'translateX(-20px)',
                  transition: `opacity 0.4s ease ${idx * 80}ms, transform 0.4s ease ${idx * 80}ms`,
                }}
              >
                <div className="flex items-center gap-4">
                  <div className="w-48 shrink-0 overflow-hidden">
                    <span className="block truncate text-sm font-medium text-zinc-200" title={entry.url}>
                      {entry.url.replace(/^https?:\/\//, '').replace(/\/$/, '')}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="h-8 overflow-hidden rounded-md bg-zinc-800/50">
                      <div
                        className="flex h-full items-center rounded-md px-3 transition-all duration-500"
                        style={{
                          width: mounted ? `${Math.max((entry.num_of_clicks / maxClicks) * 100, 8)}%` : '0%',
                          backgroundColor: BAR_COLORS[idx % BAR_COLORS.length],
                          opacity: hoveredClick === null || hoveredClick === entry.url ? 1 : 0.3,
                          transitionDelay: `${idx * 80}ms`,
                        }}
                      >
                        <span className="text-xs font-medium text-white drop-shadow-sm">
                          {entry.num_of_clicks.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="w-14 shrink-0 text-right">
                    <span className="text-sm text-zinc-400">
                      {totalClicks > 0 ? Math.round((entry.num_of_clicks / totalClicks) * 100) : 0}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Country Views Chart */}
      <section className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
        <div className="mb-1 flex items-center gap-2">
          <Globe className="h-5 w-5 text-blue-400" />
          <h3 className="text-lg font-medium text-zinc-100">Views by Country</h3>
        </div>
        <p className="mb-6 text-sm text-zinc-500">
          {sortedViews.length} countr{sortedViews.length !== 1 ? 'ies' : 'y'} detected
          {totalViews > 0 && ` \u2022 ${totalViews.toLocaleString()} total views`}
        </p>

        {sortedViews.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Globe className="mb-3 h-12 w-12 text-zinc-700" />
            <h3 className="mb-1 text-base font-medium text-zinc-300">No country data yet</h3>
            <p className="text-sm text-zinc-500">Country data will appear as users visit this blog.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {sortedViews.map((entry, idx) => (
              <div
                key={entry.country}
                className="group relative"
                onMouseEnter={() => setHoveredCountry(entry.country)}
                onMouseLeave={() => setHoveredCountry(null)}
                style={{
                  opacity: mounted ? 1 : 0,
                  transform: mounted ? 'translateX(0)' : 'translateX(-20px)',
                  transition: `opacity 0.4s ease ${idx * 80}ms, transform 0.4s ease ${idx * 80}ms`,
                }}
              >
                <div className="flex items-center gap-4">
                  <div className="w-40 shrink-0">
                    <span className="text-sm font-medium text-zinc-200">
                      {getCountryName(entry.country)}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="h-8 overflow-hidden rounded-md bg-zinc-800/50">
                      <div
                        className="flex h-full items-center rounded-md px-3 transition-all duration-500"
                        style={{
                          width: mounted ? `${Math.max((entry.num / maxViews) * 100, 8)}%` : '0%',
                          backgroundColor: BAR_COLORS[idx % BAR_COLORS.length],
                          opacity: hoveredCountry === null || hoveredCountry === entry.country ? 1 : 0.3,
                          transitionDelay: `${idx * 80}ms`,
                        }}
                      >
                        <span className="text-xs font-medium text-white drop-shadow-sm">
                          {entry.num.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="w-14 shrink-0 text-right">
                    <span className="text-sm text-zinc-400">
                      {totalViews > 0 ? Math.round((entry.num / totalViews) * 100) : 0}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
