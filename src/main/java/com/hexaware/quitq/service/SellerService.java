package com.hexaware.quitq.service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.hexaware.quitq.entity.Seller;
import com.hexaware.quitq.exception.ResourceNotFoundException;
import com.hexaware.quitq.repository.SellerRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class SellerService {
	private static final Logger logger = LoggerFactory.getLogger(SellerService.class);

    @Autowired
    private SellerRepository sellerRepository;

 // Register new seller
    public Seller registerSeller(Seller seller) {
        logger.info("Registering new seller with email: {}", seller.getEmail());
        if (sellerRepository.existsByEmail(seller.getEmail())) {
            logger.error("Email already exists: {}", seller.getEmail());
            throw new RuntimeException("Email already exists!");
        }
        Seller savedSeller = sellerRepository.save(seller);
        logger.info("Seller registered successfully with ID: {}", savedSeller.getSellerId());
        return savedSeller;
    }

    // Login seller
    public Seller loginSeller(String email, String password) {
        logger.info("Login attempt for seller with email: {}", email);
        Optional<Seller> seller = sellerRepository.findByEmail(email);
        if (seller.isPresent() && seller.get().getPassword().equals(password)) {
            logger.info("Seller login successful for email: {}", email);
            return seller.get();
        }
        logger.error("Seller login failed for email: {}", email);
        throw new RuntimeException("Invalid email or password!");
    }

    // Get seller by ID
    public Seller getSellerById(int sellerId) {
        logger.info("Fetching seller with ID: {}", sellerId);
        return sellerRepository.findById(sellerId)
                .orElseThrow(() -> {
                    logger.error("Seller not found with ID: {}", sellerId);
                    return new ResourceNotFoundException("Seller not found!");
                });
    }

    // Get all sellers
    public List<Seller> getAllSellers() {
        logger.info("Fetching all sellers");
        return sellerRepository.findAll();
    }

    // Update seller
    public Seller updateSeller(int sellerId, Seller updatedSeller) {
        logger.info("Updating seller with ID: {}", sellerId);
        Seller existingSeller = getSellerById(sellerId);
        existingSeller.setName(updatedSeller.getName());
        existingSeller.setContactNumber(updatedSeller.getContactNumber());
        existingSeller.setAddress(updatedSeller.getAddress());
        Seller saved = sellerRepository.save(existingSeller);
        logger.info("Seller updated successfully with ID: {}", sellerId);
        return saved;
    }

    // Delete seller
    public void deleteSeller(int sellerId) {
        logger.info("Deleting seller with ID: {}", sellerId);
        getSellerById(sellerId);
        sellerRepository.deleteById(sellerId);
        logger.info("Seller deleted successfully with ID: {}", sellerId);
    }
}