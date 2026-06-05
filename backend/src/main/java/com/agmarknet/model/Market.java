package com.agmarknet.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "markets")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Market {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 150)
    private String name;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "district_id", nullable = false)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private District district;
}
