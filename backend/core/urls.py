from django.urls import path
from .views import (
    CategoryListCreateView, CategoryDetailView,
    TypeListCreateView, TypeDetailView,
    ProductListCreateView, ProductDetailView, ObtainAuthTokenView,
    ProductImageListCreateView, ProductImageDetailView
)

urlpatterns = [
    path('token/', ObtainAuthTokenView.as_view(), name='obtain_token'),

    path('categories/', CategoryListCreateView.as_view(), name='category-list'),
    path('categories/<int:pk>/', CategoryDetailView.as_view(), name='category-detail'),
    path('types/', TypeListCreateView.as_view(), name='type-list'),
    path('types/<int:pk>/', TypeDetailView.as_view(), name='type-detail'),
    path('products/', ProductListCreateView.as_view(), name='product-list'),
    path('products/<int:pk>/', ProductDetailView.as_view(), name='product-detail'),
    path('product-images/', ProductImageListCreateView.as_view(), name='product-image-list'),
    path('product-images/<int:pk>/', ProductImageDetailView.as_view(), name='product-image-detail'),
]
