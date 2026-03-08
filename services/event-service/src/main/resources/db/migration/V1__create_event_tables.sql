-- V1: Events and RSVPs schema

CREATE TABLE events (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_by      VARCHAR(128) NOT NULL,
    title           VARCHAR(255) NOT NULL,
    description     TEXT NOT NULL,
    event_type      VARCHAR(20) NOT NULL,
    location        VARCHAR(255),
    is_online       BOOLEAN DEFAULT FALSE,
    online_link     VARCHAR(1024),
    start_time      TIMESTAMP NOT NULL,
    end_time        TIMESTAMP NOT NULL,
    max_attendees   INTEGER,
    image_url       VARCHAR(1024),
    status          VARCHAR(20) NOT NULL DEFAULT 'UPCOMING',
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE event_rsvps (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id        UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    user_id         VARCHAR(128) NOT NULL,
    status          VARCHAR(20) NOT NULL DEFAULT 'GOING',
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(event_id, user_id)
);

CREATE INDEX idx_events_status     ON events(status);
CREATE INDEX idx_events_start_time ON events(start_time);
CREATE INDEX idx_events_type       ON events(event_type);
CREATE INDEX idx_event_rsvps_event ON event_rsvps(event_id);
CREATE INDEX idx_event_rsvps_user  ON event_rsvps(user_id);
