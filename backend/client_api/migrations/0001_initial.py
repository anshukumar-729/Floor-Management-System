# Generated by Django 5.0.6 on 2024-06-16 10:01

import datetime
import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name="BookingRequest",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("requested_by", models.CharField(default="admin", max_length=100)),
                ("number_of_people", models.IntegerField(default=0)),
                ("in_time", models.DateTimeField(default=datetime.datetime.now)),
                ("out_time", models.DateTimeField(default=datetime.datetime.now)),
                ("processed", models.BooleanField(default=False)),
                (
                    "booked_room",
                    models.CharField(blank=True, max_length=100, null=True),
                ),
            ],
        ),
        migrations.CreateModel(
            name="FloorPlan",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("name", models.CharField(max_length=100)),
                ("description", models.TextField(blank=True)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
            ],
        ),
        migrations.CreateModel(
            name="MeetingRoom",
            fields=[
                (
                    "name",
                    models.CharField(max_length=100, primary_key=True, serialize=False),
                ),
                ("capacity", models.IntegerField(default=0)),
                ("floor", models.IntegerField(default=0)),
                ("available", models.BooleanField(default=True)),
                ("number_of_people", models.IntegerField(default=0)),
                ("booked_by", models.CharField(blank=True, max_length=100)),
                ("in_time", models.DateTimeField(blank=True, null=True)),
                ("out_time", models.DateTimeField(blank=True, null=True)),
            ],
        ),
        migrations.CreateModel(
            name="FloorPlanVersion",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("layout", models.TextField()),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                (
                    "floor_plan",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="versions",
                        to="client_api.floorplan",
                    ),
                ),
            ],
        ),
    ]