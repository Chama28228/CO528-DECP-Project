'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import AppLayout from '@/components/layout/AppLayout';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { eventApi, CreateEventRequest } from '@/lib/api/eventApi';
import { useAuth } from '@/contexts/AuthContext';

const EVENT_TYPES = ['SEMINAR', 'WORKSHOP', 'SOCIAL', 'CAREER_FAIR', 'ANNOUNCEMENT', 'OTHER'];
const EVENT_TYPE_LABELS: Record<string, string> = {
  SEMINAR: 'Seminar', WORKSHOP: 'Workshop', SOCIAL: 'Social',
  CAREER_FAIR: 'Career Fair', ANNOUNCEMENT: 'Announcement', OTHER: 'Other',
};

function toLocalDatetime(isoStr: string) {
  // Convert ISO string to value suitable for datetime-local input
  const d = new Date(isoStr);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default function EditEventPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuth();

  const [form, setForm] = useState({
    title: '', description: '', eventType: 'SEMINAR',
    location: '', online: false, onlineLink: '',
    startTimeLocal: '', endTimeLocal: '',
    maxAttendees: '' as string | number,
    imageUrl: '',
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user?.role !== 'ADMIN') { router.replace('/events'); return; }
    eventApi.getEvent(id)
      .then(event => {
        setForm({
          title:          event.title,
          description:    event.description,
          eventType:      event.eventType,
          location:       event.location ?? '',
          online:         event.online,
          onlineLink:     event.onlineLink ?? '',
          startTimeLocal: toLocalDatetime(event.startTime),
          endTimeLocal:   toLocalDatetime(event.endTime),
          maxAttendees:   event.maxAttendees ?? '',
          imageUrl:       event.imageUrl ?? '',
        });
      })
      .catch(() => setError('Event not found.'))
      .finally(() => setLoading(false));
  }, [id, user, router]);

  const set = (field: string, value: unknown) =>
    setForm(prev => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const payload: CreateEventRequest = {
        title:        form.title,
        description:  form.description,
        eventType:    form.eventType,
        location:     form.location || undefined,
        online:       form.online,
        onlineLink:   form.onlineLink || undefined,
        startTime:    new Date(form.startTimeLocal).toISOString(),
        endTime:      new Date(form.endTimeLocal).toISOString(),
        maxAttendees: form.maxAttendees !== '' ? Number(form.maxAttendees) : undefined,
        imageUrl:     form.imageUrl || undefined,
      };
      await eventApi.updateEvent(id, payload);
      router.push(`/events/${id}`);
    } catch {
      setError('Failed to update event.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ProtectedRoute>
      <AppLayout>
        <div className="max-w-2xl mx-auto py-6 px-4">
          <Link href={`/events/${id}`} className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-blue-600 mb-4 transition-colors">
            ← Back to Event
          </Link>

          {loading ? (
            <div className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse space-y-4">
              <div className="h-5 bg-gray-200 rounded w-1/2" />
              <div className="h-3 bg-gray-100 rounded w-full" />
            </div>
          ) : error ? (
            <p className="text-center text-red-500 py-16">{error}</p>
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <h1 className="text-xl font-bold text-gray-900 mb-6">Edit Event</h1>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Event Title *</label>
                  <input
                    required value={form.title}
                    onChange={e => set('title', e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Event Type *</label>
                  <select
                    value={form.eventType} onChange={e => set('eventType', e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400 bg-white"
                  >
                    {EVENT_TYPES.map(t => <option key={t} value={t}>{EVENT_TYPE_LABELS[t]}</option>)}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Date & Time *</label>
                    <input type="datetime-local" value={form.startTimeLocal}
                      onChange={e => set('startTimeLocal', e.target.value)}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">End Date & Time *</label>
                    <input type="datetime-local" value={form.endTimeLocal}
                      onChange={e => set('endTimeLocal', e.target.value)}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <input value={form.location} onChange={e => set('location', e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400" />
                </div>

                <div className="space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" checked={form.online}
                      onChange={e => set('online', e.target.checked)} className="w-4 h-4 rounded" />
                    <span className="text-sm text-gray-700">Online / Virtual event</span>
                  </label>
                  {form.online && (
                    <input type="url" value={form.onlineLink}
                      onChange={e => set('onlineLink', e.target.value)}
                      placeholder="https://meet.google.com/..."
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400" />
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Max Attendees</label>
                  <input type="number" min={1} value={form.maxAttendees}
                    onChange={e => set('maxAttendees', e.target.value)}
                    placeholder="Leave blank for unlimited"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                  <textarea required rows={5} value={form.description}
                    onChange={e => set('description', e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400 resize-none" />
                </div>

                {error && <p className="text-sm text-red-500">{error}</p>}

                <div className="flex gap-3 pt-2">
                  <Link href={`/events/${id}`}
                    className="px-5 py-2 text-sm border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors">
                    Cancel
                  </Link>
                  <button type="submit" disabled={submitting}
                    className="flex-1 py-2 text-sm bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors">
                    {submitting ? 'Saving…' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </AppLayout>
    </ProtectedRoute>
  );
}
