package com.hexaware.quitq.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.hexaware.quitq.entity.Order;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Integer> {
    
   
    List<Order> findByUserUserId(int userId);
    
   
    List<Order> findByStatus(Order.OrderStatus status);
    List<Order> findByShippingAddressAddressId(int addressId);
}