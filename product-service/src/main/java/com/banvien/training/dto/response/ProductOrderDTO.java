package com.banvien.training.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ProductOrderDTO {
    private Long product_id;
    private Long price;
    private Long quantity;
}
