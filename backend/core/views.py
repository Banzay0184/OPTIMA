from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.http import Http404
from .models import Category, Type, Product, ProductImage
from .serializers import CategorySerializer, TypeSerializer, ProductSerializer, ProductImageSerializer
from django.db.models import Q
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token
from rest_framework.permissions import AllowAny
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from django.utils.dateparse import parse_datetime
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi


class ObtainAuthTokenView(APIView):
    permission_classes = [AllowAny]  # Доступ только через логин/пароль

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        user = User.objects.filter(username=username).first()
        if user and user.check_password(password):
            token, created = Token.objects.get_or_create(user=user)
            return Response({"token": token.key}, status=status.HTTP_200_OK)
        return Response({"error": "Неверные учетные данные"}, status=status.HTTP_401_UNAUTHORIZED)


# Category API (без изменений)
class CategoryListCreateView(APIView):
    def get(self, request):
        categories = Category.objects.all()
        serializer = CategorySerializer(categories, many=True)
        return Response({"count": len(serializer.data), "results": serializer.data})

    def post(self, request):
        print(request.headers)
        if not request.user.is_authenticated:
            return Response({"detail": "Authentication credentials were not provided."},
                            status=status.HTTP_401_UNAUTHORIZED)

        serializer = CategorySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response({"error": "Invalid data", "details": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)


class CategoryDetailView(APIView):
    def get_object(self, pk):
        try:
            return Category.objects.get(pk=pk)
        except Category.DoesNotExist:
            raise Http404("Category not found")

    def get(self, request, pk):
        category = self.get_object(pk)
        serializer = CategorySerializer(category)
        return Response(serializer.data)

    def put(self, request, pk):
        category = self.get_object(pk)
        serializer = CategorySerializer(category, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response({"error": "Invalid data", "details": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        category = self.get_object(pk)
        category.delete()
        return Response({"message": "Category deleted"}, status=status.HTTP_204_NO_CONTENT)


# Type API (добавляем фильтрацию по категории)
class TypeListCreateView(APIView):
    def get(self, request):
        types = Type.objects.all()
        category_id = request.query_params.get('category', None)
        if category_id:
            try:
                types = types.filter(category__id=category_id)
            except ValueError:
                return Response({"error": "Invalid category ID"}, status=status.HTTP_400_BAD_REQUEST)
        serializer = TypeSerializer(types, many=True)
        return Response({
            "count": len(serializer.data),
            "category_id": category_id if category_id else "All",
            "results": serializer.data
        })

    def post(self, request):
        serializer = TypeSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response({"error": "Invalid data", "details": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)


class TypeDetailView(APIView):
    def get_object(self, pk):
        try:
            return Type.objects.get(pk=pk)
        except Type.DoesNotExist:
            raise Http404("Type not found")

    def get(self, request, pk):
        type_obj = self.get_object(pk)
        serializer = TypeSerializer(type_obj)
        return Response(serializer.data)

    def put(self, request, pk):
        type_obj = self.get_object(pk)
        serializer = TypeSerializer(type_obj, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response({"error": "Invalid data", "details": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        type_obj = self.get_object(pk)
        type_obj.delete()
        return Response({"message": "Type deleted"}, status=status.HTTP_204_NO_CONTENT)


class ProductListCreateView(APIView):
    @swagger_auto_schema(
        operation_id='list_products',
        operation_summary='Получить список продуктов с фильтрацией, сортировкой и пагинацией',
        operation_description='Возвращает список продуктов с учетом фильтров, пагинации и сортировки.',
        manual_parameters=[
            openapi.Parameter('type', openapi.IN_QUERY, description="ID типа (обязательный)",
                              type=openapi.TYPE_INTEGER, required=True),
            openapi.Parameter('category', openapi.IN_QUERY, description="ID категории",
                              type=openapi.TYPE_INTEGER),
            openapi.Parameter('name', openapi.IN_QUERY, description="Поиск по названию (частичное совпадение)",
                              type=openapi.TYPE_STRING),
            openapi.Parameter('throat_standard', openapi.IN_QUERY, description="Стандарт горла (частичное совпадение)",
                              type=openapi.TYPE_STRING),
            openapi.Parameter('throat_diameter', openapi.IN_QUERY, description="Диаметр горла (точное значение)",
                              type=openapi.TYPE_INTEGER),
            openapi.Parameter('throat_diameter_min', openapi.IN_QUERY, description="Минимальный диаметр горла",
                              type=openapi.TYPE_INTEGER),
            openapi.Parameter('throat_diameter_max', openapi.IN_QUERY, description="Максимальный диаметр горла",
                              type=openapi.TYPE_INTEGER),
            openapi.Parameter('volume', openapi.IN_QUERY, description="Объем (точное значение)",
                              type=openapi.TYPE_INTEGER),
            openapi.Parameter('volume_min', openapi.IN_QUERY, description="Минимальный объем",
                              type=openapi.TYPE_INTEGER),
            openapi.Parameter('volume_max', openapi.IN_QUERY, description="Максимальный объем",
                              type=openapi.TYPE_INTEGER),
            openapi.Parameter('dimensions', openapi.IN_QUERY, description="Габариты (частичное совпадение)",
                              type=openapi.TYPE_STRING),
            openapi.Parameter('compound', openapi.IN_QUERY, description="Состав (частичное совпадение)",
                              type=openapi.TYPE_STRING),
            openapi.Parameter('color', openapi.IN_QUERY, description="Цвет (например, #FFFFFF)",
                              type=openapi.TYPE_STRING),
            openapi.Parameter('material', openapi.IN_QUERY, description="Материал (частичное совпадение)",
                              type=openapi.TYPE_STRING),
            openapi.Parameter('package', openapi.IN_QUERY, description="Упаковка (частичное совпадение)",
                              type=openapi.TYPE_STRING),
            openapi.Parameter('weight', openapi.IN_QUERY, description="Вес (точное значение)",
                              type=openapi.TYPE_INTEGER),
            openapi.Parameter('weight_min', openapi.IN_QUERY, description="Минимальный вес",
                              type=openapi.TYPE_INTEGER),
            openapi.Parameter('weight_max', openapi.IN_QUERY, description="Максимальный вес",
                              type=openapi.TYPE_INTEGER),
            openapi.Parameter('application', openapi.IN_QUERY, description="Применение (частичное совпадение)",
                              type=openapi.TYPE_STRING),
            openapi.Parameter('description', openapi.IN_QUERY, description="Описание (частичное совпадение)",
                              type=openapi.TYPE_STRING),
            openapi.Parameter('created_at_min', openapi.IN_QUERY, description="Минимальная дата создания (ISO формат)",
                              type=openapi.TYPE_STRING, format='date-time'),
            openapi.Parameter('created_at_max', openapi.IN_QUERY, description="Максимальная дата создания (ISO формат)",
                              type=openapi.TYPE_STRING, format='date-time'),
            openapi.Parameter('updated_at_min', openapi.IN_QUERY,
                              description="Минимальная дата обновления (ISO формат)",
                              type=openapi.TYPE_STRING, format='date-time'),
            openapi.Parameter('updated_at_max', openapi.IN_QUERY,
                              description="Максимальная дата обновления (ISO формат)",
                              type=openapi.TYPE_STRING, format='date-time'),
            openapi.Parameter('sort', openapi.IN_QUERY,
                              description="Поле для сортировки (product_name, package_volume, created_at, updated_at, throat_diameter, weight)",
                              type=openapi.TYPE_STRING),
            openapi.Parameter('order', openapi.IN_QUERY, description="Порядок сортировки (asc/desc)",
                              type=openapi.TYPE_STRING, enum=['asc', 'desc'], default='asc'),
            openapi.Parameter('page', openapi.IN_QUERY, description="Номер страницы",
                              type=openapi.TYPE_INTEGER, default=1),
            openapi.Parameter('page_size', openapi.IN_QUERY, description="Размер страницы",
                              type=openapi.TYPE_INTEGER, default=10),
        ],
        responses={
            200: openapi.Response('Список продуктов', ProductSerializer(many=True)),
            401: openapi.Response('Требуется аутентификация',
                                  openapi.Schema(type='object', properties={'detail': {'type': 'string'}}))
        },
        security=[{'TokenAuth': []}]
    )
    def get(self, request):
        products = Product.objects.all()

        # Фильтрация по типу (обязательный параметр)
        type_id = request.query_params.get('type', None)
        if type_id:
            try:
                products = products.filter(type_id=type_id)
            except ValueError:
                return Response({"error": "Invalid type ID"}, status=status.HTTP_400_BAD_REQUEST)

        # Фильтрация по категории через связь type__category
        category_id = request.query_params.get('category', None)
        if category_id:
            try:
                products = products.filter(type__category_id=category_id)
            except ValueError:
                return Response({"error": "Invalid category ID"}, status=status.HTTP_400_BAD_REQUEST)

        # Оставшаяся логика фильтрации остаётся без изменений
        name = request.query_params.get('name', None)
        if name:
            products = products.filter(product_name__icontains=name)

        throat_standard = request.query_params.get('throat_standard', None)
        if throat_standard:
            products = products.filter(throat_standard__icontains=throat_standard)

        throat_diameter = request.query_params.get('throat_diameter', None)
        if throat_diameter:
            try:
                products = products.filter(throat_diameter=int(throat_diameter))
            except ValueError:
                return Response({"error": "Invalid throat_diameter value"}, status=status.HTTP_400_BAD_REQUEST)

        throat_diameter_min = request.query_params.get('throat_diameter_min', None)
        throat_diameter_max = request.query_params.get('throat_diameter_max', None)
        if throat_diameter_min:
            try:
                products = products.filter(throat_diameter__gte=int(throat_diameter_min))
            except ValueError:
                return Response({"error": "Invalid throat_diameter_min value"}, status=status.HTTP_400_BAD_REQUEST)
        if throat_diameter_max:
            try:
                products = products.filter(throat_diameter__lte=int(throat_diameter_max))
            except ValueError:
                return Response({"error": "Invalid throat_diameter_max value"}, status=status.HTTP_400_BAD_REQUEST)

        volume = request.query_params.get('volume', None)
        if volume:
            try:
                products = products.filter(package_volume=int(volume))
            except ValueError:
                return Response({"error": "Invalid volume value"}, status=status.HTTP_400_BAD_REQUEST)

        volume_min = request.query_params.get('volume_min', None)
        volume_max = request.query_params.get('volume_max', None)
        if volume_min:
            try:
                products = products.filter(package_volume__gte=int(volume_min))
            except ValueError:
                return Response({"error": "Invalid volume_min value"}, status=status.HTTP_400_BAD_REQUEST)
        if volume_max:
            try:
                products = products.filter(package_volume__lte=int(volume_max))
            except ValueError:
                return Response({"error": "Invalid volume_max value"}, status=status.HTTP_400_BAD_REQUEST)

        dimensions = request.query_params.get('dimensions', None)
        if dimensions:
            products = products.filter(dimensions__icontains=dimensions)

        compound = request.query_params.get('compound', None)
        if compound:
            products = products.filter(compound__icontains=compound)

        color = request.query_params.get('color', None)
        if color:
            products = products.filter(basic_lighting_solution=color)

        material = request.query_params.get('material', None)
        if material:
            products = products.filter(material__icontains=material)

        package = request.query_params.get('package', None)
        if package:
            products = products.filter(package__icontains=package)

        weight = request.query_params.get('weight', None)
        if weight:
            try:
                products = products.filter(weight=int(weight))
            except ValueError:
                return Response({"error": "Invalid weight value"}, status=status.HTTP_400_BAD_REQUEST)

        weight_min = request.query_params.get('weight_min', None)
        weight_max = request.query_params.get('weight_max', None)
        if weight_min:
            try:
                products = products.filter(weight__gte=int(weight_min))
            except ValueError:
                return Response({"error": "Invalid weight_min value"}, status=status.HTTP_400_BAD_REQUEST)
        if weight_max:
            try:
                products = products.filter(weight__lte=int(weight_max))
            except ValueError:
                return Response({"error": "Invalid weight_max value"}, status=status.HTTP_400_BAD_REQUEST)

        application = request.query_params.get('application', None)
        if application:
            products = products.filter(application__icontains=application)

        description = request.query_params.get('description', None)
        if description:
            products = products.filter(description__icontains=description)

        created_at_min = request.query_params.get('created_at_min', None)
        created_at_max = request.query_params.get('created_at_max', None)
        if created_at_min:
            try:
                created_at_min_dt = parse_datetime(created_at_min)
                products = products.filter(created_at__gte=created_at_min_dt)
            except ValueError:
                return Response({"error": "Invalid created_at_min format"}, status=status.HTTP_400_BAD_REQUEST)
        if created_at_max:
            try:
                created_at_max_dt = parse_datetime(created_at_max)
                products = products.filter(created_at__lte=created_at_max_dt)
            except ValueError:
                return Response({"error": "Invalid created_at_max format"}, status=status.HTTP_400_BAD_REQUEST)

        updated_at_min = request.query_params.get('updated_at_min', None)
        updated_at_max = request.query_params.get('updated_at_max', None)
        if updated_at_min:
            try:
                updated_at_min_dt = parse_datetime(updated_at_min)
                products = products.filter(updated_at__gte=updated_at_min_dt)
            except ValueError:
                return Response({"error": "Invalid updated_at_min format"}, status=status.HTTP_400_BAD_REQUEST)
        if updated_at_max:
            try:
                updated_at_max_dt = parse_datetime(updated_at_max)
                products = products.filter(updated_at__lte=updated_at_max_dt)
            except ValueError:
                return Response({"error": "Invalid updated_at_max format"}, status=status.HTTP_400_BAD_REQUEST)

        sort_by = request.query_params.get('sort', None)
        if sort_by:
            if sort_by in ['product_name', 'package_volume', 'created_at', 'updated_at', 'throat_diameter', 'weight']:
                order = request.query_params.get('order', 'asc')
                if order == 'desc':
                    sort_by = f'-{sort_by}'
                products = products.order_by(sort_by)
            else:
                return Response({"error": "Invalid sort field"}, status=status.HTTP_400_BAD_REQUEST)

        page_size = request.query_params.get('page_size', 10)
        try:
            page_size = int(page_size)
            if page_size <= 0:
                page_size = 10
        except ValueError:
            page_size = 10

        paginator = Paginator(products, page_size)
        page = request.query_params.get('page', 1)

        try:
            page_objects = paginator.page(page)
        except PageNotAnInteger:
            page_objects = paginator.page(1)
        except EmptyPage:
            page_objects = paginator.page(paginator.num_pages)

        serializer = ProductSerializer(page_objects, many=True)
        return Response({
            "count": paginator.count,
            "total_pages": paginator.num_pages,
            "current_page": page_objects.number,
            "next": page_objects.has_next(),
            "previous": page_objects.has_previous(),
            "type_id": type_id if type_id else "All",
            "results": serializer.data
        })

    @swagger_auto_schema(
        operation_id='create_product',
        operation_summary='Создать новый продукт',
        operation_description='Создает новый продукт с указанными данными.',
        request_body=ProductSerializer,
        responses={
            201: ProductSerializer,
            400: openapi.Response('Неверные данные', openapi.Schema(type='object',
                                                                    properties={'error': {'type': 'string'},
                                                                                'details': {'type': 'object'}})),
            401: openapi.Response('Требуется аутентификация',
                                  openapi.Schema(type='object', properties={'detail': {'type': 'string'}}))
        },
        security=[{'TokenAuth': []}]
    )
    def post(self, request):
        if not request.user.is_authenticated:
            return Response({"detail": "Authentication credentials were not provided."},
                            status=status.HTTP_401_UNAUTHORIZED)
        serializer = ProductSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response({"error": "Invalid data", "details": serializer.errors},
                        status=status.HTTP_400_BAD_REQUEST)


class ProductDetailView(APIView):
    def get_object(self, pk):
        try:
            return Product.objects.get(pk=pk)
        except Product.DoesNotExist:
            raise Http404("Product not found")

    @swagger_auto_schema(
        responses={200: ProductSerializer, 404: 'Продукт не найден'}
    )
    def get(self, request, pk):
        product = self.get_object(pk)
        serializer = ProductSerializer(product)
        return Response(serializer.data)

    @swagger_auto_schema(
        request_body=ProductSerializer,
        responses={200: ProductSerializer, 400: 'Неверные данные', 401: 'Требуется аутентификация', 404: 'Не найден'}
    )
    def put(self, request, pk):
        if not request.user.is_authenticated:
            return Response({"detail": "Authentication credentials were not provided."},
                            status=status.HTTP_401_UNAUTHORIZED)
        product = self.get_object(pk)
        serializer = ProductSerializer(product, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response({"error": "Invalid data", "details": serializer.errors},
                        status=status.HTTP_400_BAD_REQUEST)

    @swagger_auto_schema(
        responses={204: 'Продукт удален', 401: 'Требуется аутентификация', 404: 'Не найден'}
    )
    def delete(self, request, pk):
        if not request.user.is_authenticated:
            return Response({"detail": "Authentication credentials were not provided."},
                            status=status.HTTP_401_UNAUTHORIZED)
        product = self.get_object(pk)
        product.delete()
        return Response({"message": "Product deleted"}, status=status.HTTP_204_NO_CONTENT)


class ProductImageListCreateView(APIView):
    @swagger_auto_schema(
        operation_id='list_product_images',
        operation_summary='Получить список изображений продукта',
        operation_description='Возвращает список изображений для указанного продукта.',
        manual_parameters=[
            openapi.Parameter('product', openapi.IN_QUERY, description="ID продукта",
                              type=openapi.TYPE_INTEGER, required=False),
        ],
        responses={
            200: ProductImageSerializer(many=True),
            401: openapi.Response('Требуется аутентификация',
                                  openapi.Schema(type='object', properties={'detail': {'type': 'string'}}))
        },
        security=[{'TokenAuth': []}]
    )
    def get(self, request):
        """Получить список изображений продуктов с фильтрацией по ID продукта."""
        product_id = request.query_params.get('product', None)
        
        if product_id:
            images = ProductImage.objects.filter(product_id=product_id)
        else:
            images = ProductImage.objects.all()
            
        serializer = ProductImageSerializer(images, many=True)
        return Response(serializer.data)

    @swagger_auto_schema(
        operation_id='create_product_image',
        operation_summary='Загрузить изображение продукта',
        operation_description='Загружает новое изображение для указанного продукта.',
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            required=['product', 'image'],
            properties={
                'product': openapi.Schema(type=openapi.TYPE_INTEGER, description='ID продукта'),
                'image': openapi.Schema(type=openapi.TYPE_FILE, description='Файл изображения'),
            }
        ),
        responses={
            201: ProductImageSerializer,
            400: openapi.Response('Неверные данные', openapi.Schema(type='object', 
                                                                 properties={'error': {'type': 'string'},
                                                                             'details': {'type': 'object'}})),
            401: openapi.Response('Требуется аутентификация',
                                  openapi.Schema(type='object', properties={'detail': {'type': 'string'}}))
        },
        security=[{'TokenAuth': []}]
    )
    def post(self, request):
        """Загрузить новое изображение для продукта."""
        if not request.user.is_authenticated:
            return Response({"detail": "Authentication credentials were not provided."},
                            status=status.HTTP_401_UNAUTHORIZED)
        
        print(f"Получен запрос на загрузку изображения: {request.data}")
        
        # Проверяем, что product_id указан и существует
        product_id = request.data.get('product')
        if not product_id:
            return Response({"error": "Product ID is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            product = Product.objects.get(pk=product_id)
        except Product.DoesNotExist:
            return Response({"error": "Product not found"}, status=status.HTTP_404_NOT_FOUND)
        
        # Проверяем, что файл изображения предоставлен
        if 'image' not in request.FILES:
            return Response({"error": "Image file is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        # Создаем сериализатор с данными
        serializer = ProductImageSerializer(data={
            'product': product_id,
            'image': request.FILES['image']
        })
        
        if serializer.is_valid():
            serializer.save(product=product)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        return Response({"error": "Invalid data", "details": serializer.errors},
                        status=status.HTTP_400_BAD_REQUEST)


class ProductImageDetailView(APIView):
    def get_object(self, pk):
        """Получить объект изображения по ID или вернуть 404."""
        try:
            return ProductImage.objects.get(pk=pk)
        except ProductImage.DoesNotExist:
            raise Http404("Product image not found")

    @swagger_auto_schema(
        operation_id='get_product_image',
        operation_summary='Получить информацию об изображении продукта',
        operation_description='Возвращает информацию о конкретном изображении продукта.',
        responses={
            200: ProductImageSerializer,
            404: 'Изображение не найдено'
        }
    )
    def get(self, request, pk):
        """Получить информацию о конкретном изображении продукта."""
        image = self.get_object(pk)
        serializer = ProductImageSerializer(image)
        return Response(serializer.data)

    @swagger_auto_schema(
        operation_id='delete_product_image',
        operation_summary='Удалить изображение продукта',
        operation_description='Удаляет указанное изображение продукта.',
        responses={
            204: 'Изображение удалено',
            401: 'Требуется аутентификация',
            404: 'Не найдено'
        },
        security=[{'TokenAuth': []}]
    )
    def delete(self, request, pk):
        """Удалить изображение продукта."""
        if not request.user.is_authenticated:
            return Response({"detail": "Authentication credentials were not provided."},
                            status=status.HTTP_401_UNAUTHORIZED)
        
        image = self.get_object(pk)
        image.delete()
        return Response({"message": "Image deleted"}, status=status.HTTP_204_NO_CONTENT)
