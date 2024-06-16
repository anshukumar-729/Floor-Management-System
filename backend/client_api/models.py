from django.db import models

# Create your models here.
from django.conf import settings
from django.db.models.signals import post_save
from django.dispatch import receiver
from rest_framework.authtoken.models import Token

@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def create_auth_token(sender, instance=None, created=False, **kwargs):
    if created:
        Token.objects.create(user=instance)


class FloorPlan(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

class FloorPlanVersion(models.Model):
    floor_plan = models.ForeignKey(FloorPlan, on_delete=models.CASCADE, related_name='versions')
    layout = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Version {self.id} of {self.floor_plan.name}"
    
from django.contrib.auth.models import User
import datetime

from django.db import models
import datetime

class MeetingRoom(models.Model):
    name = models.CharField(primary_key=True, max_length=100)  # Ensure unique names for rooms
    capacity = models.IntegerField(default=0)
    floor = models.IntegerField(default=0)
    available = models.BooleanField(default=True)
    number_of_people = models.IntegerField(default=0)
    booked_by = models.CharField(max_length=100, blank=True)
    in_time = models.DateTimeField(null=True, blank=True)  # Allow null values
    out_time = models.DateTimeField(null=True, blank=True)  # Allow null values

    def __str__(self):
        return self.name


class BookingRequest(models.Model):
    requested_by = models.CharField(default="admin", max_length=100)
    number_of_people = models.IntegerField(default=0)
    in_time = models.DateTimeField(default=datetime.datetime.now)
    out_time = models.DateTimeField(default=datetime.datetime.now)
    processed = models.BooleanField(default=False)  
    booked_room = models.CharField(max_length=100, blank=True, null=True)

    def __str__(self):
        return f"Booking by {self.requested_by} for {self.number_of_people} people"
