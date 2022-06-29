package com.banvien.training.service;

import com.banvien.training.dto.request.ListProductsRequest;
import com.banvien.training.dto.request.ProductOrderRequest;
import com.banvien.training.dto.response.ListProductsResponseDTO;
import com.banvien.training.dto.response.ProductOrderDTO;
import com.banvien.training.dto.response.StatusResponse;

import java.util.List;

public interface ProductService {
    ListProductsResponseDTO listAllProducts(ListProductsRequest listProductsRequest);

    List<ProductOrderDTO> getListProductsInOrder(List<ProductOrderRequest> request);

    List<String> getNameProducts(List<Long> productIds);

    StatusResponse checkAndCalculateInventory(List<ProductOrderRequest> request);

    StatusResponse rollbackInventory(List<ProductOrderRequest> request);
}
