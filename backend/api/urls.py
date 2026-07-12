from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework.routers import DefaultRouter
from .views import RegisterView, InspectionViewSet, FaultViewSet, ReportViewSet, PanelViewSet, NotificationViewSet, dashboard_summary, generate_report, fault_map_data

router = DefaultRouter()
router.register(r'inspections', InspectionViewSet)
router.register(r'faults', FaultViewSet)
router.register(r'reports', ReportViewSet)
router.register(r'panels', PanelViewSet)
router.register(r'notifications', NotificationViewSet)


urlpatterns = [
    # Auth endpoints
    path('auth/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/login/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/register/', RegisterView.as_view(), name='auth_register'),
    
    # Dashboard and custom endpoints
    path('dashboard/summary/', dashboard_summary, name='dashboard_summary'),
    path('dashboard/map/', fault_map_data, name='fault-map-data'),
    path('reports/generate/', generate_report, name='generate_report'),
    
    # Router URLs
    path('', include(router.urls)),
]
