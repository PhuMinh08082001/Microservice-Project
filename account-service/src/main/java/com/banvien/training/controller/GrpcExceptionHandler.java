package com.banvien.training.controller;

import com.banvien.training.exception.OutOfMoneyException;
import com.banvien.training.exception.ResourceNotFoundException;
import io.grpc.Status;
import net.devh.boot.grpc.server.advice.GrpcAdvice;

@GrpcAdvice
public class GrpcExceptionHandler {

    @net.devh.boot.grpc.server.advice.GrpcExceptionHandler
    public Status handleInvalidArgument(IllegalArgumentException e) {
        return Status.INVALID_ARGUMENT.withDescription("Your description").withCause(e);
    }

    @net.devh.boot.grpc.server.advice.GrpcExceptionHandler({ResourceNotFoundException.class, OutOfMoneyException.class})
    public Status handleResourceNotFoundException(RuntimeException e) {
        Status status = Status.NOT_FOUND.withDescription(e.getLocalizedMessage()).withCause(e);
        return status;
    }
}
