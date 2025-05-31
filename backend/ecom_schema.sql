-- ecom_schema.sql: Normalized DDL for e-commerce backend

CREATE TABLE store_seller (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    verification_status VARCHAR(50) NOT NULL,
    rating DOUBLE PRECISION NOT NULL,
    shipping_time VARCHAR(255) NOT NULL,
    return_policy VARCHAR(255) NOT NULL,
    warranty VARCHAR(255) NOT NULL,
    badges JSONB NOT NULL,
    business_hours VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    customer_support JSONB NOT NULL
);

CREATE TABLE store_product (
    id INTEGER PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    brand VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    features JSONB NOT NULL,
    faqs JSONB NOT NULL,
    images JSONB NOT NULL,
    image VARCHAR(500),
    options JSONB NOT NULL,
    seller_id INTEGER NOT NULL REFERENCES store_seller(id) ON DELETE CASCADE
);

CREATE TABLE store_auctionproduct (
    id SERIAL PRIMARY KEY,
    product_id INTEGER NOT NULL UNIQUE REFERENCES store_product(id) ON DELETE CASCADE,
    current_bid NUMERIC(12, 2) NOT NULL,
    minimum_bid NUMERIC(12, 2) NOT NULL,
    bids_count INTEGER NOT NULL,
    time_left VARCHAR(100) NOT NULL,
    bidders JSONB NOT NULL,
    is_active BOOLEAN NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE
);

CREATE TABLE store_sellingproduct (
    id SERIAL PRIMARY KEY,
    product_id INTEGER NOT NULL UNIQUE REFERENCES store_product(id) ON DELETE CASCADE,
    price NUMERIC(12, 2) NOT NULL
);

CREATE TABLE store_stock (
    id SERIAL PRIMARY KEY,
    product_id INTEGER NOT NULL UNIQUE REFERENCES store_product(id) ON DELETE CASCADE,
    in_stock BOOLEAN NOT NULL,
    quantity INTEGER
);

CREATE TABLE store_review (
    id SERIAL PRIMARY KEY,
    product_id INTEGER NOT NULL REFERENCES store_product(id) ON DELETE CASCADE,
    user_name VARCHAR(255) NOT NULL,
    rating INTEGER NOT NULL,
    date DATE NOT NULL,
    title VARCHAR(255),
    comment TEXT,
    verified BOOLEAN NOT NULL
);

CREATE TABLE store_bid (
    id SERIAL PRIMARY KEY,
    product_id INTEGER NOT NULL REFERENCES store_product(id) ON DELETE CASCADE,
    current_bid NUMERIC(12, 2) NOT NULL,
    your_bid NUMERIC(12, 2) NOT NULL,
    time_left VARCHAR(100) NOT NULL,
    status VARCHAR(50) NOT NULL,
    bids_count INTEGER NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN NOT NULL
);

CREATE TABLE store_cart (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

CREATE TABLE store_cartitem (
    id SERIAL PRIMARY KEY,
    cart_id INTEGER NOT NULL REFERENCES store_cart(id) ON DELETE CASCADE,
    product_id INTEGER NOT NULL REFERENCES store_product(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL,
    selected_options JSONB NOT NULL
);

CREATE TABLE store_wishlist (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

CREATE TABLE store_wishlistitem (
    id SERIAL PRIMARY KEY,
    wishlist_id INTEGER NOT NULL REFERENCES store_wishlist(id) ON DELETE CASCADE,
    product_id INTEGER NOT NULL REFERENCES store_product(id) ON DELETE CASCADE,
    selected_options JSONB NOT NULL
); 