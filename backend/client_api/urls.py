
from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

from .views import (
    Home, RegisterUser, LoginUser, FloorPlanListCreateAPIView, FloorPlanRetrieveUpdateDestroyAPIView, FloorPlanVersionListCreateAPIView,BookingRequestListCreateAPIView,
    MeetingRoomListCreateAPIView, MeetingRoomRetrieveUpdateDestroyAPIView, BookingRequestRetrieveUpdateDestroyAPIView, allocate_all_rooms
)
urlpatterns = [
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/home/', Home.as_view(), name='home'),
    path('api/register/', RegisterUser.as_view(), name='register'),
    path('api/login/', LoginUser.as_view(), name='login'),
    path('api/floor-plans/', FloorPlanListCreateAPIView.as_view(), name='floor-plan-list-create'),
    path('api/floor-plans/<int:pk>/', FloorPlanRetrieveUpdateDestroyAPIView.as_view(), name='floor-plan-retrieve-update-destroy'),
    path('api/floor-plan-versions/', FloorPlanVersionListCreateAPIView.as_view(), name='floor-plan-version-list-create'),
    path('api/meeting-rooms/', MeetingRoomListCreateAPIView.as_view(), name='meeting-room-list-create'),
    path('api/meeting-rooms/<int:pk>/', MeetingRoomRetrieveUpdateDestroyAPIView.as_view(), name='meeting-room-retrieve-update-destroy'),
    path('api/booking-requests/', BookingRequestListCreateAPIView.as_view(), name='meeting-room-list-create'),
    path('api/booking-requests/<int:pk>/', BookingRequestRetrieveUpdateDestroyAPIView.as_view(), name='meeting-room-retrieve-update-destroy'),
    path('api/allocate-all-rooms/', allocate_all_rooms , name='allocate_all_rooms'),
]