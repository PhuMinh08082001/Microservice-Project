package com.banvien.training.service;

import com.banvien.training.*;
import com.banvien.training.entity.ProductEntity;
import com.banvien.training.exception.OutOfStockException;
import com.banvien.training.exception.ResourceNotFoundException;
import com.banvien.training.repository.ProductDslRepository;
import com.banvien.training.repository.ProductRepository;
import io.grpc.stub.StreamObserver;
import lombok.RequiredArgsConstructor;
import net.devh.boot.grpc.server.service.GrpcService;

import java.util.List;
import java.util.stream.Collectors;

@GrpcService
@RequiredArgsConstructor
public class ProductServiceGrpc extends com.banvien.training.ProductServiceGrpc.ProductServiceImplBase {
    private final ProductDslRepository productDslRepository;
    private final ProductRepository productRepository;

    @Override
    public void getNameProducts(ProductRequestIds request, StreamObserver<ProductResponseNames> responseObserver) {
        var productIds = request.getIdList().stream().map(id -> (long) id).collect(Collectors.toList());
        var productEntities = productDslRepository.getListProductsInOrder(productIds);
        List<String> productsName = productIds.stream()
                .map(item ->
                        productEntities.stream().filter(ent -> ent.getId().equals(item))
                                .findFirst().orElseThrow(() -> new ResourceNotFoundException("Product " + item))
                                .getName()).collect(Collectors.toList());
        responseObserver.onNext(ProductResponseNames.newBuilder().addAllName(productsName).build());
        responseObserver.onCompleted();
    }

    @Override
    public void getListProductsInOrder(ProductOrderRequest request, StreamObserver<ProductOrderResponse> responseObserver) {
        var productIds = request.getProductsList()
                .stream().map(item -> (long) item.getProductId()).sorted().collect(Collectors.toList());
        var productEntities = productDslRepository.getListProductsInOrder(productIds);

        List<ProductResponse> response
                = request.getProductsList().stream().map(item -> generateNewProductResponse(item, productEntities))
                .collect(Collectors.toList());

        responseObserver.onNext(ProductOrderResponse.newBuilder().addAllProducts(response).build());
        responseObserver.onCompleted();

    }

    public ProductResponse generateNewProductResponse(ProductRequest request, List<ProductEntity> productEntities) {
        ProductEntity product = productEntities.stream()
                .filter(prd -> prd.getId().equals((long) request.getProductId()))
                .findFirst().orElseThrow(() -> new ResourceNotFoundException("Product " + request.getProductId()));

        if (product.getInventory() < request.getQuantity())
            throw new OutOfStockException("Product " + request.getProductId());

        return ProductResponse.newBuilder()
                .setProductId(product.getId().intValue())
                .setPrice(product.getPrice().intValue())
                .setQuantity(request.getQuantity())
                .build();
    }

    @Override
    public void checkAndCalculateInventory(ProductOrderRequest request, StreamObserver<StatusResponse> responseObserver) {
        var productIds = request.getProductsList().stream()
                .map(prd -> (long) prd.getProductId()).collect(Collectors.toList());
        var productEntities = productDslRepository.getListProductsInOrder(productIds);

        request.getProductsList().forEach(item -> {
            var entity = productEntities.stream().filter(ent -> ent.getId().equals((long) item.getProductId())).findFirst().orElseThrow(() -> new ResourceNotFoundException("Product " + item));
            if (entity.getInventory() < item.getQuantity()) throw new OutOfStockException("Product " + entity.getId());
            entity.setInventory(entity.getInventory() - item.getQuantity());
        });

        productRepository.saveAll(productEntities);
        responseObserver.onNext(StatusResponse.newBuilder()
                .setStatus("Check and calculate products successfully").build());
        responseObserver.onCompleted();
    }

    @Override
    public void rollbackInventory(ProductOrderRequest request, StreamObserver<StatusResponse> responseObserver) {
        var productIds = request.getProductsList().stream()
                .map(prd -> (long) prd.getProductId()).collect(Collectors.toList());
        var productEntities = productDslRepository.getListProductsInOrder(productIds);

        request.getProductsList().forEach(item -> {
            var entity = productEntities.stream().filter(ent -> ent.getId().equals((long) item.getProductId())).findFirst().orElseThrow(() -> new ResourceNotFoundException("Product " + item));
            entity.setInventory(entity.getInventory() + item.getQuantity());
        });

        productRepository.saveAll(productEntities);
        responseObserver.onNext(StatusResponse.newBuilder()
                .setStatus("Roll back products successfully").build());
        responseObserver.onCompleted();
    }
}
