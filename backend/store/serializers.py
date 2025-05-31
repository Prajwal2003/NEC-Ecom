from rest_framework import serializers
from .models import (
    Product, Seller, AuctionProduct, SellingProduct, Stock, Review,
    Bid, Cart, CartItem, Wishlist, WishlistItem
)

class SellerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Seller
        fields = '__all__'

class AuctionProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = AuctionProduct
        fields = '__all__'

class SellingProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = SellingProduct
        fields = '__all__'

class StockSerializer(serializers.ModelSerializer):
    class Meta:
        model = Stock
        fields = '__all__'

class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = '__all__'

class ProductSerializer(serializers.ModelSerializer):
    seller = SellerSerializer(read_only=True)
    auction = AuctionProductSerializer(read_only=True)
    selling = SellingProductSerializer(read_only=True)
    stock = StockSerializer(read_only=True)
    reviews = ReviewSerializer(many=True, read_only=True)

    class Meta:
        model = Product
        fields = '__all__'

class BidSerializer(serializers.ModelSerializer):
    productName = serializers.CharField(source='product.name', read_only=True)
    productImage = serializers.CharField(source='product.image', read_only=True)

    class Meta:
        model = Bid
        fields = ['id', 'product', 'productName', 'productImage', 'current_bid', 'your_bid', 'time_left', 'status', 'bids_count', 'end_date', 'is_active']

class CartItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = CartItem
        fields = ['product', 'quantity', 'selected_options']

class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)

    class Meta:
        model = Cart
        fields = ['id', 'name', 'items']

class WishlistItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = WishlistItem
        fields = ['product', 'selected_options']

class WishlistSerializer(serializers.ModelSerializer):
    items = WishlistItemSerializer(many=True, read_only=True)

    class Meta:
        model = Wishlist
        fields = ['id', 'name', 'items'] 