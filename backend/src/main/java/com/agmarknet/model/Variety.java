package com.agmarknet.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "varieties")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Variety {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String name;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "commodity_id", nullable = false)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Commodity commodity;
}
