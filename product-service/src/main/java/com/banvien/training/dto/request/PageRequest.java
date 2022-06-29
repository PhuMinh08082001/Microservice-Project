package com.banvien.training.dto.request;

import lombok.Data;

import java.io.Serializable;

/**
 * @author phu.nguyen-minh on 6/23/22
 */
@Data
public abstract class PageRequest implements Serializable {
    private int page = 0;
    private int size = 4;
    private String sort;
    private String direction;
}
