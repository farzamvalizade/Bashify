# Generated by Django 4.2.16 on 2024-09-18 09:49

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('account', '0001_initial'),
    ]

    operations = [
        migrations.RenameField(
            model_name='command',
            old_name='command_name',
            new_name='command',
        ),
        migrations.RenameField(
            model_name='command',
            old_name='command_output',
            new_name='output',
        ),
    ]
