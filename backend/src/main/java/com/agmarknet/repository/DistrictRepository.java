package com.agmarknet.repository;

import com.agmarknet.model.District;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DistrictRepository extends JpaRepository<District, Long> {

    List<District> findByStateIdOrderByNameAsc(Long stateId);

    List<District> findAllByOrderByNameAsc();

}