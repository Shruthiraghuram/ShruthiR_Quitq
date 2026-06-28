package com.quitq.repository;

import com.quitq.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Integer> {
    
   
    List<Order> findByUserUserId(int userId);
    
   
    List<Order> findByStatus(Order.OrderStatus status);
}