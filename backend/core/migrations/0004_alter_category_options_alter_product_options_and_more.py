# Generated by Django 5.1.6 on 2025-02-19 15:12

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0003_alter_product_product_name'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='category',
            options={'verbose_name_plural': 'Категории'},
        ),
        migrations.AlterModelOptions(
            name='product',
            options={'verbose_name_plural': 'Продукты'},
        ),
        migrations.AlterModelOptions(
            name='type',
            options={'verbose_name_plural': 'Типы'},
        ),
    ]
