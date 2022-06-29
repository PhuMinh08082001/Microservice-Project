package com.banvien.training.service.impl;


import com.banvien.training.dto.response.StatusPaymentResponse;
import com.banvien.training.dto.response.UserBalanceResponse;
import com.banvien.training.dto.response.UserResponse;
import com.banvien.training.exception.OutOfMoneyException;
import com.banvien.training.exception.ResourceNotFoundException;
import com.banvien.training.repository.UserRepository;
import com.banvien.training.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Log4j2
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    @Override
    public UserBalanceResponse getUserBalance(Long userId) {
        var user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User " + userId + " "));

        return new UserBalanceResponse(user.getBalance());
    }

    @Override
    public UserResponse getUser(Long userId) {
        var user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User " + userId + " "));
        return new UserResponse(user.getId());
    }

    @Override
    public StatusPaymentResponse deductMoney(Long userId, Long amount) {
        var user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User " + userId + " "));
        if (user.getBalance() < amount) throw new OutOfMoneyException("User" + userId);
        user.setBalance(user.getBalance() - amount);
        userRepository.save(user);
        return new StatusPaymentResponse("Deduct successfully");
    }

    @Override
    public StatusPaymentResponse refundMoney(Long userId, Long amount) {
        var user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User " + userId + " "));
        user.setBalance(user.getBalance() + amount);
        userRepository.save(user);
        return new StatusPaymentResponse("Refund successfully");
    }
}

