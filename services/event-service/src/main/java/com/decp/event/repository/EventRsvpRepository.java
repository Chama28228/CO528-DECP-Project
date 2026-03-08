package com.decp.event.repository;

import com.decp.event.entity.EventRsvp;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface EventRsvpRepository extends JpaRepository<EventRsvp, UUID> {

    Optional<EventRsvp> findByEventIdAndUserId(UUID eventId, String userId);

    long countByEventIdAndStatus(UUID eventId, String status);

    // Excludes NOT_GOING — only people who are attending or considering attending
    Page<EventRsvp> findByEventIdAndStatusNotOrderByCreatedAtAsc(UUID eventId, String excludedStatus, Pageable pageable);
}
