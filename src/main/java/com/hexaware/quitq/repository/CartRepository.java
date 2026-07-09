package com.hexaware.quitq.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.hexaware.quitq.entity.Cart;

import java.util.Optional;

@Repository
public interface CartRepository extends JpaRepository<Cart, Integer> {
    
   
    Optional<Cart> findByUserUserId(int userId);
}