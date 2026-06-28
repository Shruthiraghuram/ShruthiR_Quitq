package com.quitq.repository;

import com.quitq.model.Cart;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface CartRepository extends JpaRepository<Cart, Integer> {
    
   
    Optional<Cart> findByUserUserId(int userId);
}