package com.quitq.repository;

import com.quitq.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Integer> {
    
  
    Optional<Category> findByCategoryName(String categoryName);
    
   
    boolean existsByCategoryName(String categoryName);
}