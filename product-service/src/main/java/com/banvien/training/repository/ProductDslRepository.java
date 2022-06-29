package com.banvien.training.repository;

import com.banvien.training.dto.request.ListProductsRequest;
import com.banvien.training.entity.ProductEntity;
import com.banvien.training.entity.QCategoryEntity;
import com.banvien.training.entity.QProductEntity;
import com.querydsl.core.types.Order;
import com.querydsl.core.types.OrderSpecifier;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.core.types.dsl.Expressions;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.stereotype.Repository;

import java.util.Arrays;
import java.util.Collection;
import java.util.List;

@Repository
@RequiredArgsConstructor
public class ProductDslRepository {

    private final JPAQueryFactory queryFactory;

    private final QProductEntity product = QProductEntity.productEntity;

    public Page<ProductEntity> findAll(ListProductsRequest request) {

        BooleanExpression alwaysTrue = Expressions.asBoolean(true).isTrue();
        List<String> statusAvailable = Arrays.asList("available", "unavailable");
        String category = request.getCategory();
        Order direction = "desc".equalsIgnoreCase(request.getDirection()) ? Order.DESC : Order.ASC;
        String search = request.getSearch();
        String sort = request.getSort();
        String status = request.getStatus();

        var productsQuery = queryFactory.selectFrom(product)
                .leftJoin(product.category, QCategoryEntity.categoryEntity).fetchJoin()
                .where(search != null ? product.name.like('%' + search + '%') : alwaysTrue)
                .where(category != null ? QCategoryEntity.categoryEntity.name.equalsIgnoreCase(category) : alwaysTrue)
                .where(status != null ? ((statusAvailable.contains(status) ?
                        (status.equalsIgnoreCase("available")
                                ? product.inventory.gt(0)
                                : product.inventory.eq((long) 0))
                        : alwaysTrue)) : alwaysTrue);

        if (!(sort == null)) productsQuery.orderBy(getOrderBy(sort.toLowerCase(), direction));

        var bunchOfProducts = productsQuery.fetch();

        /*  Handle paging */
        int startOfPage = (request.getPage() - 1) * request.getSize();
        if (startOfPage >= bunchOfProducts.size() || request.getPage() <= 0) {
            request.setPage(1);
            startOfPage = 0;
        }
        var pageable = org.springframework.data.domain.PageRequest.of(request.getPage() - 1, request.getSize());
        int endOfPage = Math.min(startOfPage + pageable.getPageSize(), bunchOfProducts.size());

        return new PageImpl<>(bunchOfProducts.subList(startOfPage, endOfPage), pageable, bunchOfProducts.size());
    }

    public List<ProductEntity> getListProductsInOrder(List<Long> productIds) {
        var productsQuery = queryFactory.selectFrom(product)
                .where(product.id.in((Collection<Long>) productIds))
                .orderBy(new OrderSpecifier<>(Order.ASC, product.id));

        return productsQuery.fetch();
    }

    public OrderSpecifier<?> getOrderBy(String orderBy, Order direction) {
        switch (orderBy) {
            case "productname":
                return new OrderSpecifier<>(direction, product.name);
            case "price":
                return new OrderSpecifier<>(direction, product.price);
        }
        return new OrderSpecifier<>(direction, product.inventory);
    }

}
