from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ProductViewSet, SellerViewSet, AuctionProductViewSet, SellingProductViewSet, StockViewSet, ReviewViewSet,
    BidViewSet, CartViewSet, WishlistViewSet
)

router = DefaultRouter()
router.register(r'products', ProductViewSet, basename='product')
router.register(r'sellers', SellerViewSet, basename='seller')
router.register(r'auction-products', AuctionProductViewSet, basename='auctionproduct')
router.register(r'selling-products', SellingProductViewSet, basename='sellingproduct')
router.register(r'stock', StockViewSet, basename='stock')
router.register(r'reviews', ReviewViewSet, basename='review')
router.register(r'bids', BidViewSet, basename='bid')
router.register(r'carts', CartViewSet, basename='cart')
router.register(r'wishlists', WishlistViewSet, basename='wishlist')

urlpatterns = [
    path('', include(router.urls)),
] 