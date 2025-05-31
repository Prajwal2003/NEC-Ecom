from django.shortcuts import render
from rest_framework import viewsets
from .models import (
    Product, Seller, AuctionProduct, SellingProduct, Stock, Review,
    Bid, Cart, Wishlist
)
from .serializers import (
    ProductSerializer, SellerSerializer, AuctionProductSerializer, SellingProductSerializer, StockSerializer, ReviewSerializer,
    BidSerializer, CartSerializer, WishlistSerializer
)

# Create your views here.

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

class SellerViewSet(viewsets.ModelViewSet):
    queryset = Seller.objects.all()
    serializer_class = SellerSerializer

class AuctionProductViewSet(viewsets.ModelViewSet):
    queryset = AuctionProduct.objects.all()
    serializer_class = AuctionProductSerializer

class SellingProductViewSet(viewsets.ModelViewSet):
    queryset = SellingProduct.objects.all()
    serializer_class = SellingProductSerializer

class StockViewSet(viewsets.ModelViewSet):
    queryset = Stock.objects.all()
    serializer_class = StockSerializer

class ReviewViewSet(viewsets.ModelViewSet):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer

class BidViewSet(viewsets.ModelViewSet):
    queryset = Bid.objects.all()
    serializer_class = BidSerializer

class CartViewSet(viewsets.ModelViewSet):
    queryset = Cart.objects.all()
    serializer_class = CartSerializer

class WishlistViewSet(viewsets.ModelViewSet):
    queryset = Wishlist.objects.all()
    serializer_class = WishlistSerializer
