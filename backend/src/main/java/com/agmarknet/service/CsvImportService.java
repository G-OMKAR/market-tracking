package com.agmarknet.service;

import com.agmarknet.model.*;
import com.agmarknet.repository.*;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;

import java.math.BigDecimal;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class CsvImportService {

    private final StateRepository stateRepository;

    private final DistrictRepository districtRepository;

    private final MarketRepository marketRepository;

    private final CommodityRepository commodityRepository;

    private final CommodityGroupRepository commodityGroupRepository;

    private final PriceArrivalRepository priceArrivalRepository;

    public void importCsv() {

        try {

            InputStream is =
                    getClass()
                            .getResourceAsStream(
                                    "/data/prices.csv"
                            );

            if (is == null) {

                System.out.println(
                        "CSV file not found"
                );

                return;
            }

            BufferedReader reader =
                    new BufferedReader(
                            new InputStreamReader(is)
                    );

            String line;

            // Skip header
            reader.readLine();

            while (
                    (line = reader.readLine()) != null
            ) {

                String[] data =
                        line.split(",");

                LocalDate date =
                        LocalDate.parse(
                                data[0]
                        );

                String stateName =
                        data[1];

                String districtName =
                        data[2];

                String marketName =
                        data[3];

                String commodityName =
                        data[4];

                double minPrice =
                        Double.parseDouble(
                                data[5]
                        );

                double maxPrice =
                        Double.parseDouble(
                                data[6]
                        );

                double modalPrice =
                        Double.parseDouble(
                                data[7]
                        );

                double arrival =
                        Double.parseDouble(
                                data[8]
                        );

                // ---- Find/Create State ----

                State state =
                        stateRepository
                                .findAll()
                                .stream()
                                .filter(s ->
                                        s.getName()
                                                .equalsIgnoreCase(
                                                        stateName
                                                )
                                )
                                .findFirst()
                                .orElseGet(() ->
                                        stateRepository.save(
                                                State.builder()
                                                        .name(stateName)
                                                        .code(
                                                                stateName
                                                                        .substring(0, 2)
                                                                        .toUpperCase()
                                                        )
                                                        .build()
                                        )
                                );

                // ---- Find/Create District ----

                District district =
                        districtRepository
                                .findAll()
                                .stream()
                                .filter(d ->
                                        d.getName()
                                                .equalsIgnoreCase(
                                                        districtName
                                                )
                                )
                                .findFirst()
                                .orElseGet(() ->
                                        districtRepository.save(
                                                District.builder()
                                                        .name(districtName)
                                                        .state(state)
                                                        .build()
                                        )
                                );

                // ---- Find/Create Market ----

                Market market =
                        marketRepository
                                .findAll()
                                .stream()
                                .filter(m ->
                                        m.getName()
                                                .equalsIgnoreCase(
                                                        marketName
                                                )
                                )
                                .findFirst()
                                .orElseGet(() ->
                                        marketRepository.save(
                                                Market.builder()
                                                        .name(marketName)
                                                        .district(district)
                                                        .build()
                                        )
                                );

                // ---- Commodity Group ----

                CommodityGroup group =
                        commodityGroupRepository
                                .findAll()
                                .stream()
                                .findFirst()
                                .orElse(null);

                // ---- Find/Create Commodity ----

                Commodity commodity =
                        commodityRepository
                                .findAll()
                                .stream()
                                .filter(c ->
                                        c.getName()
                                                .equalsIgnoreCase(
                                                        commodityName
                                                )
                                )
                                .findFirst()
                                .orElseGet(() ->
                                        commodityRepository.save(
                                                Commodity.builder()
                                                        .name(commodityName)
                                                        .commodityGroup(group)
                                                        .build()
                                        )
                                );

                // ---- Save Price Arrival ----

                PriceArrival pa =
                        PriceArrival.builder()
                                .arrivalDate(date)
                                .state(state)
                                .district(district)
                                .market(market)
                                .commodityGroup(group)
                                .commodity(commodity)
                                .grade("FAQ")
                                .minPrice(
                                        BigDecimal.valueOf(
                                                minPrice
                                        )
                                )
                                .maxPrice(
                                        BigDecimal.valueOf(
                                                maxPrice
                                        )
                                )
                                .modalPrice(
                                        BigDecimal.valueOf(
                                                modalPrice
                                        )
                                )
                                .arrivalQuantity(
                                        BigDecimal.valueOf(
                                                arrival
                                        )
                                )
                                .priceUnit(
                                        "Per Quintal"
                                )
                                .build();

                priceArrivalRepository.save(pa);
            }

            System.out.println(
                    "CSV Import Successful"
            );

        } catch (Exception e) {

            e.printStackTrace();
        }
    }
}