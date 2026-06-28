package com.quitq.service;
import com.quitq.exception.ResourceNotFoundException;

import com.quitq.model.Admin;
import com.quitq.repository.AdminRepository;
import com.quitq.repository.UserRepository;
import com.quitq.repository.SellerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
public class AdminService {

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SellerRepository sellerRepository;

  
    public Admin loginAdmin(String email, String password) {
        Optional<Admin> admin = adminRepository.findByEmail(email);
        if (admin.isPresent() && admin.get().getPassword().equals(password)) {
            return admin.get();
        }
        throw new RuntimeException("Invalid email or password!");
    }

   
    public Admin getAdminById(int adminId) {
        return adminRepository.findById(adminId)
                .orElseThrow(() -> new ResourceNotFoundException("Admin not found!"));
    }

   
    public void deleteUser(int userId) {
        if (!userRepository.existsById(userId)) {
            throw new RuntimeException("User not found!");
        }
        userRepository.deleteById(userId);
    }

    public void deleteSeller(int sellerId) {
        if (!sellerRepository.existsById(sellerId)) {
            throw new RuntimeException("Seller not found!");
        }
        sellerRepository.deleteById(sellerId);
    }
}