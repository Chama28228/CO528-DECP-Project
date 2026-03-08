package com.decp.event.dto;

import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class EventDTO {
    private UUID id;
    private String createdBy;
    private String title;
    private String description;
    private String eventType;
    private String location;
    private boolean online;
    private String onlineLink;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private Integer maxAttendees;
    private String imageUrl;
    private String status;
    private LocalDateTime createdAt;

    // RSVP stats
    private long goingCount;
    private long maybeCount;
    private long notGoingCount;

    // Current authenticated user's RSVP — null if they haven't RSVP'd
    private String myRsvpStatus;
}
