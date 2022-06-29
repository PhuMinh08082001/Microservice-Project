package com.banvien.training.dto.response;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
public class ListProductsResponseDTO extends PageResponse {
    private List<?> items;

    public ListProductsResponseDTO(Long page, Long pageSize, Long total, Long totalPage, List<?> items) {
        super(page, pageSize, total, totalPage);
        this.items = items;
    }

}
