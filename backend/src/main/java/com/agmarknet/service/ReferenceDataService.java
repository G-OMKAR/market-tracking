package com.agmarknet.service;

import com.agmarknet.dto.Dtos.*;
import com.agmarknet.model.*;
import com.agmarknet.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class ReferenceDataService {

    private final StateRepository stateRepository;
    private final DistrictRepository districtRepository;
    private final MarketRepository marketRepository;
    private final CommodityGroupRepository commodityGroupRepository;
    private final CommodityRepository commodityRepository;
    private final VarietyRepository varietyRepository;

    // States
    public List<StateDto> getAllStates() {
        return stateRepository.findAllByOrderByNameAsc()
                .stream()
                .map(s -> StateDto.builder()
                        .id(s.getId())
                        .name(s.getName())
                        .code(s.getCode())
                        .build())
                .collect(Collectors.toList());
    }

    // Districts
    public List<DistrictDto> getDistricts(Long stateId) {
        List<District> districts = (stateId != null)
                ? districtRepository.findByStateIdOrderByNameAsc(stateId)
                : districtRepository.findAllByOrderByNameAsc();

        return districts.stream()
                .map(d -> DistrictDto.builder()
                        .id(d.getId())
                        .name(d.getName())
                        .stateId(d.getState().getId())
                        .stateName(d.getState().getName())
                        .build())
                .collect(Collectors.toList());
    }

    // Markets
    public List<MarketDto> getMarkets(Long stateId, Long districtId) {
        List<Market> markets;
        if (districtId != null) {
            markets = marketRepository.findByDistrictIdOrderByNameAsc(districtId);
        } else if (stateId != null) {
            markets = marketRepository.findByDistrictStateIdOrderByNameAsc(stateId);
        } else {
            markets = marketRepository.findAllByOrderByNameAsc();
        }

        return markets.stream()
                .map(m -> MarketDto.builder()
                        .id(m.getId())
                        .name(m.getName())
                        .districtId(m.getDistrict().getId())
                        .districtName(m.getDistrict().getName())
                        .stateId(m.getDistrict().getState().getId())
                        .stateName(m.getDistrict().getState().getName())
                        .build())
                .collect(Collectors.toList());
    }

    // Commodity Groups
    public List<CommodityGroupDto> getAllCommodityGroups() {
        return commodityGroupRepository.findAllByOrderByNameAsc()
                .stream()
                .map(cg -> CommodityGroupDto.builder()
                        .id(cg.getId())
                        .name(cg.getName())
                        .build())
                .collect(Collectors.toList());
    }

    // Commodities
    public List<CommodityDto> getCommodities(Long groupId) {
        List<Commodity> commodities = (groupId != null)
                ? commodityRepository.findByCommodityGroupIdOrderByNameAsc(groupId)
                : commodityRepository.findAllByOrderByNameAsc();

        return commodities.stream()
                .map(c -> CommodityDto.builder()
                        .id(c.getId())
                        .name(c.getName())
                        .commodityGroupId(c.getCommodityGroup().getId())
                        .commodityGroupName(c.getCommodityGroup().getName())
                        .build())
                .collect(Collectors.toList());
    }

    // Varieties
    public List<VarietyDto> getVarieties(Long commodityId) {
        List<Variety> varieties = (commodityId != null)
                ? varietyRepository.findByCommodityIdOrderByNameAsc(commodityId)
                : varietyRepository.findAllByOrderByNameAsc();

        return varieties.stream()
                .map(v -> VarietyDto.builder()
                        .id(v.getId())
                        .name(v.getName())
                        .commodityId(v.getCommodity().getId())
                        .commodityName(v.getCommodity().getName())
                        .build())
                .collect(Collectors.toList());
    }
}
