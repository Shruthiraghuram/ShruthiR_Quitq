package com.hexaware.quitq.service;

import com.hexaware.quitq.dto.ProductDTO;
import com.hexaware.quitq.dto.UserDTO;
import com.hexaware.quitq.entity.Admin;
import com.hexaware.quitq.entity.Order;
import com.hexaware.quitq.entity.Seller;

import java.util.List;
import java.util.Map;

public interface AdminService {
    Map<String, Object> loginAdmin(String email, String password);
    Admin getAdminById(int adminId);
    void deleteUser(int userId);
    void deleteSeller(int sellerId);
    Map<String, Long> getDashboardCounts();
    List<UserDTO> getAllUsers();
    List<Seller> getAllSellers();
    List<ProductDTO> getAllProducts();
    List<Order> getAllOrders();
}