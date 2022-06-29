package com.banvien.training.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ProductResponseDTO {
    private String name;
    private Long quantity;
    private Long inventory;
    private String categoryName;
}
