package com.banvien.training.exception;

import lombok.Getter;
import org.apache.commons.lang3.StringUtils;

@Getter
public class ResourceNotFoundException extends RuntimeException {
    private final String entity;

    public ResourceNotFoundException(String entity) {
        super(StringUtils.capitalize(entity) + " not found");
        this.entity = entity;
    }
}

