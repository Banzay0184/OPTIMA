# Generated by Django 5.1.6 on 2025-03-03 23:41

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0015_productcolor_remove_product_colors_product_colors'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='productcolor',
            name='name',
        ),
    ]
