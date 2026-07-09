package com.hexaware.quitq;
import java.util.Map;

import com.hexaware.quitq.dto.UserDTO;
import com.hexaware.quitq.entity.User;
import com.hexaware.quitq.repository.UserRepository;
import com.hexaware.quitq.security.JwtUtil;
import com.hexaware.quitq.service.UserService;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private JwtUtil jwtUtil;

    @InjectMocks
    private UserService userService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testRegisterUser_Success() {
        User user = new User();
        user.setName("Shruthi");
        user.setEmail("shruthi@gmail.com");
        user.setPassword("password123");

        when(userRepository.existsByEmail(user.getEmail())).thenReturn(false);
        when(userRepository.save(user)).thenReturn(user);

        UserDTO savedUser = userService.registerUser(user);

        assertNotNull(savedUser);
        assertEquals("Shruthi", savedUser.getName());
        verify(userRepository, times(1)).save(user);
    }

    @Test
    void testRegisterUser_EmailAlreadyExists() {
        User user = new User();
        user.setEmail("shruthi@gmail.com");

        when(userRepository.existsByEmail(user.getEmail())).thenReturn(true);

        assertThrows(RuntimeException.class, () -> userService.registerUser(user));
        verify(userRepository, never()).save(user);
    }

    @Test
    void testLoginUser_Success() {
        User user = new User();
        user.setEmail("shruthi@gmail.com");
        user.setPassword("password123");
        user.setRole("CUSTOMER");

        when(userRepository.findByEmail("shruthi@gmail.com")).thenReturn(Optional.of(user));
        when(jwtUtil.generateToken("shruthi@gmail.com", "CUSTOMER")).thenReturn("mock-token");

        Map<String, String> response = userService.loginUser("shruthi@gmail.com", "password123");

        assertNotNull(response);
        assertEquals("shruthi@gmail.com", response.get("email"));
        assertEquals("CUSTOMER", response.get("role"));
        assertEquals("mock-token", response.get("token"));
    }

    
    @Test
    void testLoginUser_InvalidPassword() {
        User user = new User();
        user.setEmail("shruthi@gmail.com");
        user.setPassword("password123");

        when(userRepository.findByEmail("shruthi@gmail.com")).thenReturn(Optional.of(user));

        assertThrows(RuntimeException.class, () ->
                userService.loginUser("shruthi@gmail.com", "wrongpassword"));
    }

    @Test
    void testGetUserById_Success() {
        User user = new User();
        user.setUserId(1);
        user.setName("Shruthi");
        user.setEmail("shruthi@gmail.com");

        when(userRepository.findById(1)).thenReturn(Optional.of(user));

        UserDTO retrievedUser = userService.getUserById(1);

        assertNotNull(retrievedUser);
        assertEquals(1, retrievedUser.getUserId());
        assertEquals("Shruthi", retrievedUser.getName());
        assertEquals("shruthi@gmail.com", retrievedUser.getEmail());
    }

    @Test
    void testGetUserById_NotFound() {
        when(userRepository.findById(99)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> userService.getUserById(99));
    }
}