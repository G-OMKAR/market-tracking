package com.agmarknet.model;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "price_arrivals", indexes = {
        @Index(name = "idx_price_arrival_date", columnList = "arrival_date"),
        @Index(name = "idx_price_arrival_market", columnList = "market_id"),
        @Index(name = "idx_price_arrival_commodity", columnList = "commodity_id"),
        @Index(name = "idx_price_arrival_variety", columnList = "variety_id")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PriceArrival {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "arrival_date", nullable = false)
    private LocalDate arrivalDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "state_id", nullable = false)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private State state;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "district_id", nullable = false)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private District district;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "market_id", nullable = false)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Market market;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "commodity_group_id", nullable = false)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private CommodityGroup commodityGroup;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "commodity_id", nullable = false)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Commodity commodity;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "variety_id")
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Variety variety;

    @Column(name = "grade", length = 20)
    private String grade;  // FAQ, Super, Grade-A etc.

    @Column(name = "min_price", precision = 10, scale = 2)
    private BigDecimal minPrice;

    @Column(name = "max_price", precision = 10, scale = 2)
    private BigDecimal maxPrice;

    @Column(name = "modal_price", precision = 10, scale = 2)
    private BigDecimal modalPrice;

    @Column(name = "arrival_quantity", precision = 12, scale = 2)
    private BigDecimal arrivalQuantity;  // in tonnes

    @Column(name = "price_unit", length = 30)
    private String priceUnit;  // Per Quintal, Per KG, etc.
}
