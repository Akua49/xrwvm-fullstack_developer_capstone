from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator

class CarMake(models.Model):
    name = models.CharField(max_length=80, unique=True)
    description = models.TextField(blank=True)
    def __str__(self):
        return self.name

class CarModel(models.Model):
    CAR_TYPES = [(x, x) for x in ('Sedan', 'SUV', 'Wagon', 'Truck', 'Coupe')]
    car_make = models.ForeignKey(CarMake, on_delete=models.CASCADE)
    name = models.CharField(max_length=80)
    type = models.CharField(max_length=12, choices=CAR_TYPES, default='Sedan')
    year = models.IntegerField(validators=[MinValueValidator(2015), MaxValueValidator(2023)])
    def __str__(self):
        return f'{self.car_make} {self.name} ({self.year})'
