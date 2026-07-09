package com.hexaware.quitq.service;

import com.hexaware.quitq.dto.ProductDTO;
import com.hexaware.quitq.entity.Category;
import com.hexaware.quitq.entity.Product;
import com.hexaware.quitq.entity.Seller;
import com.hexaware.quitq.exception.ResourceNotFoundException;
import com.hexaware.quitq.repository.CategoryRepository;
import com.hexaware.quitq.repository.ProductRepository;
import com.hexaware.quitq.repository.SellerRepository;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductService {

    private static final Logger logger = LoggerFactory.getLogger(ProductService.class);

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private SellerRepository sellerRepository;

    // =========================
    // DTO Conversion Methods
    // =========================

    private ProductDTO convertToDTO(Product product) {

        ProductDTO dto = new ProductDTO();

        dto.setProductId(product.getProductId());
        dto.setProductName(product.getProductName());
        dto.setDescription(product.getDescription());
        dto.setPrice(product.getPrice());
        dto.setStockNumber(product.getStockNumber());
        dto.setAvailable(product.isAvailable());
        dto.setImageUrl(product.getImageUrl());

        if (product.getCategory() != null) {
            dto.setCategoryId(product.getCategory().getCategoryId());
            dto.setCategoryName(product.getCategory().getCategoryName());
        }

        if (product.getSeller() != null) {
            dto.setSellerId(product.getSeller().getSellerId());
            dto.setSellerName(product.getSeller().getName());
        }

        return dto;
    }

    private Product convertToEntity(ProductDTO dto) {

        Product product = new Product();

        product.setProductName(dto.getProductName());
        product.setDescription(dto.getDescription());
        product.setPrice(dto.getPrice());
        product.setStockNumber(dto.getStockNumber());
        product.setAvailable(dto.isAvailable());
        product.setImageUrl(dto.getImageUrl());

        Category category = categoryRepository.findById(dto.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));

        Seller seller = sellerRepository.findById(dto.getSellerId())
                .orElseThrow(() -> new ResourceNotFoundException("Seller not found"));

        product.setCategory(category);
        product.setSeller(seller);

        return product;
    }

    private Product findProductEntity(int productId) {

        return productRepository.findById(productId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Product not found"));
    }

    // =========================
    // CRUD METHODS
    // =========================

    public ProductDTO addProduct(ProductDTO dto) {

        logger.info("Adding product {}", dto.getProductName());

        Product product = convertToEntity(dto);

        Product saved = productRepository.save(product);

        return convertToDTO(saved);
    }

    public List<ProductDTO> getAllProducts() {

        logger.info("Fetching all products");

        return productRepository.findAll()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public ProductDTO getProductById(int productId) {

        logger.info("Fetching product {}", productId);

        return convertToDTO(findProductEntity(productId));
    }

    public List<ProductDTO> getProductsByCategory(int categoryId) {

        logger.info("Fetching products by category {}", categoryId);

        return productRepository.findByCategoryCategoryId(categoryId)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<ProductDTO> getProductsBySeller(int sellerId) {

        logger.info("Fetching products by seller {}", sellerId);

        return productRepository.findBySellerSellerId(sellerId)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<ProductDTO> searchProducts(String productName) {

        logger.info("Searching {}", productName);

        return productRepository.findByProductNameContainingIgnoreCase(productName)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public ProductDTO updateProduct(int productId, ProductDTO dto) {

        logger.info("Updating product {}", productId);

        Product product = findProductEntity(productId);

        product.setProductName(dto.getProductName());
        product.setDescription(dto.getDescription());
        product.setPrice(dto.getPrice());
        product.setStockNumber(dto.getStockNumber());
        product.setAvailable(dto.isAvailable());
        product.setImageUrl(dto.getImageUrl());

        Category category = categoryRepository.findById(dto.getCategoryId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Category not found"));

        Seller seller = sellerRepository.findById(dto.getSellerId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Seller not found"));

        product.setCategory(category);
        product.setSeller(seller);

        Product updated = productRepository.save(product);

        return convertToDTO(updated);
    }

    public ProductDTO markOutOfStock(int productId) {

        logger.info("Marking product {} out of stock", productId);

        Product product = findProductEntity(productId);

        product.setAvailable(false);

        Product updated = productRepository.save(product);

        return convertToDTO(updated);
    }

    public void deleteProduct(int productId) {

        logger.info("Deleting product {}", productId);

        Product product = findProductEntity(productId);

        productRepository.delete(product);
    }

}