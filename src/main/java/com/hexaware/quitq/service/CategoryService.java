package com.hexaware.quitq.service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.hexaware.quitq.entity.Category;
import com.hexaware.quitq.exception.ResourceNotFoundException;
import com.hexaware.quitq.repository.CategoryRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class CategoryService {
	 private static final Logger logger = LoggerFactory.getLogger(CategoryService.class);

    @Autowired
    private CategoryRepository categoryRepository;

  
 // Add new category
    public Category addCategory(Category category) {
        logger.info("Adding new category: {}", category.getCategoryName());
        if (categoryRepository.existsByCategoryName(category.getCategoryName())) {
            logger.error("Category already exists: {}", category.getCategoryName());
            throw new RuntimeException("Category already exists!");
        }
        Category savedCategory = categoryRepository.save(category);
        logger.info("Category added successfully with ID: {}", savedCategory.getCategoryId());
        return savedCategory;
    }

    // Get all categories
    public List<Category> getAllCategories() {
        logger.info("Fetching all categories");
        return categoryRepository.findAll();
    }

    // Get category by ID
    public Category getCategoryById(int categoryId) {
        logger.info("Fetching category with ID: {}", categoryId);
        return categoryRepository.findById(categoryId)
                .orElseThrow(() -> {
                    logger.error("Category not found with ID: {}", categoryId);
                    return new ResourceNotFoundException("Category not found!");
                });
    }

    // Update category
    public Category updateCategory(int categoryId, Category updatedCategory) {
        logger.info("Updating category with ID: {}", categoryId);
        Category existingCategory = getCategoryById(categoryId);
        existingCategory.setCategoryName(updatedCategory.getCategoryName());
        Category saved = categoryRepository.save(existingCategory);
        logger.info("Category updated successfully with ID: {}", categoryId);
        return saved;
    }

    // Delete category
    public void deleteCategory(int categoryId) {
        logger.info("Deleting category with ID: {}", categoryId);
        getCategoryById(categoryId);
        categoryRepository.deleteById(categoryId);
        logger.info("Category deleted successfully with ID: {}", categoryId);
    }
}