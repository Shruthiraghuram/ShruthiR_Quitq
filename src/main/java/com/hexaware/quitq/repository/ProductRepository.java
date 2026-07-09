package com.hexaware.quitq.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.hexaware.quitq.entity.Product;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Integer> {
    
  
    List<Product> findByCategoryCategoryId(int categoryId);
    
  
    List<Product> findBySellerSellerId(int sellerId);
    
    
    List<Product> findByProductNameContainingIgnoreCase(String productName);
    
    
    List<Product> findByAvailableTrue();
}