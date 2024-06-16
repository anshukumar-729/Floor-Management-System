from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.permissions import IsAuthenticated
from .serializers import UserSerializer
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import generics, status
from django.contrib.auth import authenticate 
from rest_framework.decorators import api_view
from django.db.models import Q

class Home(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    def get(self, request):
        return JsonResponse({"data":"success"})
    
class RegisterUser(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        username = serializer.data['username']
        user = User.objects.get(username=username)

        refresh = RefreshToken.for_user(user)

        return JsonResponse({
            "message": "Successfully Registered",
            "payload": serializer.data,
            "refresh": str(refresh),
            "access": str(refresh.access_token),
        })


class LoginUser(APIView):
    def post(self, request):
        username = request.data.get('username')
        password = str(request.data.get('password'))

        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            return JsonResponse({"error": "Invalid username or password"}, status=400)

        # Perform custom password validation
        if user.password != password:
            return JsonResponse({"error": "Invalid username or password"}, status=400)

        # If you need to perform additional checks before generating tokens,
        # you can do that here

        refresh = RefreshToken.for_user(user)

        return JsonResponse({
            "message": "Login successful",
            "refresh": str(refresh),
            "access": str(refresh.access_token),
        })

        

        


# views.py

from .models import FloorPlan, FloorPlanVersion, MeetingRoom, BookingRequest
from .serializers import FloorPlanSerializer, FloorPlanVersionSerializer, MeetingRoomSerializer, BookingRequestSerializer

class FloorPlanListCreateAPIView(generics.ListCreateAPIView):
    queryset = FloorPlan.objects.all()
    serializer_class = FloorPlanSerializer

class FloorPlanRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = FloorPlan.objects.all()
    serializer_class = FloorPlanSerializer

class FloorPlanVersionListCreateAPIView(generics.ListCreateAPIView):
    queryset = FloorPlanVersion.objects.all()
    serializer_class = FloorPlanVersionSerializer

class MeetingRoomListCreateAPIView(generics.ListCreateAPIView):
    queryset = MeetingRoom.objects.all()
    serializer_class = MeetingRoomSerializer

    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return JsonResponse(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def delete(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return JsonResponse({"message": "Meeting room deleted successfully."}, status=status.HTTP_204_NO_CONTENT)

class MeetingRoomRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = MeetingRoom.objects.all()
    serializer_class = MeetingRoomSerializer


class BookingRequestListCreateAPIView(generics.ListCreateAPIView):
    queryset = BookingRequest.objects.all()
    serializer_class = BookingRequestSerializer

    def get_queryset(self):
        user = self.request.GET.get("requested_by")
        if user:
            return BookingRequest.objects.filter(requested_by=user)
        else:
            return BookingRequest.objects.all()
    
    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return JsonResponse(serializer.data, status=status.HTTP_201_CREATED)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        data = request.data.copy()

        # Mark the room as unavailable and update other fields
        if 'booked_room' in data:
            room_name = data['booked_room']
            try:
                room = MeetingRoom.objects.get(name=room_name)
                room.available = False
                room.number_of_people = instance.number_of_people
                room.booked_by = instance.requested_by
                room.in_time = instance.in_time
                room.out_time = instance.out_time
                room.save()
            except MeetingRoom.DoesNotExist:
                return JsonResponse({"detail": "Meeting room not found."}, status=status.HTTP_400_BAD_REQUEST)

        serializer = self.get_serializer(instance, data=data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        return JsonResponse(serializer.data)

class BookingRequestRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = BookingRequest.objects.all()
    serializer_class = BookingRequestSerializer

class SyncFloorPlanVersionsAPIView(generics.ListCreateAPIView):
    queryset = FloorPlanVersion.objects.all()
    serializer_class = FloorPlanVersionSerializer

    def create(self, request, *args, **kwargs):
        # Logic for conflict resolution and versioning
        # Example: Check if new version conflicts with existing, handle timestamps, etc.
        # Create new version if necessary
        return super().create(request, *args, **kwargs)
    
@api_view(['POST'])
def allocate_all_rooms(request):
    try:
        booking_requests = BookingRequest.objects.filter(processed=False)
        
        # Get all room names that are already allocated
        
        for request in booking_requests:
            requested_in_time = request.in_time
            requested_out_time = request.out_time
            available_rooms = MeetingRoom.objects.all().order_by('capacity')
            print(available_rooms)
            for room in available_rooms:
                if (room.available 
                # or (
                #     room.in_time is None or room.out_time is None or
                #     requested_out_time <= room.in_time or requested_in_time >= room.out_time
                # )
                ):
                    if room.capacity >= request.number_of_people:
                        room.available = False
                        room.booked_by = request.requested_by
                        room.number_of_people = request.number_of_people
                        room.in_time = requested_in_time
                        room.out_time = requested_out_time
                        room.save()
                        
                        request.processed = True
                        request.booked_room = room.name
                        request.save()
                        break  # Allocate only one room per request
        
        return JsonResponse({'message': 'All rooms allocated successfully.'})
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)