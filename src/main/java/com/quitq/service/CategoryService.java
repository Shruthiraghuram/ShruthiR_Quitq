package com.quitq.service;
import com.quitq.exception.ResourceNotFoundException;


import com.quitq.model.Category;
import com.quitq.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

  
    public Category addCategory(Category category) {
        if (categoryRepository.existsByCategoryName(category.getCategoryName())) {
            throw new RuntimeException("Category already exists!");
        }
        return categoryRepository.save(category);
    }

    
    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    
    public Category getCategoryById(int categoryId) {
        return categoryRepository.findById(categoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found!"));
    }

   
    public Category updateCategory(int categoryId, Category updatedCategory) {
        Category existingCategory = getCategoryById(categoryId);
        existingCategory.setCategoryName(updatedCategory.getCategoryName());
        return categoryRepository.save(existingCategory);
    }

 
    public void deleteCategory(int categoryId) {
        getCategoryById(categoryId);
        categoryRepository.deleteById(categoryId);
    }
}