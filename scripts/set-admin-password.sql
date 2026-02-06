-- Run this against a Postgres database to set the admin user's password hash

UPDATE users
SET password_hash = '$2b$10$SsU3rxUD3GAkirXXQplyLuBLsEdrXouUatMuWLAWQlRq7pplXMOM6'
WHERE username = 'admin';
