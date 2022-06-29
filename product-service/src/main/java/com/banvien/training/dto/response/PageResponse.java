package com.banvien.training.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public abstract class PageResponse {
    private Long page;
    private Long pageSize;
    private Long total;
    private Long totalPage;
}
