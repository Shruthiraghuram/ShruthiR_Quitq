package com.quitq.service;
import com.quitq.exception.ResourceNotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.quitq.model.Admin;
import com.quitq.repository.AdminRepository;
import com.quitq.repository.UserRepository;
import com.quitq.repository.SellerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
public class AdminService {
	 private static final Logger logger = LoggerFactory.getLogger(AdminService.class);

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SellerRepository sellerRepository;

  
 // Login admin
    public Admin loginAdmin(String email, String password) {
        logger.info("Login attempt for admin with email: {}", email);
        Optional<Admin> admin = adminRepository.findByEmail(email);
        if (admin.isPresent() && admin.get().getPassword().equals(password)) {
            logger.info("Admin login successful for email: {}", email);
            return admin.get();
        }
        logger.error("Admin login failed for email: {}", email);
        throw new RuntimeException("Invalid email or password!");
    }

    // Get admin by ID
    public Admin getAdminById(int adminId) {
        logger.info("Fetching admin with ID: {}", adminId);
        return adminRepository.findById(adminId)
                .orElseThrow(() -> {
                    logger.error("Admin not found with ID: {}", adminId);
                    return new ResourceNotFoundException("Admin not found!");
                });
    }

    // Delete user account
    public void deleteUser(int userId) {
        logger.info("Admin deleting user with ID: {}", userId);
        if (!userRepository.existsById(userId)) {
            logger.error("User not found with ID: {}", userId);
            throw new ResourceNotFoundException("User not found!");
        }
        userRepository.deleteById(userId);
        logger.info("User deleted successfully with ID: {}", userId);
    }

    // Delete seller account
    public void deleteSeller(int sellerId) {
        logger.info("Admin deleting seller with ID: {}", sellerId);
        if (!sellerRepository.existsById(sellerId)) {
            logger.error("Seller not found with ID: {}", sellerId);
            throw new ResourceNotFoundException("Seller not found!");
        }
        sellerRepository.deleteById(sellerId);
        logger.info("Seller deleted successfully with ID: {}", sellerId);
    }
}