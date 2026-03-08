package com.decp.event.dto;

import lombok.*;

import java.time.LocalDateTime;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class AttendeeDTO {
    private String userId;
    private String rsvpStatus;
    private LocalDateTime rsvpedAt;
}
