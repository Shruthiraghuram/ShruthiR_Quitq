package com.quitq.service;

import com.quitq.model.Seller;
import com.quitq.repository.SellerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
import com.quitq.exception.ResourceNotFoundException;

@Service
public class SellerService {

    @Autowired
    private SellerRepository sellerRepository;

    public Seller registerSeller(Seller seller) {
        if (sellerRepository.existsByEmail(seller.getEmail())) {
            throw new RuntimeException("Email already exists!");
        }
        return sellerRepository.save(seller);
    }

   
    public Seller loginSeller(String email, String password) {
        Optional<Seller> seller = sellerRepository.findByEmail(email);
        if (seller.isPresent() && seller.get().getPassword().equals(password)) {
            return seller.get();
        }
        throw new RuntimeException("Invalid email or password!");
    }

 
    public Seller getSellerById(int sellerId) {
        return sellerRepository.findById(sellerId)
                .orElseThrow(() -> new ResourceNotFoundException("Seller not found!"));
    }

    
    public List<Seller> getAllSellers() {
        return sellerRepository.findAll();
    }

  
    public Seller updateSeller(int sellerId, Seller updatedSeller) {
        Seller existingSeller = getSellerById(sellerId);
        existingSeller.setName(updatedSeller.getName());
        existingSeller.setContactNumber(updatedSeller.getContactNumber());
        existingSeller.setAddress(updatedSeller.getAddress());
        return sellerRepository.save(existingSeller);
    }

  
    public void deleteSeller(int sellerId) {
        getSellerById(sellerId);
        sellerRepository.deleteById(sellerId);
    }
}