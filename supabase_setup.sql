-- TIDElabs OS Database Setup
-- Execute these commands in your Supabase SQL Editor

-- Enable Row Level Security
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret';

-- Create user profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    wallet_address TEXT UNIQUE NOT NULL,
    username TEXT,
    role TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user points table (Airdrop Ready)
CREATE TABLE IF NOT EXISTS user_points (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    wallet_address TEXT UNIQUE NOT NULL REFERENCES user_profiles(wallet_address),
    points_balance INTEGER DEFAULT 0,
    referral_code TEXT UNIQUE NOT NULL,
    airdrop_status TEXT DEFAULT 'eligible',
    referred_by TEXT REFERENCES user_points(referral_code),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create NAKAMA status table for MSN Chat
CREATE TABLE IF NOT EXISTS nakama_status (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    wallet_address TEXT NOT NULL REFERENCES user_profiles(wallet_address),
    username TEXT NOT NULL,
    status TEXT DEFAULT 'En el Galeón',
    status_message TEXT,
    last_seen TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_online BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create NAKAMA messages table for MSN Chat
CREATE TABLE IF NOT EXISTS nakama_messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    sender_wallet TEXT NOT NULL REFERENCES user_profiles(wallet_address),
    sender_username TEXT NOT NULL,
    message TEXT NOT NULL,
    message_type TEXT DEFAULT 'text' CHECK (message_type IN ('text', 'buzz')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create crowdfund contributions table
CREATE TABLE IF NOT EXISTS crowdfund_contributions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    wallet_address TEXT NOT NULL REFERENCES user_profiles(wallet_address),
    amount DECIMAL(18, 8) NOT NULL,
    crypto_type TEXT NOT NULL,
    transaction_hash TEXT,
    airdrop_guaranteed INTEGER DEFAULT 5,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create arcade suggestions table
CREATE TABLE IF NOT EXISTS arcade_suggestions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    wallet_address TEXT NOT NULL REFERENCES user_profiles(wallet_address),
    username TEXT NOT NULL,
    suggestion_title TEXT NOT NULL,
    suggestion_url TEXT NOT NULL,
    suggestion_description TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create waitlist entries table
CREATE TABLE IF NOT EXISTS waitlist_entries (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    wallet_address TEXT REFERENCES user_profiles(wallet_address),
    email TEXT,
    username TEXT NOT NULL,
    selected_role TEXT NOT NULL,
    referral_code TEXT REFERENCES user_points(referral_code),
    referred_by TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_points_wallet ON user_points(wallet_address);
CREATE INDEX IF NOT EXISTS idx_user_points_referral ON user_points(referral_code);
CREATE INDEX IF NOT EXISTS idx_nakama_status_wallet ON nakama_status(wallet_address);
CREATE INDEX IF NOT EXISTS idx_nakama_messages_sender ON nakama_messages(sender_wallet);
CREATE INDEX IF NOT EXISTS idx_nakama_messages_created ON nakama_messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_crowdfund_wallet ON crowdfund_contributions(wallet_address);
CREATE INDEX IF NOT EXISTS idx_arcade_suggestions_status ON arcade_suggestions(status);
CREATE INDEX IF NOT EXISTS idx_waitlist_referral ON waitlist_entries(referral_code);

-- Enable Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE nakama_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE nakama_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE crowdfund_contributions ENABLE ROW LEVEL SECURITY;
ALTER TABLE arcade_suggestions ENABLE ROW LEVEL SECURITY;
ALTER TABLE waitlist_entries ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- User profiles: Users can read all profiles, but only update their own
CREATE POLICY "Users can view all profiles" ON user_profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON user_profiles FOR UPDATE USING (auth.jwt() ->> 'wallet_address' = wallet_address);
CREATE POLICY "Users can insert own profile" ON user_profiles FOR INSERT WITH CHECK (auth.jwt() ->> 'wallet_address' = wallet_address);

-- User points: Users can read all points, but only update their own
CREATE POLICY "Users can view all points" ON user_points FOR SELECT USING (true);
CREATE POLICY "Users can update own points" ON user_points FOR UPDATE USING (auth.jwt() ->> 'wallet_address' = wallet_address);
CREATE POLICY "Users can insert own points" ON user_points FOR INSERT WITH CHECK (auth.jwt() ->> 'wallet_address' = wallet_address);

-- NAKAMA status: Users can read all status, but only update their own
CREATE POLICY "Users can view all status" ON nakama_status FOR SELECT USING (true);
CREATE POLICY "Users can update own status" ON nakama_status FOR UPDATE USING (auth.jwt() ->> 'wallet_address' = wallet_address);
CREATE POLICY "Users can insert own status" ON nakama_status FOR INSERT WITH CHECK (auth.jwt() ->> 'wallet_address' = wallet_address);

-- NAKAMA messages: Users can read all messages and insert their own
CREATE POLICY "Users can view all messages" ON nakama_messages FOR SELECT USING (true);
CREATE POLICY "Users can insert own messages" ON nakama_messages FOR INSERT WITH CHECK (auth.jwt() ->> 'wallet_address' = sender_wallet);

-- Crowdfund contributions: Users can read all contributions and insert their own
CREATE POLICY "Users can view all contributions" ON crowdfund_contributions FOR SELECT USING (true);
CREATE POLICY "Users can insert own contributions" ON crowdfund_contributions FOR INSERT WITH CHECK (auth.jwt() ->> 'wallet_address' = wallet_address);

-- Arcade suggestions: Users can read approved suggestions and insert their own
CREATE POLICY "Users can view approved suggestions" ON arcade_suggestions FOR SELECT USING (status = 'approved' OR auth.jwt() ->> 'wallet_address' = wallet_address);
CREATE POLICY "Users can insert own suggestions" ON arcade_suggestions FOR INSERT WITH CHECK (auth.jwt() ->> 'wallet_address' = wallet_address);

-- Waitlist entries: Public read, authenticated insert
CREATE POLICY "Anyone can view waitlist entries" ON waitlist_entries FOR SELECT USING (true);
CREATE POLICY "Anyone can insert waitlist entries" ON waitlist_entries FOR INSERT WITH CHECK (true);

-- Create function to generate referral codes
CREATE OR REPLACE FUNCTION generate_referral_code()
RETURNS TEXT AS $$
BEGIN
    RETURN 'NAKAMA-' || UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 6));
END;
$$ LANGUAGE plpgsql;

-- Create function to assign welcome points
CREATE OR REPLACE FUNCTION assign_welcome_points()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO user_points (wallet_address, points_balance, referral_code)
    VALUES (NEW.wallet_address, 100, generate_referral_code())
    ON CONFLICT (wallet_address) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to assign welcome points on user registration
CREATE TRIGGER trigger_assign_welcome_points
    AFTER INSERT ON user_profiles
    FOR EACH ROW
    EXECUTE FUNCTION assign_welcome_points();

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers to update timestamps
CREATE TRIGGER trigger_user_profiles_updated_at
    BEFORE UPDATE ON user_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_user_points_updated_at
    BEFORE UPDATE ON user_points
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_nakama_status_updated_at
    BEFORE UPDATE ON nakama_status
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable realtime for chat
ALTER PUBLICATION supabase_realtime ADD TABLE nakama_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE nakama_status;