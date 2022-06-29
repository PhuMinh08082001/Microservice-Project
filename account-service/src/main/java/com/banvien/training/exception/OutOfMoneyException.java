package com.banvien.training.exception;

import lombok.Getter;
import org.apache.commons.lang3.StringUtils;

@Getter
public class OutOfMoneyException extends RuntimeException {
    private final String entity;

    public OutOfMoneyException(String entity) {
        super(StringUtils.capitalize(entity) + " don't have money enough to payment");
        this.entity = entity;
    }
}
