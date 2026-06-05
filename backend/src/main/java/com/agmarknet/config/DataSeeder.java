package com.agmarknet.config;

import com.agmarknet.model.*;
import com.agmarknet.repository.*;
import com.agmarknet.service.CsvImportService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.*;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataSeeder implements CommandLineRunner {

    private final StateRepository stateRepository;
    private final DistrictRepository districtRepository;
    private final MarketRepository marketRepository;
    private final CommodityGroupRepository commodityGroupRepository;
    private final CommodityRepository commodityRepository;
    private final VarietyRepository varietyRepository;
    private final PriceArrivalRepository priceArrivalRepository;
    private final CsvImportService csvImportService;
    @Override
    @Transactional
    public void run(String... args) {

        if (stateRepository.count() > 0) {

            log.info("Database already seeded, skipping...");
            return;
        }

        log.info("Seeding database with sample data...");

        seedData();
        csvImportService.importCsv();
        log.info(
                "Database seeding complete. Records: {}",
                priceArrivalRepository.count()
        );
    }

    private void seedData() {

        // ---- States ----

        State mh = createState("Maharashtra", "MH");
        State up = createState("Uttar Pradesh", "UP");
        State ka = createState("Karnataka", "KA");
        State tn = createState("Tamil Nadu", "TN");
        State pb = createState("Punjab", "PB");
        State hr = createState("Haryana", "HR");
        State rj = createState("Rajasthan", "RJ");
        State mp = createState("Madhya Pradesh", "MP");

        // ---- Districts & Markets ----

        District nashik = createDistrict("Nashik", mh);
        District pune = createDistrict("Pune", mh);
        District mumbai = createDistrict("Mumbai", mh);

        Market nashikMarket =
                createMarket("Nashik APMC", nashik);

        Market lasalgaon =
                createMarket("Lasalgaon", nashik);

        Market puneMarket =
                createMarket("Pune APMC", pune);

        Market vashi =
                createMarket("Vashi (Mumbai)", mumbai);

        District agra = createDistrict("Agra", up);
        District lucknow = createDistrict("Lucknow", up);

        Market agraMarket =
                createMarket("Agra APMC", agra);

        Market lucknowMarket =
                createMarket("Lucknow APMC", lucknow);

        District bangalore =
                createDistrict("Bangalore Rural", ka);

        District mysore =
                createDistrict("Mysore", ka);

        Market ktcMarket =
                createMarket("KTC (Bangalore)", bangalore);

        Market mysoreMarket =
                createMarket("Mysore APMC", mysore);

        District madurai =
                createDistrict("Madurai", tn);

        Market maduraiMarket =
                createMarket("Madurai APMC", madurai);

        District ludhiana =
                createDistrict("Ludhiana", pb);

        District ambala =
                createDistrict("Ambala", hr);

        Market ludhianaMarket =
                createMarket("Ludhiana APMC", ludhiana);

        Market ambalaMarket =
                createMarket("Ambala APMC", ambala);

        District jaipur =
                createDistrict("Jaipur", rj);

        Market jaipurMarket =
                createMarket("Jaipur APMC", jaipur);

        District indore =
                createDistrict("Indore", mp);

        Market indoreMarket =
                createMarket("Indore APMC", indore);

        // ---- Commodity Groups ----

        CommodityGroup vegetables =
                createGroup("Vegetables");

        CommodityGroup cereals =
                createGroup("Cereals");

        CommodityGroup pulses =
                createGroup("Pulses");

        CommodityGroup oilseeds =
                createGroup("Oilseeds");

        CommodityGroup fruits =
                createGroup("Fruits");

        CommodityGroup spices =
                createGroup("Spices");

        CommodityGroup msp =
                createGroup("MSP Commodities");

        // ---- Commodities ----

        Commodity tomato =
                createCommodity("Tomato", vegetables);

        Commodity onion =
                createCommodity("Onion", vegetables);

        Commodity potato =
                createCommodity("Potato", vegetables);

        Commodity cauliflower =
                createCommodity("Cauliflower", vegetables);

        Commodity capsicum =
                createCommodity("Capsicum", vegetables);

        Commodity brinjal =
                createCommodity("Brinjal", vegetables);

        Commodity bhindi =
                createCommodity("Bhindi (Okra)", vegetables);

        Commodity wheat =
                createCommodity("Wheat", cereals);

        Commodity rice =
                createCommodity("Rice (Paddy)", cereals);

        Commodity maize =
                createCommodity("Maize", cereals);

        Commodity bajra =
                createCommodity("Bajra", msp);

        Commodity jowar =
                createCommodity("Jowar", msp);

        Commodity arhar =
                createCommodity("Arhar (Tur Dal)", pulses);

        Commodity chana =
                createCommodity("Chana (Gram)", pulses);

        Commodity moong =
                createCommodity("Moong Dal", pulses);

        Commodity soybean =
                createCommodity("Soybean", oilseeds);

        Commodity mustard =
                createCommodity("Mustard (Sarson)", oilseeds);

        Commodity groundnut =
                createCommodity("Groundnut", oilseeds);

        Commodity banana =
                createCommodity("Banana", fruits);

        Commodity mango =
                createCommodity("Mango", fruits);

        Commodity apple =
                createCommodity("Apple", fruits);

        Commodity pomegranate =
                createCommodity("Pomegranate", fruits);

        Commodity turmeric =
                createCommodity("Turmeric", spices);

        Commodity chilli =
                createCommodity("Red Chilli", spices);

        Commodity coriander =
                createCommodity("Coriander", spices);

        // ---- Varieties ----

        Variety tomatoLocal =
                createVariety("Local", tomato);

        Variety tomatoHybrid =
                createVariety("Hybrid", tomato);

        Variety onionRed =
                createVariety("Red", onion);

        Variety onionWhite =
                createVariety("White", onion);

        Variety potatoJyoti =
                createVariety("Jyoti", potato);

        Variety potatoChips =
                createVariety("Chips", potato);

        Variety wheatSharbati =
                createVariety("Sharbati", wheat);

        Variety wheatLok1 =
                createVariety("Lok-1", wheat);

        Variety riceBasmati =
                createVariety("Basmati", rice);

        Variety riceSona =
                createVariety("Sona Masuri", rice);

        // ---- Random Data ----

        Random rand = new Random();

        LocalDate today = LocalDate.now();

        record CmPair(
                Commodity c,
                Market m,
                State s,
                District d,
                Variety v,
                double baseMin,
                double baseMax
        ) {}

        List<CmPair> pairs = List.of(

                new CmPair(
                        tomato,
                        lasalgaon,
                        mh,
                        nashik,
                        tomatoHybrid,
                        800,
                        1200
                ),

                new CmPair(
                        onion,
                        nashikMarket,
                        mh,
                        nashik,
                        onionRed,
                        1200,
                        2000
                ),

                new CmPair(
                        potato,
                        agraMarket,
                        up,
                        agra,
                        potatoJyoti,
                        600,
                        900
                ),

                new CmPair(
                        wheat,
                        ludhianaMarket,
                        pb,
                        ludhiana,
                        wheatSharbati,
                        2100,
                        2400
                ),

                new CmPair(
                        rice,
                        maduraiMarket,
                        tn,
                        madurai,
                        riceBasmati,
                        4500,
                        6000
                ),

                new CmPair(
                        soybean,
                        indoreMarket,
                        mp,
                        indore,
                        null,
                        4200,
                        5000
                ),

                new CmPair(
                        mango,
                        puneMarket,
                        mh,
                        pune,
                        null,
                        3000,
                        5000
                ),

                new CmPair(
                        cauliflower,
                        nashikMarket,
                        mh,
                        nashik,
                        null,
                        1000,
                        1800
                ),

                new CmPair(
                        moong,
                        indoreMarket,
                        mp,
                        indore,
                        null,
                        6000,
                        7500
                ),

                new CmPair(
                        bhindi,
                        mysoreMarket,
                        ka,
                        mysore,
                        null,
                        1200,
                        2200
                ),

                new CmPair(
                        banana,
                        maduraiMarket,
                        tn,
                        madurai,
                        null,
                        800,
                        1400
                ),

                new CmPair(
                        turmeric,
                        mysoreMarket,
                        ka,
                        mysore,
                        null,
                        7000,
                        9000
                ),

                new CmPair(
                        chilli,
                        indoreMarket,
                        mp,
                        indore,
                        null,
                        8000,
                        12000
                )
        );

        String[] grades = {
                "FAQ",
                "Grade-A",
                "Super"
        };

        for (int d = 365; d >= 0; d--) {

            LocalDate date = today.minusDays(d);

            for (CmPair pair : pairs) {

                /*
                 * Safe realistic pricing logic
                 * Improves charts without affecting project
                 */

                double fluctuation =
                        0.95 + rand.nextDouble() * 0.10;

                /*
                 * Always positive realistic trend
                 */
                double trendFactor =
                        1 + (rand.nextDouble() * 0.25);

                /*
                 * Small market movement
                 */
                double volatility =
                        rand.nextDouble() * 0.05;

                double min =
                        pair.baseMin *
                                fluctuation *
                                trendFactor *
                                (1 + volatility);

                double max =
                        pair.baseMax *
                                fluctuation *
                                trendFactor *
                                (1 + volatility);

                double modal =
                        (min + max) / 2;

                double arrival =
                        5 + rand.nextDouble() * 200;

                PriceArrival pa =
                        PriceArrival.builder()
                                .arrivalDate(date)
                                .state(pair.s)
                                .district(pair.d)
                                .market(pair.m)
                                .commodityGroup(
                                        pair.c.getCommodityGroup()
                                )
                                .commodity(pair.c)
                                .variety(pair.v)
                                .grade(
                                        grades[
                                                rand.nextInt(
                                                        grades.length
                                                )
                                                ]
                                )
                                .minPrice(
                                        BigDecimal.valueOf(
                                                Math.round(min)
                                        )
                                )
                                .maxPrice(
                                        BigDecimal.valueOf(
                                                Math.round(max)
                                        )
                                )
                                .modalPrice(
                                        BigDecimal.valueOf(
                                                Math.round(modal)
                                        )
                                )
                                .arrivalQuantity(
                                        BigDecimal.valueOf(
                                                Math.round(
                                                        arrival * 10.0
                                                ) / 10.0
                                        )
                                )
                                .priceUnit("Per Quintal")
                                .build();

                priceArrivalRepository.save(pa);
            }
        }
    }

    // ---- Helper Methods ----

    private State createState(
            String name,
            String code
    ) {
        return stateRepository.save(
                State.builder()
                        .name(name)
                        .code(code)
                        .build()
        );
    }

    private District createDistrict(
            String name,
            State state
    ) {
        return districtRepository.save(
                District.builder()
                        .name(name)
                        .state(state)
                        .build()
        );
    }

    private Market createMarket(
            String name,
            District district
    ) {
        return marketRepository.save(
                Market.builder()
                        .name(name)
                        .district(district)
                        .build()
        );
    }

    private CommodityGroup createGroup(
            String name
    ) {
        return commodityGroupRepository.save(
                CommodityGroup.builder()
                        .name(name)
                        .build()
        );
    }

    private Commodity createCommodity(
            String name,
            CommodityGroup group
    ) {
        return commodityRepository.save(
                Commodity.builder()
                        .name(name)
                        .commodityGroup(group)
                        .build()
        );
    }

    private Variety createVariety(
            String name,
            Commodity commodity
    ) {
        return varietyRepository.save(
                Variety.builder()
                        .name(name)
                        .commodity(commodity)
                        .build()
        );
    }
}