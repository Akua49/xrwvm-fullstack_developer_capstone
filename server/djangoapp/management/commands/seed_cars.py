import json
from pathlib import Path
from django.core.management.base import BaseCommand
from django.conf import settings
from djangoapp.models import CarMake, CarModel

class Command(BaseCommand):
    help = 'Load the supplied car catalogue without deleting existing data.'
    def handle(self, *args, **options):
        source = json.loads((Path(settings.BASE_DIR) / 'database/data/car_records.json').read_text())
        records = source if isinstance(source, list) else next(iter(source.values()))
        for row in records:
            make_name = row.get('car_make', row.get('CarMake', row.get('make')))
            model_name = row.get('car_model', row.get('CarModel', row.get('model')))
            if not make_name or not model_name:
                continue
            make, _ = CarMake.objects.get_or_create(name=make_name)
            CarModel.objects.get_or_create(car_make=make, name=model_name,
                year=int(row.get('car_year', row.get('year', 2023))), defaults={'type': 'Sedan'})
        self.stdout.write(self.style.SUCCESS(f'{CarMake.objects.count()} makes, {CarModel.objects.count()} models'))
