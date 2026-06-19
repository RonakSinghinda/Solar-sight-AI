from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('models', '0001_initial'),
    ]

    operations = [
        migrations.AddIndex(
            model_name='image',
            index=models.Index(fields=['gps_lat', 'gps_lon'], name='image_gps_idx'),
        ),
    ]
