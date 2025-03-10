from drf_spectacular.utils import OpenApiResponse, extend_schema

from main.serializers.product import ProductFilterParams, ProductSerializer


def swagger_list():
    return extend_schema(
        tags=["product"],
        summary="List of products.",
        operation_id="list_categories",
        parameters=[ProductFilterParams()],
        responses={200: ProductSerializer(many=True)},
    )


def swagger_post():
    return extend_schema(
        tags=["product"],
        summary="Create product",
        responses={201: ProductSerializer},
    )


def swagger_retrieve():
    return extend_schema(
        tags=["product"],
        summary="Get one product by ID",
        operation_id="detail_products",
        responses={
            200: ProductSerializer,
            404: OpenApiResponse(response=None, description="Concreate `Model` not found"),
        },
    )


def swagger_update():
    return extend_schema(
        tags=["product"],
        summary="Update one product by ID",
        responses={
            200: ProductSerializer,
            404: OpenApiResponse(response=None, description="Concreate `Model` not found"),
        },
    )


def swagger_delete():
    return extend_schema(
        tags=["product"],
        summary="Remove one product by ID",
        responses={
            204: {},
            404: OpenApiResponse(response=None, description="Concreate `Model` not found"),
        },
    )
