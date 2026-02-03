-- =============================================================================
-- INSERT NEW USER INTO DATABASE
-- Execute this query to add a test user
-- =============================================================================

-- Insert a test user with phone number
INSERT INTO "user" (
    phone_number,
    email,
    password_hash,
    first_name,
    last_name,
    role,
    status,
    email_verified,
    phone_verified
)
VALUES (
    '+6281234567890',                                    -- Indonesian phone number
    'testuser@lakoo.id',                                 -- Email
    '$2b$10$rZ4Qx7QZ7QZ7QZ7QZ7QZ7e1234567890abcdef',    -- Hashed password (example)
    'Test',                                              -- First name
    'User',                                              -- Last name
    'buyer',                                             -- Role: buyer, seller, admin, etc.
    'active',                                            -- Status: active
    true,                                                -- Email verified
    true                                                 -- Phone verified
)
RETURNING id, email, phone_number, first_name, last_name, role, status, created_at;


-- =============================================================================
-- MORE EXAMPLE INSERTS
-- =============================================================================

-- Insert a buyer user
INSERT INTO "user" (phone_number, email, password_hash, first_name, last_name, role, status, phone_verified)
VALUES ('+6281111111111', 'buyer1@lakoo.id', '$2b$10$hashedPassword', 'Siti', 'Nurhaliza', 'buyer', 'active', true)
RETURNING id, email, first_name, last_name, role;

-- Insert a seller user
INSERT INTO "user" (phone_number, email, password_hash, first_name, last_name, role, status, phone_verified)
VALUES ('+6282222222222', 'seller1@lakoo.id', '$2b$10$hashedPassword', 'Rani', 'Fashion', 'seller', 'active', true)
RETURNING id, email, first_name, last_name, role;

-- Insert an admin user
INSERT INTO "user" (phone_number, email, password_hash, first_name, last_name, role, status, phone_verified, email_verified)
VALUES ('+6283333333333', 'admin@lakoo.id', '$2b$10$hashedPassword', 'Admin', 'LAKOO', 'admin', 'active', true, true)
RETURNING id, email, first_name, last_name, role;

-- Insert user with minimal fields (phone only)
INSERT INTO "user" (phone_number, role, status)
VALUES ('+6284444444444', 'buyer', 'pending_verification')
RETURNING id, phone_number, role, status, created_at;
