from rest_framework import serializers
from .models import Category, Type, Product, ProductImage, ProductColor


class ProductColorSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductColor
        fields = ["color"]


class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ["id", "image"]


class CategorySerializer(serializers.ModelSerializer):
    def validate_category_name(self, value):
        if Category.objects.filter(category_name=value).exists():
            raise serializers.ValidationError("Категория с таким названием уже существует")
        return value

    class Meta:
        model = Category
        fields = ['id', 'category_name', 'created_at', 'updated_at']


class TypeSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(), source='category', write_only=True
    )

    def type_category_name(self, value):
        if Type.objects.filter(category_name=value).exists():
            raise serializers.ValidationError("Тип с таким названием уже существует")
        return value

    class Meta:
        model = Type
        fields = ['id', 'type_name', 'category', 'category_id', 'created_at', 'updated_at']


class ProductSerializer(serializers.ModelSerializer):
    type = TypeSerializer(read_only=True)
    type_id = serializers.PrimaryKeyRelatedField(
        queryset=Type.objects.all(), source='type', write_only=True
    )
    images = ProductImageSerializer(many=True, read_only=True)
    colors = ProductColorSerializer(many=True)

    def validate_product_name(self, value):
        if Product.objects.filter(product_name=value).exists():
            raise serializers.ValidationError("Продукт с таким названием уже существует")
        return value

    class Meta:
        model = Product
        fields = [
            'id', 'product_name', 'throat_standard', 'throat_diameter',
            'package_volume', 'dimensions', 'compound', 'colors',
            'material', 'package', 'weight', 'application', 'description',
            'images', 'type', 'type_id',
            'created_at', 'updated_at', "in_stock", "article_number",
        ]
