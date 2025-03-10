from django.db import models
from colorfield.fields import ColorField
from django.core.validators import FileExtensionValidator


class BaseModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class Category(BaseModel):
    category_name = models.CharField(max_length=255, verbose_name='Категория')

    class Meta:
        verbose_name_plural = 'Категории'
        verbose_name = 'Категория'

    def __str__(self):
        return self.category_name


class Type(BaseModel):
    type_name = models.CharField(max_length=255, verbose_name='Тип')
    category = models.ForeignKey(Category, on_delete=models.CASCADE, verbose_name='Категория')

    class Meta:
        verbose_name_plural = 'Типы'
        verbose_name = 'Тип'

    def __str__(self):
        return self.type_name


class ProductColor(models.Model):
    color = models.CharField(max_length=7)  # Например, "#FFFFFF"

    def __str__(self):
        return self.color


class Product(BaseModel):
    product_name = models.CharField(max_length=255, verbose_name='Название')

    throat_standard = models.CharField(max_length=255, blank=True, null=True,
                                       verbose_name='Стандарт горла')
    throat_diameter = models.PositiveIntegerField(blank=True, null=True,
                                                  verbose_name='Диаметр горла (мм)')
    package_volume = models.PositiveIntegerField(blank=True, null=True,
                                                 verbose_name='Объем (литров)')
    dimensions = models.CharField(max_length=255, blank=True, null=True,
                                  verbose_name='Габариты (ДхШ стенки (мм))')
    compound = models.CharField(max_length=255, blank=True, null=True, verbose_name='Состав')
    colors = models.ManyToManyField(ProductColor, blank=True)
    material = models.CharField(max_length=255, blank=True, null=True, verbose_name='Материал')
    package = models.CharField(max_length=255, blank=True, null=True, verbose_name='Упаковка')
    weight = models.PositiveIntegerField(blank=True, null=True, verbose_name='Вес (г)')
    application = models.CharField(max_length=255, blank=True, null=True, verbose_name='Применение')
    description = models.TextField(blank=True, null=True, verbose_name='Описание')
    in_stock = models.BooleanField(default=True)  # В наличии
    article_number = models.CharField(max_length=50, unique=True, null=True, blank=True)  # Артикул

    type = models.ForeignKey(Type, on_delete=models.CASCADE)

    class Meta:
        verbose_name_plural = 'Продукты'
        verbose_name = 'Продукт'

    def __str__(self):
        return self.product_name


class ProductImage(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="images")
    image = models.ImageField(
        upload_to='images/',
        blank=True,
        null=True,
        verbose_name='Изображение',
        validators=[FileExtensionValidator(allowed_extensions=['jpg', 'jpeg', 'png'])]
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Image for {self.product.product_name}"
