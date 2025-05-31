from django.db import models

class Seller(models.Model):
    name = models.CharField(max_length=255, unique=True)
    verification_status = models.CharField(max_length=50)
    rating = models.FloatField()
    shipping_time = models.CharField(max_length=255)
    return_policy = models.CharField(max_length=255)
    warranty = models.CharField(max_length=255)
    badges = models.JSONField(default=list)
    business_hours = models.CharField(max_length=255)
    location = models.CharField(max_length=255)
    description = models.TextField()
    customer_support = models.JSONField(default=dict)

    def __str__(self):
        return self.name

class Product(models.Model):
    id = models.IntegerField(primary_key=True)
    name = models.CharField(max_length=255)
    category = models.CharField(max_length=100)
    brand = models.CharField(max_length=100)
    description = models.TextField()
    features = models.JSONField(default=list)
    faqs = models.JSONField(default=list)
    images = models.JSONField(default=list)
    image = models.CharField(max_length=500, blank=True, null=True)
    options = models.JSONField(default=dict)
    seller = models.ForeignKey(Seller, on_delete=models.CASCADE, related_name='products')

    def __str__(self):
        return self.name

class AuctionProduct(models.Model):
    product = models.OneToOneField(Product, on_delete=models.CASCADE, related_name='auction')
    current_bid = models.DecimalField(max_digits=12, decimal_places=2)
    minimum_bid = models.DecimalField(max_digits=12, decimal_places=2)
    bids_count = models.IntegerField()
    time_left = models.CharField(max_length=100)
    bidders = models.JSONField(default=list)
    is_active = models.BooleanField(default=True)
    end_date = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"Auction for {self.product.name}"

class SellingProduct(models.Model):
    product = models.OneToOneField(Product, on_delete=models.CASCADE, related_name='selling')
    price = models.DecimalField(max_digits=12, decimal_places=2)

    def __str__(self):
        return f"Selling {self.product.name}"

class Stock(models.Model):
    product = models.OneToOneField(Product, on_delete=models.CASCADE, related_name='stock')
    in_stock = models.BooleanField(default=True)
    quantity = models.IntegerField(null=True, blank=True)

    def __str__(self):
        return f"Stock for {self.product.name}"

class Review(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='reviews')
    user_name = models.CharField(max_length=255)
    rating = models.IntegerField()
    date = models.DateField()
    title = models.CharField(max_length=255, blank=True, null=True)
    comment = models.TextField(blank=True, null=True)
    verified = models.BooleanField(default=False)

    def __str__(self):
        return f"Review by {self.user_name} for {self.product.name}"

class Bid(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='bids')
    current_bid = models.DecimalField(max_digits=12, decimal_places=2)
    your_bid = models.DecimalField(max_digits=12, decimal_places=2)
    time_left = models.CharField(max_length=100)
    status = models.CharField(max_length=50)
    bids_count = models.IntegerField()
    end_date = models.DateTimeField(null=True, blank=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"Bid {self.id} on {self.product.name}"

class Cart(models.Model):
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name

class CartItem(models.Model):
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.IntegerField(default=1)
    selected_options = models.JSONField(default=dict)

    def __str__(self):
        return f"{self.quantity}x {self.product.name} in {self.cart.name}"

class Wishlist(models.Model):
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name

class WishlistItem(models.Model):
    wishlist = models.ForeignKey(Wishlist, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    selected_options = models.JSONField(default=dict)

    def __str__(self):
        return f"{self.product.name} in {self.wishlist.name}" 