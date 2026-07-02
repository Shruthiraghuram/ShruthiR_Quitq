package com.quitq.service;
import com.quitq.exception.ResourceNotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.quitq.model.ShippingAddress;
import com.quitq.model.User;
import com.quitq.repository.ShippingAddressRepository;
import com.quitq.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ShippingAddressService {
	private static final Logger logger = LoggerFactory.getLogger(ShippingAddressService.class);

    @Autowired
    private ShippingAddressRepository shippingAddressRepository;

    @Autowired
    private UserRepository userRepository;

 // Add new address
    public ShippingAddress addAddress(int userId, ShippingAddress address) {
        logger.info("Adding new address for user ID: {}", userId);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> {
                    logger.error("User not found with ID: {}", userId);
                    return new ResourceNotFoundException("User not found!");
                });
        address.setUser(user);
        ShippingAddress savedAddress = shippingAddressRepository.save(address);
        logger.info("Address added successfully with ID: {}", savedAddress.getAddressId());
        return savedAddress;
    }

    // Get all addresses of a user
    public List<ShippingAddress> getAddressesByUser(int userId) {
        logger.info("Fetching addresses for user ID: {}", userId);
        return shippingAddressRepository.findByUserUserId(userId);
    }

    // Get address by ID
    public ShippingAddress getAddressById(int addressId) {
        logger.info("Fetching address with ID: {}", addressId);
        return shippingAddressRepository.findById(addressId)
                .orElseThrow(() -> {
                    logger.error("Address not found with ID: {}", addressId);
                    return new ResourceNotFoundException("Address not found!");
                });
    }

    // Update address
    public ShippingAddress updateAddress(int addressId, ShippingAddress updatedAddress) {
        logger.info("Updating address with ID: {}", addressId);
        ShippingAddress existingAddress = getAddressById(addressId);
        existingAddress.setStreet(updatedAddress.getStreet());
        existingAddress.setCity(updatedAddress.getCity());
        existingAddress.setState(updatedAddress.getState());
        existingAddress.setZipCode(updatedAddress.getZipCode());
        existingAddress.setCountry(updatedAddress.getCountry());
        ShippingAddress saved = shippingAddressRepository.save(existingAddress);
        logger.info("Address updated successfully with ID: {}", addressId);
        return saved;
    }

    // Delete address
    public void deleteAddress(int addressId) {
        logger.info("Deleting address with ID: {}", addressId);
        getAddressById(addressId);
        shippingAddressRepository.deleteById(addressId);
        logger.info("Address deleted successfully with ID: {}", addressId);
    }
    }