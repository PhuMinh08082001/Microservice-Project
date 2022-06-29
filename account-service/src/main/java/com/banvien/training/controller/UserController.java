package com.banvien.training.controller;

import com.banvien.training.dto.request.PaymentRequest;
import com.banvien.training.dto.response.StatusPaymentResponse;
import com.banvien.training.dto.response.UserBalanceResponse;
import com.banvien.training.dto.response.UserResponse;
import com.banvien.training.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/{userId}")
    public UserResponse getUser(@PathVariable Long userId) {
        return userService.getUser(userId);
    }

    @GetMapping("/{userId}/balance")
    public UserBalanceResponse getUserBalance(@PathVariable Long userId) {
        return userService.getUserBalance(userId);
    }

    @PostMapping("/{userId}/deduct-money")
    public StatusPaymentResponse deductMoney(@RequestBody PaymentRequest request, @PathVariable Long userId) {
        return userService.deductMoney(userId, request.getAmount());
    }

    @PostMapping("/{userId}/refund-money")
    public StatusPaymentResponse refundMoney(@RequestBody PaymentRequest request, @PathVariable Long userId) {
        return userService.refundMoney(userId, request.getAmount());
    }

}
