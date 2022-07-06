package com.banvien.training.service;

import com.banvien.training.StatusPaymentResponse;
import com.banvien.training.UserPaymentRequest;
import com.banvien.training.UserRequest;
import com.banvien.training.UserResponse;
import com.banvien.training.exception.OutOfMoneyException;
import com.banvien.training.exception.ResourceNotFoundException;
import com.banvien.training.repository.UserRepository;
import io.grpc.stub.StreamObserver;
import lombok.RequiredArgsConstructor;
import net.devh.boot.grpc.server.service.GrpcService;

@GrpcService
@RequiredArgsConstructor
public class UserServiceGrpc extends com.banvien.training.UserServiceGrpc.UserServiceImplBase {

    private final UserRepository userRepository;

    @Override
    public void getUser(UserRequest request, StreamObserver<UserResponse> responseObserver) {
        var user = userRepository.findById((long) request.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User " + (long) request.getId() + " "));

        responseObserver.onNext(UserResponse.newBuilder().setUserId(request.getId()).build());
        responseObserver.onCompleted();
    }

    @Override
    public void deductMoney(UserPaymentRequest request, StreamObserver<StatusPaymentResponse> responseObserver) {
        long userId = (long) request.getUserId();
        long amount = (long) request.getAmount();

        var user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User " + (long) request.getUserId() + " "));
        if (user.getBalance() < amount) throw new OutOfMoneyException("User" + userId);
        user.setBalance(user.getBalance() - amount);
        userRepository.save(user);
        responseObserver.onNext(StatusPaymentResponse.newBuilder().setStatus("Deduct successfully").build());
        responseObserver.onCompleted();
    }

    @Override
    public void refundMoney(UserPaymentRequest request, StreamObserver<StatusPaymentResponse> responseObserver) {
        long userId = (long) request.getUserId();
        long amount = (long) request.getAmount();

        var user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User " + (long) request.getUserId() + " "));
        user.setBalance(user.getBalance() + amount);
        userRepository.save(user);
        responseObserver.onNext(StatusPaymentResponse.newBuilder().setStatus("Refund successfully").build());
        responseObserver.onCompleted();
    }
}
