package com.banvien.training.service;

import com.banvien.training.dto.response.StatusPaymentResponse;
import com.banvien.training.dto.response.UserBalanceResponse;
import com.banvien.training.dto.response.UserResponse;

public interface UserService {
    UserBalanceResponse getUserBalance(Long userId);

    UserResponse getUser(Long userId);

    StatusPaymentResponse deductMoney(Long userId, Long amount);

    StatusPaymentResponse refundMoney(Long userId, Long amount);
}
