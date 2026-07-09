package com.hexaware.quitq.controller;

import com.hexaware.quitq.dto.ProductDTO;
import com.hexaware.quitq.entity.Product;
import com.hexaware.quitq.service.ProductService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    @Autowired
    private ProductService productService;

    @PostMapping
    public ResponseEntity<ProductDTO> addProduct(@RequestBody ProductDTO productDTO) {
        return ResponseEntity.ok(productService.addProduct(productDTO));
    }

    @GetMapping
    public ResponseEntity<List<ProductDTO>> getAllProducts() {
        return ResponseEntity.ok(productService.getAllProducts());
    }

    @GetMapping("/{productId}")
    public ResponseEntity<ProductDTO> getProductById(@PathVariable int productId) {
        return ResponseEntity.ok(productService.getProductById(productId));
    }

    @GetMapping("/category/{categoryId}")
    public ResponseEntity<List<ProductDTO>> getProductsByCategory(@PathVariable int categoryId) {
        return ResponseEntity.ok(productService.getProductsByCategory(categoryId));
    }

    @GetMapping("/seller/{sellerId}")
    public ResponseEntity<List<ProductDTO>> getProductsBySeller(@PathVariable int sellerId) {
        return ResponseEntity.ok(productService.getProductsBySeller(sellerId));
    }

    @GetMapping("/search")
    public ResponseEntity<List<ProductDTO>> searchProducts(@RequestParam String productName) {
        return ResponseEntity.ok(productService.searchProducts(productName));
    }

    @PutMapping("/{productId}")
    public ResponseEntity<ProductDTO> updateProduct(@PathVariable int productId,
                                                    @RequestBody ProductDTO productDTO) {
        return ResponseEntity.ok(productService.updateProduct(productId, productDTO));
    }

    @PutMapping("/{productId}/outofstock")
    public ResponseEntity<ProductDTO> markOutOfStock(@PathVariable int productId) {
        return ResponseEntity.ok(productService.markOutOfStock(productId));
    }

    @DeleteMapping("/{productId}")
    public ResponseEntity<String> deleteProduct(@PathVariable int productId) {
        productService.deleteProduct(productId);
        return ResponseEntity.ok("Product deleted successfully!");
    }
}