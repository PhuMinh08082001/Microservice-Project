package com.banvien.training.mapper;

import com.banvien.training.dto.response.ProductResponseDTO;
import com.banvien.training.entity.ProductEntity;
import org.springframework.stereotype.Component;

@Component
public class ProductMapper {

    public ProductResponseDTO toDTO(ProductEntity entity) {
        return new ProductResponseDTO(entity.getName(), entity.getQuantity(),
                entity.getInventory(), entity.getCategory().getName());
    }
//    public ProductOrderDTO toProductOrderDTO(ProductEntity entity){
//        return new ProductOrderDTO(entity.getId(), entity.getPrice());
//    }
}
