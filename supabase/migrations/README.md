# Supabase Migrations

This directory contains SQL migrations for setting up the Oasis Resort database schema.

## Migration Files

1. `20240101000001_create_profiles_table.sql` - Creates the profiles table with RLS policies
2. `20240101000002_create_user_roles_table.sql` - Creates the user_roles table with RLS policies
3. `20240101000003_create_has_role_function.sql` - Creates the has_role() function for role checking
4. `20240101000004_create_profile_trigger.sql` - Creates trigger to auto-create profiles on user signup
5. `20240101000005_create_guest_role_trigger.sql` - Creates trigger to auto-assign guest role

## How to Run Migrations

### Option 1: Using Supabase CLI (Recommended)

If you have the Supabase CLI installed:

```bash
# Install Supabase CLI if you haven't already
bun add -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref YOUR_PROJECT_REF

# Run migrations
supabase db push
```

### Option 2: Using Supabase Dashboard

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Run each migration file in order (from 01 to 05)

### Option 3: Using psql (if you have direct database access)

```bash
# Run each migration file in order
psql -h YOUR_DB_HOST -U postgres -d postgres -f supabase/migrations/20240101000001_create_profiles_table.sql
psql -h YOUR_DB_HOST -U postgres -d postgres -f supabase/migrations/20240101000002_create_user_roles_table.sql
psql -h YOUR_DB_HOST -U postgres -d postgres -f supabase/migrations/20240101000003_create_has_role_function.sql
psql -h YOUR_DB_HOST -U postgres -d postgres -f supabase/migrations/20240101000004_create_profile_trigger.sql
psql -h YOUR_DB_HOST -U postgres -d postgres -f supabase/migrations/20240101000005_create_guest_role_trigger.sql
```

## What These Migrations Do

1. **Profiles Table**: Stores user profile information linked to Supabase auth users
2. **User Roles Table**: Manages user roles (admin, staff, guest) with proper constraints
3. **Has Role Function**: Provides a secure way to check if a user has a specific role
4. **Auto-Profile Trigger**: Automatically creates a profile when a new user signs up
5. **Auto-Guest Role Trigger**: Automatically assigns 'guest' role to new users

## Security Features

- Row Level Security (RLS) is enabled on all tables
- Users can only view/modify their own profiles
- Admins have full access to manage all users and roles
- Functions are created with SECURITY DEFINER for proper permission handling

## After Migration

Once migrations are complete:

1. New user registrations will automatically create profiles and assign guest roles
2. The AdminSetup component will be able to read and manage user roles
3. The UserRoleManagement component will work properly
4. Your auth system will be fully integrated with the role-based access control
