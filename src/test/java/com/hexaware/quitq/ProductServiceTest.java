package com.hexaware.quitq;

import com.hexaware.quitq.entity.Category;
import com.hexaware.quitq.entity.Product;
import com.hexaware.quitq.entity.Seller;
import com.hexaware.quitq.repository.ProductRepository;
import com.hexaware.quitq.service.ProductService;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class ProductServiceTest {

    @Mock
    private ProductRepository productRepository;

    @InjectMocks
    private ProductService productService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testAddProduct_Success() {
        Product product = new Product();
        product.setProductName("iPhone 15");
        product.setPrice(80000);

        when(productRepository.save(product)).thenReturn(product);

        Product saved = productService.addProduct(product);

        assertNotNull(saved);
        assertEquals("iPhone 15", saved.getProductName());
        verify(productRepository, times(1)).save(product);
    }

    @Test
    void testGetProductById_Success() {
        Product product = new Product();
        product.setProductName("Samsung TV");

        when(productRepository.findById(1)).thenReturn(Optional.of(product));

        Product found = productService.getProductById(1);

        assertNotNull(found);
        assertEquals("Samsung TV", found.getProductName());
    }

    @Test
    void testGetProductById_NotFound() {
        when(productRepository.findById(99)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> productService.getProductById(99));
    }

    @Test
    void testGetAllProducts() {
        Product p1 = new Product();
        Product p2 = new Product();

        when(productRepository.findAll()).thenReturn(Arrays.asList(p1, p2));

        List<Product> products = productService.getAllProducts();

        assertEquals(2, products.size());
    }

    @Test
    void testMarkOutOfStock() {
        Product product = new Product();
        product.setAvailable(true);

        when(productRepository.findById(1)).thenReturn(Optional.of(product));
        when(productRepository.save(product)).thenReturn(product);

        Product updated = productService.markOutOfStock(1);

        assertFalse(updated.isAvailable());
    }

    @Test
    void testDeleteProduct_NotFound() {
        when(productRepository.findById(99)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> productService.deleteProduct(99));
    }
}