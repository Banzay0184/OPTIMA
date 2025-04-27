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
    category = serializers.SerializerMethodField(read_only=True)
    images = ProductImageSerializer(many=True, read_only=True)
    colors = ProductColorSerializer(many=True)

    def get_category(self, obj):
        """Получить объект категории через связь с типом"""
        if obj.type and obj.type.category:
            return {
                'id': obj.type.category.id,
                'category_name': obj.type.category.category_name
            }
        return None

    def validate_product_name(self, value):
        # Получаем текущий объект при обновлении
        instance = getattr(self, 'instance', None)
        
        # Проверяем уникальность, исключая текущий объект при обновлении
        if Product.objects.filter(product_name=value).exclude(pk=getattr(instance, 'pk', None)).exists():
            raise serializers.ValidationError("Продукт с таким названием уже существует")
        return value
        
    def create(self, validated_data):
        # Извлекаем colors из validated_data, если они там есть
        colors_data = validated_data.pop('colors', [])
        
        # Создаем продукт
        product = Product.objects.create(**validated_data)
        
        # Создаем или получаем существующие объекты цвета и связываем их с продуктом
        for color_data in colors_data:
            color, created = ProductColor.objects.get_or_create(color=color_data['color'])
            product.colors.add(color)
            
        return product
        
    def update(self, instance, validated_data):
        # Логирование входных данных для отладки
        print("Обновление продукта:", instance.id, instance.product_name)
        print("Полученные данные:", validated_data)
        
        # Извлекаем colors из validated_data, если они там есть
        colors_data = validated_data.pop('colors', None)
        
        # Проверяем, есть ли поле type в validated_data (через source='type')
        type_obj = validated_data.get('type', None)
        if type_obj:
            print("Найден тип:", type_obj.id, type_obj.type_name)
            # Устанавливаем тип продукта
            instance.type = type_obj
            # Удаляем поле из validated_data, чтобы избежать двойной установки
            validated_data.pop('type', None)
        else:
            print("Тип не найден в данных")
        
        # Обновляем остальные поля продукта
        for attr, value in validated_data.items():
            print("Устанавливаем", attr, "=", value)
            setattr(instance, attr, value)
        instance.save()
        
        # Если предоставлены новые цвета, обновляем их
        if colors_data is not None:
            print("Обновляем цвета:", colors_data)
            # Очищаем существующие цвета
            instance.colors.clear()
            
            # Добавляем новые цвета
            for color_data in colors_data:
                color, created = ProductColor.objects.get_or_create(color=color_data['color'])
                instance.colors.add(color)
        else:
            print("Цвета не изменены")
                
        return instance

    class Meta:
        model = Product
        fields = [
            'id', 'product_name', 'throat_standard', 'throat_diameter',
            'package_volume', 'dimensions', 'compound', 'colors',
            'material', 'package', 'weight', 'application', 'description',
            'images', 'type', 'type_id', 'category',
            'created_at', 'updated_at', "in_stock", "article_number",
        ]
