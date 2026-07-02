package com.quitq.service;
import com.quitq.exception.ResourceNotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


import com.quitq.model.Product;
import com.quitq.model.Category;
import com.quitq.model.Seller;
import com.quitq.repository.ProductRepository;
import com.quitq.repository.CategoryRepository;
import com.quitq.repository.SellerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ProductService {
	private static final Logger logger = LoggerFactory.getLogger(ProductService.class);

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private SellerRepository sellerRepository;

  
 // Add new product
    public Product addProduct(Product product) {
        logger.info("Adding new product: {}", product.getProductName());
        Product savedProduct = productRepository.save(product);
        logger.info("Product added successfully with ID: {}", savedProduct.getProductId());
        return savedProduct;
    }

    // Get all products
    public List<Product> getAllProducts() {
        logger.info("Fetching all products");
        return productRepository.findAll();
    }

    // Get product by ID
    public Product getProductById(int productId) {
        logger.info("Fetching product with ID: {}", productId);
        return productRepository.findById(productId)
                .orElseThrow(() -> {
                    logger.error("Product not found with ID: {}", productId);
                    return new ResourceNotFoundException("Product not found!");
                });
    }

    // Get products by category
    public List<Product> getProductsByCategory(int categoryId) {
        logger.info("Fetching products by category ID: {}", categoryId);
        return productRepository.findByCategoryCategoryId(categoryId);
    }

    // Get products by seller
    public List<Product> getProductsBySeller(int sellerId) {
        logger.info("Fetching products by seller ID: {}", sellerId);
        return productRepository.findBySellerSellerId(sellerId);
    }

    // Search products by name
    public List<Product> searchProducts(String productName) {
        logger.info("Searching products with name: {}", productName);
        return productRepository.findByProductNameContainingIgnoreCase(productName);
    }

    // Update product
    public Product updateProduct(int productId, Product updatedProduct) {
        logger.info("Updating product with ID: {}", productId);
        Product existingProduct = getProductById(productId);
        existingProduct.setProductName(updatedProduct.getProductName());
        existingProduct.setDescription(updatedProduct.getDescription());
        existingProduct.setPrice(updatedProduct.getPrice());
        existingProduct.setStockNumber(updatedProduct.getStockNumber());
        existingProduct.setAvailable(updatedProduct.isAvailable());
        existingProduct.setCategory(updatedProduct.getCategory());
        Product saved = productRepository.save(existingProduct);
        logger.info("Product updated successfully with ID: {}", productId);
        return saved;
    }

    // Mark product as out of stock
    public Product markOutOfStock(int productId) {
        logger.info("Marking product as out of stock with ID: {}", productId);
        Product product = getProductById(productId);
        product.setAvailable(false);
        Product saved = productRepository.save(product);
        logger.info("Product marked as out of stock with ID: {}", productId);
        return saved;
    }

    // Delete product
    public void deleteProduct(int productId) {
        logger.info("Deleting product with ID: {}", productId);
        getProductById(productId);
        productRepository.deleteById(productId);
        logger.info("Product deleted successfully with ID: {}", productId);
    }
}