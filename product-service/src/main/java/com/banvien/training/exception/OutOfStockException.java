package com.banvien.training.exception;

import lombok.Getter;
import org.apache.commons.lang3.StringUtils;

@Getter
public class OutOfStockException extends RuntimeException {
    private final String entity;

    public OutOfStockException(String entity) {
        super(StringUtils.capitalize(entity) + " out of stock");
        this.entity = entity;
    }
}
