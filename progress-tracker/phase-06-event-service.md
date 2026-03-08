# Phase 6: Event Service — Events & RSVP

## Status: COMPLETE

## Steps

- [x] Step 6.1 — Flyway migration: V1__create_event_tables.sql (events, event_rsvps)
- [x] Step 6.2 — Implement API endpoints (CRUD events, RSVP, attendees)
- [x] Step 6.3 — RabbitMQ event publishing (event.created → NEW_EVENT)
- [x] Step 6.4 — Flyway seed migration: V999__seed_events.sql
- [x] Step 6.5 — Next.js event pages (/events, /events/{id}, /events/create, /events/{id}/edit)

## Backend Deliverables

| File | Description |
|------|-------------|
| `V1__create_event_tables.sql` | Full events + event_rsvps schema with indexes |
| `entity/Event.java` | JPA entity with all event fields |
| `entity/EventRsvp.java` | JPA entity for RSVPs (UNIQUE event_id + user_id) |
| `repository/EventRepository.java` | Native search query with status + type filters |
| `repository/EventRsvpRepository.java` | findByEventIdAndUserId, countByEventIdAndStatus, paginated attendee list |
| `dto/EventDTO.java` | Response DTO with RSVP counts + myRsvpStatus |
| `dto/CreateEventRequest.java` | Create/update request with validation |
| `dto/RsvpRequest.java` | RSVP request body { status: GOING / MAYBE / NOT_GOING } |
| `dto/AttendeeDTO.java` | Attendee list item (userId, rsvpStatus, rsvpedAt) |
| `service/EventService.java` | Interface (7 methods) |
| `service/EventServiceImpl.java` | Full implementation with RabbitMQ publish on create |
| `controller/EventController.java` | 7 REST endpoints |
| `config/RabbitMQConfig.java` | TopicExchange + Jackson2JsonMessageConverter + RabbitTemplate |
| `V999__seed_events.sql` | 5 sample events (seminar, workshop, social, career fair, online seminar) |

## Frontend Deliverables

| File | Description |
|------|-------------|
| `lib/api/eventApi.ts` | All event API calls + TypeScript types + EVENT_TYPE_LABELS/COLORS maps |
| `app/events/page.tsx` | Event listing — 2-column grid, Upcoming/All toggle, type filter, Load More |
| `app/events/[id]/page.tsx` | Event detail — full info, RSVP buttons (Going/Maybe/Not Going), RSVP counts, attendee list |
| `app/events/create/page.tsx` | Event creation form (admin only) with datetime-local inputs |
| `app/events/[id]/edit/page.tsx` | Event edit form (admin only), pre-filled with existing data |

## Issues & Resolutions

| # | Issue | Resolution |
|---|-------|------------|
| 1 | V1 was a placeholder `SELECT 1` from Phase 1 scaffold | Replaced with real schema (event-service hadn't been started yet, so Flyway had not checksummed it) |

## Decision Changes

| # | Original Plan | Change | Reason |
|---|---------------|--------|--------|
| 1 | Plan mentioned only /events/create | Added /events/{id}/edit | Consistent with job-service pattern; admins need to edit events |

## Pending Actions

- Replace `REPLACE_WITH_ADMIN_FIREBASE_UID` in `V999__seed_events.sql` with your actual admin Firebase UID before starting the service.
- Make sure `event_db` database exists in PostgreSQL before starting the service.
