import apiClient from './apiClient';

export interface EventDTO {
  id: string;
  createdBy: string;
  title: string;
  description: string;
  eventType: string;
  location?: string;
  online: boolean;
  onlineLink?: string;
  startTime: string;
  endTime: string;
  maxAttendees?: number;
  imageUrl?: string;
  status: string;
  createdAt: string;
  goingCount: number;
  maybeCount: number;
  notGoingCount: number;
  myRsvpStatus?: string; // 'GOING' | 'MAYBE' | 'NOT_GOING' | null
}

export interface CreateEventRequest {
  title: string;
  description: string;
  eventType: string;
  location?: string;
  online?: boolean;
  onlineLink?: string;
  startTime: string; // ISO string
  endTime: string;
  maxAttendees?: number;
  imageUrl?: string;
}

export interface AttendeeDTO {
  userId: string;
  rsvpStatus: string;
  rsvpedAt: string;
}

export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
  last: boolean;
}

export const EVENT_TYPE_LABELS: Record<string, string> = {
  SEMINAR:      'Seminar',
  WORKSHOP:     'Workshop',
  SOCIAL:       'Social',
  CAREER_FAIR:  'Career Fair',
  ANNOUNCEMENT: 'Announcement',
  OTHER:        'Other',
};

export const EVENT_TYPE_COLORS: Record<string, string> = {
  SEMINAR:      'bg-blue-100 text-blue-700',
  WORKSHOP:     'bg-purple-100 text-purple-700',
  SOCIAL:       'bg-green-100 text-green-700',
  CAREER_FAIR:  'bg-orange-100 text-orange-700',
  ANNOUNCEMENT: 'bg-yellow-100 text-yellow-700',
  OTHER:        'bg-gray-100 text-gray-600',
};

export const eventApi = {
  listEvents: (params: {
    status?: string;
    type?: string;
    page?: number;
    size?: number;
  }): Promise<Page<EventDTO>> =>
    apiClient.get('/api/events', { params }).then(r => r.data),

  getEvent: (id: string): Promise<EventDTO> =>
    apiClient.get(`/api/events/${id}`).then(r => r.data),

  createEvent: (data: CreateEventRequest): Promise<EventDTO> =>
    apiClient.post('/api/events', data).then(r => r.data),

  updateEvent: (id: string, data: CreateEventRequest): Promise<EventDTO> =>
    apiClient.put(`/api/events/${id}`, data).then(r => r.data),

  deleteEvent: (id: string): Promise<void> =>
    apiClient.delete(`/api/events/${id}`).then(r => r.data),

  rsvp: (id: string, status: string): Promise<EventDTO> =>
    apiClient.post(`/api/events/${id}/rsvp`, { status }).then(r => r.data),

  getAttendees: (id: string, page = 0, size = 20): Promise<Page<AttendeeDTO>> =>
    apiClient.get(`/api/events/${id}/attendees`, { params: { page, size } }).then(r => r.data),
};
