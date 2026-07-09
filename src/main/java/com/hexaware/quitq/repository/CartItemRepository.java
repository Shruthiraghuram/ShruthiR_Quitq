package com.hexaware.quitq.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.hexaware.quitq.entity.CartItem;

import java.util.List;
import java.util.Optional;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Integer> {
    
 
    List<CartItem> findByCartCartId(int cartId);
    
    Optional<CartItem> findByCartCartIdAndProductProductId(int cartId, int productId);
    
    void deleteByCartCartId(int cartId);
}