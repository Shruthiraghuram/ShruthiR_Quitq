package com.hexaware.quitq.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.hexaware.quitq.entity.OrderItem;

import java.util.List;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, Integer> {
    
   
    List<OrderItem> findByOrderOrderId(int orderId);
    
   
    List<OrderItem> findBySellerSellerId(int sellerId);
}