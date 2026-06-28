package com.quitq.service;
import com.quitq.exception.ResourceNotFoundException;

import com.quitq.model.ShippingAddress;
import com.quitq.model.User;
import com.quitq.repository.ShippingAddressRepository;
import com.quitq.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ShippingAddressService {

    @Autowired
    private ShippingAddressRepository shippingAddressRepository;

    @Autowired
    private UserRepository userRepository;

    public ShippingAddress addAddress(int userId, ShippingAddress address) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found!"));
        address.setUser(user);
        return shippingAddressRepository.save(address);
    }

    
    public List<ShippingAddress> getAddressesByUser(int userId) {
        return shippingAddressRepository.findByUserUserId(userId);
    }

    
    public ShippingAddress getAddressById(int addressId) {
        return shippingAddressRepository.findById(addressId)
                .orElseThrow(() -> new ResourceNotFoundException("Address not found!"));
    }

  
    public ShippingAddress updateAddress(int addressId, ShippingAddress updatedAddress) {
        ShippingAddress existingAddress = getAddressById(addressId);
        existingAddress.setStreet(updatedAddress.getStreet());
        existingAddress.setCity(updatedAddress.getCity());
        existingAddress.setState(updatedAddress.getState());
        existingAddress.setZipCode(updatedAddress.getZipCode());
        existingAddress.setCountry(updatedAddress.getCountry());
        return shippingAddressRepository.save(existingAddress);
    }

   
    public void deleteAddress(int addressId) {
        getAddressById(addressId);
        shippingAddressRepository.deleteById(addressId);
    }
}