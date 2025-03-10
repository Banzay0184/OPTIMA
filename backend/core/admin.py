from django.contrib import admin
from django.utils.html import format_html
from .models import Category, Type, Product, ProductImage, ProductColor

# Админка для Category
class TypeInline(admin.TabularInline):
    model = Type
    extra = 1

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('category_name', 'created_at', 'updated_at', 'type_count', 'product_count')
    search_fields = ('category_name',)
    list_filter = ('created_at',)
    ordering = ('category_name',)
    inlines = [TypeInline]

    def type_count(self, obj):
        return obj.type_set.count()

    type_count.short_description = 'Типов'

    def product_count(self, obj):
        return Product.objects.filter(type__category=obj).count()

    product_count.short_description = 'Продуктов'

# Админка для Type
@admin.register(Type)
class TypeAdmin(admin.ModelAdmin):
    list_display = ('type_name', 'category', 'created_at', 'updated_at', 'product_count')
    search_fields = ('type_name',)
    list_filter = ('category', 'created_at')
    ordering = ('type_name',)
    autocomplete_fields = ('category',)

    def product_count(self, obj):
        return obj.product_set.count()

    product_count.short_description = 'Продуктов'

# Inline для ProductImage
class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 1
    fields = ('image', 'created_at')
    readonly_fields = ('created_at',)

# Inline для ProductColor
class ProductColorInline(admin.TabularInline):
    model = Product.colors.through  # Связующая таблица для ManyToMany
    extra = 1
    verbose_name = "Цвет"
    verbose_name_plural = "Цвета"

# Админка для ProductColor
@admin.register(ProductColor)
class ProductColorAdmin(admin.ModelAdmin):
    list_display = ('color',)
    search_fields = ('color',)

# Админка для Product
@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = (
        'product_name', 'get_category', 'get_type', 'package_volume', 'weight',
        'throat_diameter', 'colors_display', 'in_stock', 'article_number', 'image_preview', 'created_at'
    )
    search_fields = ('product_name', 'description', 'compound', 'material', 'application', 'article_number')
    list_filter = ('type', 'type__category', 'package_volume', 'in_stock', 'created_at', 'updated_at')
    list_editable = ('package_volume', 'weight', 'throat_diameter', 'in_stock')
    list_per_page = 20
    ordering = ('-created_at',)
    autocomplete_fields = ('type',)
    inlines = [ProductImageInline, ProductColorInline]  # Добавляем inline для цветов
    fieldsets = (
        (None, {
            'fields': ('product_name', 'type')
        }),
        ('Характеристики', {
            'fields': ('throat_standard', 'throat_diameter', 'package_volume', 'dimensions',
                       'compound', 'colors', 'material', 'package', 'weight', 'in_stock', 'article_number')
        }),
        ('Дополнительно', {
            'fields': ('application', 'description')
        }),
    )

    def get_category(self, obj):
        return obj.type.category.category_name if obj.type and obj.type.category else '-'

    get_category.short_description = 'Категория'
    get_category.admin_order_field = 'type__category__category_name'

    def get_type(self, obj):
        return obj.type.type_name if obj.type else '-'

    get_type.short_description = 'Тип'
    get_type.admin_order_field = 'type__type_name'

    def colors_display(self, obj):
        colors = obj.colors.all()
        if colors:
            # Отображаем первый цвет как квадрат и все цвета как текст
            return format_html(
                '<span style="background-color: {}; width: 20px; height: 20px; display: inline-block; margin-right: 5px;"></span> {}',
                colors[0].color, ", ".join(c.color for c in colors)
            )
        return "Нет цветов"

    colors_display.short_description = 'Цвета'
    colors_display.allow_tags = True

    def image_preview(self, obj):
        first_image = obj.images.first()
        if first_image and first_image.image:
            return format_html('<img src="{}" style="max-height: 50px;" />', first_image.image.url)
        return "Нет изображения"

    image_preview.short_description = 'Фото'
    image_preview.allow_tags = True

    @admin.action(description='Установить белый цвет (#FFFFFF)')
    def set_white_color(self, request, queryset):
        white_color, _ = ProductColor.objects.get_or_create(color="#FFFFFF")
        for product in queryset:
            product.colors.set([white_color])

    @admin.action(description='Сбросить вес на 0')
    def reset_weight(self, request, queryset):
        queryset.update(weight=0)

    actions = ['set_white_color', 'reset_weight']