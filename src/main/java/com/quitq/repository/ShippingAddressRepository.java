package com.quitq.repository;

import com.quitq.model.ShippingAddress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ShippingAddressRepository extends JpaRepository<ShippingAddress, Integer> {
    
   
    List<ShippingAddress> findByUserUserId(int userId);
}