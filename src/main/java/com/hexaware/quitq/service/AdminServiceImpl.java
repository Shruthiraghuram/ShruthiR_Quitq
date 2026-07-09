package com.hexaware.quitq.service;

import com.hexaware.quitq.dto.ProductDTO;
import com.hexaware.quitq.dto.UserDTO;
import com.hexaware.quitq.entity.Admin;
import com.hexaware.quitq.entity.Order;
import com.hexaware.quitq.entity.Seller;
import com.hexaware.quitq.exception.ResourceNotFoundException;
import com.hexaware.quitq.repository.AdminRepository;
import com.hexaware.quitq.repository.OrderRepository;
import com.hexaware.quitq.repository.ProductRepository;
import com.hexaware.quitq.repository.SellerRepository;
import com.hexaware.quitq.repository.UserRepository;
import com.hexaware.quitq.security.JwtUtil;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class AdminServiceImpl implements AdminService {

    private static final Logger logger = LoggerFactory.getLogger(AdminServiceImpl.class);

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SellerRepository sellerRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserService userService;

    @Autowired
    private SellerService sellerService;

    @Autowired
    private ProductService productService;

    @Override
    public Map<String, Object> loginAdmin(String email, String password) {
        logger.info("Login attempt for admin with email: {}", email);
        Optional<Admin> adminOpt = adminRepository.findByEmail(email);
        
        if (adminOpt.isPresent() && adminOpt.get().getPassword().equals(password)) {
            Admin admin = adminOpt.get();
            logger.info("Admin login successful for email: {}", email);
            
            String token = jwtUtil.generateToken(email, "ADMIN");
            
            Map<String, Object> response = new HashMap<>();
            response.put("token", token);
            response.put("adminId", admin.getAdminId());
            response.put("name", admin.getName());
            response.put("email", admin.getEmail());
            response.put("role", "ADMIN");
            
            return response;
        }
        
        logger.error("Admin login failed for email: {}", email);
        throw new RuntimeException("Invalid email or password!");
    }

    @Override
    public Admin getAdminById(int adminId) {
        logger.info("Fetching admin with ID: {}", adminId);
        return adminRepository.findById(adminId)
                .orElseThrow(() -> {
                    logger.error("Admin not found with ID: {}", adminId);
                    return new ResourceNotFoundException("Admin not found!");
                });
    }

    @Override
    public void deleteUser(int userId) {
        logger.info("Admin deleting user with ID: {}", userId);
        if (!userRepository.existsById(userId)) {
            logger.error("User not found with ID: {}", userId);
            throw new ResourceNotFoundException("User not found!");
        }
        userRepository.deleteById(userId);
        logger.info("User deleted successfully with ID: {}", userId);
    }

    @Override
    public void deleteSeller(int sellerId) {
        logger.info("Admin deleting seller with ID: {}", sellerId);
        if (!sellerRepository.existsById(sellerId)) {
            logger.error("Seller not found with ID: {}", sellerId);
            throw new ResourceNotFoundException("Seller not found!");
        }
        sellerRepository.deleteById(sellerId);
        logger.info("Seller deleted successfully with ID: {}", sellerId);
    }

    @Override
    public Map<String, Long> getDashboardCounts() {
        logger.info("Fetching dashboard counts");
        Map<String, Long> counts = new HashMap<>();
        counts.put("customersCount", userRepository.count());
        counts.put("sellersCount", sellerRepository.count());
        counts.put("productsCount", productRepository.count());
        counts.put("ordersCount", orderRepository.count());
        return counts;
    }

    @Override
    public List<UserDTO> getAllUsers() {
        logger.info("Fetching all users for admin");
        return userService.getAllUsers();
    }

    @Override
    public List<Seller> getAllSellers() {
        logger.info("Fetching all sellers for admin");
        return sellerService.getAllSellers();
    }

    @Override
    public List<ProductDTO> getAllProducts() {
        logger.info("Fetching all products for admin");
        return productService.getAllProducts();
    }

    @Override
    public List<Order> getAllOrders() {
        logger.info("Fetching all orders for admin");
        return orderRepository.findAll();
    }
}
