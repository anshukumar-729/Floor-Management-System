from django.contrib.auth.models import User
from rest_framework import serializers
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'password']

# serializers.py

from .models import FloorPlan, FloorPlanVersion, MeetingRoom, BookingRequest

class FloorPlanSerializer(serializers.ModelSerializer):
    class Meta:
        model = FloorPlan
        fields = '__all__'

class FloorPlanVersionSerializer(serializers.ModelSerializer):
    class Meta:
        model = FloorPlanVersion
        fields = '__all__'

class MeetingRoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = MeetingRoom
        fields = '__all__'

class BookingRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = BookingRequest
        fields = '__all__'
