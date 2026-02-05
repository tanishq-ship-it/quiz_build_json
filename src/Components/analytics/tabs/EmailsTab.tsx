import { useState, useEffect } from 'react';
import { Mail, Search } from 'lucide-react';
import { getPaymentLeadsByQuiz } from '../../../services/api';
import type { PaymentLeadDto } from '../../../services/api';

interface EmailsTabProps {
  quizId: string;
}

export function EmailsTab({ quizId }: EmailsTabProps) {
  const [leads, setLeads] = useState<PaymentLeadDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    let cancelled = false;

    const loadLeads = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getPaymentLeadsByQuiz(quizId);
        if (!cancelled) {
          setLeads(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load emails');
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    void loadLeads();
    return () => {
      cancelled = true;
    };
  }, [quizId]);

  const filtered = search
    ? leads.filter((l) => l.email1.toLowerCase().includes(search.toLowerCase()))
    : leads;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-zinc-600 border-t-violet-400" />
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

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
        {/* Header */}
        <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="mb-1 text-lg font-medium text-zinc-100">Collected Emails</h3>
            <p className="text-sm text-zinc-500">
              {leads.length} email{leads.length !== 1 ? 's' : ''} collected from this quiz
            </p>
          </div>

          {/* Search */}
          {leads.length > 0 && (
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
              <input
                type="text"
                placeholder="Search emails..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-800 py-2 pl-9 pr-3 text-sm text-zinc-200 placeholder-zinc-500 outline-none focus:border-violet-500 sm:w-64"
              />
            </div>
          )}
        </div>

        {/* Email list */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Mail className="mb-3 h-12 w-12 text-zinc-700" />
            <p className="text-sm text-zinc-500">
              {leads.length === 0
                ? 'No emails collected for this quiz yet.'
                : 'No emails match your search.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-zinc-800">
                  <th className="pb-3 pr-4 text-left text-xs font-medium uppercase tracking-wider text-zinc-500">
                    #
                  </th>
                  <th className="pb-3 pr-4 text-left text-xs font-medium uppercase tracking-wider text-zinc-500">
                    Email
                  </th>
                  <th className="pb-3 pr-4 text-left text-xs font-medium uppercase tracking-wider text-zinc-500">
                    Location
                  </th>
                  <th className="pb-3 pr-4 text-left text-xs font-medium uppercase tracking-wider text-zinc-500">
                    Device
                  </th>
                  <th className="pb-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/50">
                {filtered.map((lead, idx) => (
                  <tr key={lead.id} className="group transition-colors hover:bg-zinc-800/30">
                    <td className="py-3 pr-4 text-sm text-zinc-600">{idx + 1}</td>
                    <td className="py-3 pr-4 text-sm font-medium text-zinc-200">{lead.email1}</td>
                    <td className="py-3 pr-4 text-sm text-zinc-400">
                      {lead.city && lead.country
                        ? `${lead.city}, ${lead.country}`
                        : lead.country ?? '—'}
                    </td>
                    <td className="py-3 pr-4 text-sm text-zinc-400 capitalize">
                      {lead.deviceType ?? '—'}
                    </td>
                    <td className="py-3 text-sm text-zinc-500">
                      {new Date(lead.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
