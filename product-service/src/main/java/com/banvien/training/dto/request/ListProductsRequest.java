package com.banvien.training.dto.request;

import lombok.Data;

@Data
public class ListProductsRequest extends PageRequest {
    private String search;
    private String status;
    private String category;
}
