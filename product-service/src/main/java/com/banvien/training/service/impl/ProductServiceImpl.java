package com.banvien.training.service.impl;

import com.banvien.training.dto.request.ListProductsRequest;
import com.banvien.training.dto.request.ProductOrderRequest;
import com.banvien.training.dto.response.ListProductsResponseDTO;
import com.banvien.training.dto.response.ProductOrderDTO;
import com.banvien.training.dto.response.StatusResponse;
import com.banvien.training.entity.ProductEntity;
import com.banvien.training.exception.OutOfStockException;
import com.banvien.training.exception.ResourceNotFoundException;
import com.banvien.training.mapper.ProductMapper;
import com.banvien.training.repository.ProductDslRepository;
import com.banvien.training.repository.ProductRepository;
import com.banvien.training.service.ProductService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Log4j2
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

    private final ProductDslRepository productDslRepository;

    private final ProductRepository productRepository;
    private final ProductMapper productMapper;

    @Override
    public ListProductsResponseDTO listAllProducts(ListProductsRequest listProductsRequest) {

        var productPage = productDslRepository.findAll(listProductsRequest);
        var productListDTO = productPage.getContent().stream()
                .map(productMapper::toDTO).collect(Collectors.toList());

        return new ListProductsResponseDTO((long) productPage.getNumber() + 1,
                (long) productPage.getSize(), productPage.getTotalElements(), (long) productPage.getTotalPages(),
                productListDTO);

    }

    @Override
    public List<ProductOrderDTO> getListProductsInOrder(List<ProductOrderRequest> request) {
        var productIds = request.stream()
                .map(ProductOrderRequest::getProductId).sorted().collect(Collectors.toList());

        var productEntities = productDslRepository.getListProductsInOrder(productIds);

        List<ProductOrderDTO> productResponseDTOS
                = request.stream().map(item -> generateNewProductOrderDTO(item, productEntities))
                .collect(Collectors.toList());

        return productResponseDTOS;
    }

    public ProductOrderDTO generateNewProductOrderDTO(ProductOrderRequest request, List<ProductEntity> productEntities) {
        ProductEntity product = productEntities.stream()
                .filter(prd -> prd.getId().equals(request.getProductId()))
                .findFirst().orElseThrow(() -> new ResourceNotFoundException("Product " + request.getProductId()));

        if (product.getInventory() < request.getQuantity())
            throw new OutOfStockException("Product " + request.getProductId());

        return new ProductOrderDTO(product.getId(), product.getPrice(), request.getQuantity());
    }

    @Override
    public List<String> getNameProducts(List<Long> productIds) {
        var productEntities = productDslRepository.getListProductsInOrder(productIds);
        List<String> productsName = productIds.stream()
                .map(item ->
                        productEntities.stream().filter(ent -> ent.getId().equals(item))
                                .findFirst().orElseThrow(() -> new ResourceNotFoundException("Product " + item))
                                .getName()).collect(Collectors.toList());

        return productsName;
    }

    @Override
    public StatusResponse checkAndCalculateInventory(List<ProductOrderRequest> request) {
        var productIds = request.stream()
                .map(ProductOrderRequest::getProductId).collect(Collectors.toList());
        var productEntities = productDslRepository.getListProductsInOrder(productIds);

        request.forEach(item -> {
            var entity = productEntities.stream().filter(ent -> ent.getId().equals(item.getProductId())).findFirst().orElseThrow(() -> new ResourceNotFoundException("Product " + item));
            if (entity.getInventory() < item.getQuantity()) throw new OutOfStockException("Product " + entity.getId());
            entity.setInventory(entity.getInventory() - item.getQuantity());
        });

        productRepository.saveAll(productEntities);
        return new StatusResponse("Check and calculate products successfully");
    }

    @Override
    public StatusResponse rollbackInventory(List<ProductOrderRequest> request) {
        var productIds = request.stream()
                .map(ProductOrderRequest::getProductId).collect(Collectors.toList());
        var productEntities = productDslRepository.getListProductsInOrder(productIds);

        request.forEach(item -> {
            var entity = productEntities.stream().filter(ent -> ent.getId().equals(item.getProductId())).findFirst().orElseThrow(() -> new ResourceNotFoundException("Product " + item));
            entity.setInventory(entity.getInventory() + item.getQuantity());
        });

        productRepository.saveAll(productEntities);
        return new StatusResponse("Roll back products successfully");
    }
}
