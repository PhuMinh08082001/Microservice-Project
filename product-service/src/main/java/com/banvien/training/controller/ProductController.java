package com.banvien.training.controller;

import com.banvien.training.dto.request.ListProductsRequest;
import com.banvien.training.dto.request.ProductOrderRequest;
import com.banvien.training.dto.response.ListProductsResponseDTO;
import com.banvien.training.dto.response.ProductOrderDTO;
import com.banvien.training.dto.response.StatusResponse;
import com.banvien.training.service.ProductService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    @Operation(summary = "Get all products with sorting, paging ...")
    @GetMapping("")
    public ListProductsResponseDTO listProducts(@ModelAttribute ListProductsRequest request) {
        return productService.listAllProducts(request);
    }

    @Operation(summary = "Check exits products and get products detail")
    @PostMapping("/products-order")
    public List<ProductOrderDTO> getListProductsInOrder(@RequestBody List<ProductOrderRequest> request) {
        return productService.getListProductsInOrder(request);
    }

    @Operation(summary = "Check exits products and get products detail")
    @RequestMapping(value = "/get-list-product-name/{productIds}", method = RequestMethod.GET)
    @ResponseBody
    public List<String> getNameProducts(@PathVariable List<Long> productIds) {
        return productService.getNameProducts(productIds);
    }

    @PostMapping("/check-calculate-inventory")
    public StatusResponse checkAndCalculateInventory(@RequestBody List<ProductOrderRequest> request) {
        return productService.checkAndCalculateInventory(request);
    }

    @PostMapping("/rollback-inventory")
    public StatusResponse rollbackInventory(@RequestBody List<ProductOrderRequest> request) {
        return productService.rollbackInventory(request);
    }
}
