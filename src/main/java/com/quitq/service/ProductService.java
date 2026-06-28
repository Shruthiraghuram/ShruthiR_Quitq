package com.quitq.service;
import com.quitq.exception.ResourceNotFoundException;


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

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private SellerRepository sellerRepository;

  
    public Product addProduct(Product product) {
        return productRepository.save(product);
    }

  
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

   
    public Product getProductById(int productId) {
        return productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found!"));
    }

   
    public List<Product> getProductsByCategory(int categoryId) {
        return productRepository.findByCategoryCategoryId(categoryId);
    }

    
    public List<Product> getProductsBySeller(int sellerId) {
        return productRepository.findBySellerSellerId(sellerId);
    }

    
    public List<Product> searchProducts(String productName) {
        return productRepository.findByProductNameContainingIgnoreCase(productName);
    }

    
    public Product updateProduct(int productId, Product updatedProduct) {
        Product existingProduct = getProductById(productId);
        existingProduct.setProductName(updatedProduct.getProductName());
        existingProduct.setDescription(updatedProduct.getDescription());
        existingProduct.setPrice(updatedProduct.getPrice());
        existingProduct.setStockNumber(updatedProduct.getStockNumber());
        existingProduct.setAvailable(updatedProduct.isAvailable());
        existingProduct.setCategory(updatedProduct.getCategory());
        return productRepository.save(existingProduct);
    }

  
    public Product markOutOfStock(int productId) {
        Product product = getProductById(productId);
        product.setAvailable(false);
        return productRepository.save(product);
    }

    
    public void deleteProduct(int productId) {
        getProductById(productId);
        productRepository.deleteById(productId);
    }
}