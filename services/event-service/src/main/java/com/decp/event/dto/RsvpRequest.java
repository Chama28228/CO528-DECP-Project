package com.decp.event.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class RsvpRequest {

    @NotBlank
    private String status; // GOING | MAYBE | NOT_GOING
}
