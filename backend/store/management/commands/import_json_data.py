import json
from django.core.management.base import BaseCommand
from store.models import (
    Seller, Product, AuctionProduct, SellingProduct, Stock, Review,
    Bid, Cart, CartItem, Wishlist, WishlistItem
)
from django.utils.dateparse import parse_datetime, parse_date

class Command(BaseCommand):
    help = 'Import sellers, products, reviews, auction/selling/stock, bids, carts, wishlists from JSON files'

    def add_arguments(self, parser):
        parser.add_argument('--sellers', type=str, required=True, help='Path to sellers.json')
        parser.add_argument('--products', type=str, required=True, help='Path to products.json')
        parser.add_argument('--bids', type=str, required=False, help='Path to bids.json')
        parser.add_argument('--carts', type=str, required=False, help='Path to carts.json')
        parser.add_argument('--wishlists', type=str, required=False, help='Path to wishlist.json')

    def handle(self, *args, **options):
        sellers_path = options['sellers']
        products_path = options['products']
        bids_path = options.get('bids')
        carts_path = options.get('carts')
        wishlists_path = options.get('wishlists')

        # Import sellers
        with open(sellers_path, 'r') as f:
            sellers_data = json.load(f)
            for s in sellers_data:
                seller, created = Seller.objects.get_or_create(
                    name=s['name'],
                    defaults={
                        'verification_status': s.get('verificationStatus', ''),
                        'rating': s.get('rating', 0),
                        'shipping_time': s.get('shippingTime', ''),
                        'return_policy': s.get('returnPolicy', ''),
                        'warranty': s.get('warranty', ''),
                        'badges': s.get('badges', []),
                        'business_hours': s.get('businessHours', ''),
                        'location': s.get('location', ''),
                        'description': s.get('description', ''),
                        'customer_support': s.get('customerSupport', {}),
                    }
                )
                if created:
                    self.stdout.write(self.style.SUCCESS(f'Created seller: {seller.name}'))
                else:
                    self.stdout.write(self.style.WARNING(f'Existing seller: {seller.name}'))

        # Import products and related tables
        with open(products_path, 'r') as f:
            products_data = json.load(f)
            for p in products_data:
                seller_name = p['seller']['sellerName']
                try:
                    seller = Seller.objects.get(name=seller_name)
                except Seller.DoesNotExist:
                    self.stdout.write(self.style.ERROR(f'Seller not found for product: {p["name"]}'))
                    continue
                product, created = Product.objects.get_or_create(
                    id=p['id'],
                    defaults={
                        'name': p['name'],
                        'category': p['category'],
                        'brand': p['brand'],
                        'description': p.get('description', ''),
                        'features': p.get('features', []),
                        'faqs': p.get('faqs', []),
                        'images': p.get('images', []),
                        'image': p.get('image', ''),
                        'options': p.get('options', {}),
                        'seller': seller,
                    }
                )
                if created:
                    self.stdout.write(self.style.SUCCESS(f'Created product: {product.name}'))
                else:
                    self.stdout.write(self.style.WARNING(f'Existing product: {product.name}'))

                # Stock
                Stock.objects.update_or_create(
                    product=product,
                    defaults={
                        'in_stock': p.get('inStock', True),
                        'quantity': None
                    }
                )

                # AuctionProduct or SellingProduct
                if p.get('isAuction', False):
                    auction = p.get('auctionDetails', {})
                    AuctionProduct.objects.update_or_create(
                        product=product,
                        defaults={
                            'current_bid': auction.get('currentBid', 0),
                            'minimum_bid': auction.get('minimumBid', 0),
                            'bids_count': auction.get('bids', 0),
                            'time_left': auction.get('timeLeft', ''),
                            'bidders': auction.get('bidders', []),
                            'is_active': True,
                            'end_date': None
                        }
                    )
                else:
                    SellingProduct.objects.update_or_create(
                        product=product,
                        defaults={
                            'price': p.get('price', 0)
                        }
                    )

                # Reviews
                for r in p.get('reviews', []):
                    Review.objects.update_or_create(
                        product=product,
                        user_name=r.get('userName', ''),
                        defaults={
                            'rating': r.get('rating', 0),
                            'date': parse_date(r.get('date')) if r.get('date') else None,
                            'title': r.get('title', ''),
                            'comment': r.get('comment', ''),
                            'verified': r.get('verified', False)
                        }
                    )

        # Import bids
        if bids_path:
            with open(bids_path, 'r') as f:
                bids_data = json.load(f)
                for b in bids_data.get('bids', []):
                    try:
                        product = Product.objects.get(id=b['productId'])
                    except Product.DoesNotExist:
                        self.stdout.write(self.style.ERROR(f'Product not found for bid: {b.get("productName", "?")}'))
                        continue
                    Bid.objects.get_or_create(
                        product=product,
                        current_bid=b.get('currentBid', 0),
                        your_bid=b.get('yourBid', 0),
                        time_left=b.get('timeLeft', ''),
                        status=b.get('status', ''),
                        bids_count=b.get('bids', 0),
                        end_date=parse_datetime(b.get('endDate')) if b.get('endDate') else None,
                        is_active=b.get('isActive', True),
                    )
                self.stdout.write(self.style.SUCCESS('Imported bids.'))

        # Import carts
        if carts_path:
            with open(carts_path, 'r') as f:
                carts_data = json.load(f)
                for c in carts_data.get('carts', []):
                    cart, _ = Cart.objects.get_or_create(name=c['name'])
                    for item in c.get('items', []):
                        try:
                            product = Product.objects.get(id=item['id'])
                        except Product.DoesNotExist:
                            self.stdout.write(self.style.ERROR(f'Product not found for cart item: {item["id"]}'))
                            continue
                        CartItem.objects.get_or_create(
                            cart=cart,
                            product=product,
                            defaults={
                                'quantity': item.get('quantity', 1),
                                'selected_options': item.get('selectedOptions', {}),
                            }
                        )
                self.stdout.write(self.style.SUCCESS('Imported carts.'))

        # Import wishlists
        if wishlists_path:
            with open(wishlists_path, 'r') as f:
                wishlists_data = json.load(f)
                for wname, items in wishlists_data.items():
                    wishlist, _ = Wishlist.objects.get_or_create(name=wname)
                    for item in items:
                        try:
                            product_id = int(item['id'])
                            product = Product.objects.get(id=product_id)
                        except (Product.DoesNotExist, ValueError, TypeError):
                            self.stdout.write(self.style.ERROR(f'Product not found for wishlist item: {item.get("id")}'))
                            continue
                        WishlistItem.objects.get_or_create(
                            wishlist=wishlist,
                            product=product,
                            defaults={
                                'selected_options': item.get('selectedOptions', {}),
                            }
                        )
                self.stdout.write(self.style.SUCCESS('Imported wishlists.')) 