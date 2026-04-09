package com.example.demo.controller;

import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "https://healthai-nx8q.onrender.com") // Allow frontend access
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    /**
     * REGISTER: Creates a new user (Doctor or Patient)
     */
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody User user) {
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body("Error: Email is already registered!");
        }

        // In a production app, use BCryptPasswordEncoder here
        User savedUser = userRepository.save(user);
        return ResponseEntity.ok(savedUser);
    }

    /**
     * LOGIN: Verifies credentials and returns user details (including ROLE)
     */
    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody User loginRequest) {
        return userRepository.findByEmail(loginRequest.getEmail())
                .map(user -> {
                    if (user.getPassword().equals(loginRequest.getPassword())) {
                        return ResponseEntity.ok(user);
                    } else {
                        return ResponseEntity
                                .status(HttpStatus.UNAUTHORIZED)
                                .body("Error: Invalid credentials.");
                    }
                })
                .orElse(ResponseEntity
                        .status(HttpStatus.NOT_FOUND)
                        .body("Error: User not found."));
    }

    /**
     * GET PATIENTS: Specifically for the Doctor Dashboard
     * Filters the user list to only show those registered as PATIENTS
     */
    @GetMapping("/patients")
    public ResponseEntity<List<User>> getAllPatients() {
        List<User> patients = userRepository.findAll().stream()
                .filter(user -> "PATIENT".equalsIgnoreCase(user.getRole()))
                .collect(Collectors.toList());

        return ResponseEntity.ok(patients);
    }
}
