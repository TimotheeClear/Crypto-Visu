from rest_framework import serializers
from .models import Hero  # assuming Hero is the model you want to serialize

class HeroSerializer(serializers.ModelSerializer):
    class Meta:
        model = Hero
        fields = '__all__'  # use all fields of the Hero model in the serializer
