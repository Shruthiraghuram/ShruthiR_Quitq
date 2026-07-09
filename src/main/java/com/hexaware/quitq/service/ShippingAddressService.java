package com.hexaware.quitq.service;
import com.hexaware.quitq.entity.Order;
import com.hexaware.quitq.entity.ShippingAddress;
import com.hexaware.quitq.entity.User;
import com.hexaware.quitq.exception.ResourceNotFoundException;
import com.hexaware.quitq.repository.OrderRepository;
import com.hexaware.quitq.repository.ShippingAddressRepository;
import com.hexaware.quitq.repository.UserRepository;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import org.springframework.dao.DataIntegrityViolationException;

@Service
public class ShippingAddressService {
	private static final Logger logger = LoggerFactory.getLogger(ShippingAddressService.class);
	
	

    @Autowired
    private ShippingAddressRepository shippingAddressRepository;
    
    @Autowired
    private OrderRepository orderRepository;

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
        existingAddress.setFullName(updatedAddress.getFullName());
        existingAddress.setPhone(updatedAddress.getPhone());
        ShippingAddress saved = shippingAddressRepository.save(existingAddress);
        logger.info("Address updated successfully with ID: {}", addressId);
        return saved;
    }

    // Delete address
    public void deleteAddress(int addressId) {

        logger.info("Deleting address with ID: {}", addressId);

        ShippingAddress address = getAddressById(addressId);

        // Find all orders using this address
        List<Order> orders = orderRepository.findByShippingAddressAddressId(addressId);

        // Remove the reference from each order
        for (Order order : orders) {
            order.setShippingAddress(null);
            orderRepository.save(order);
        }

        // Delete the address
        shippingAddressRepository.delete(address);

        logger.info("Address deleted successfully with ID: {}", addressId);
    }
    }