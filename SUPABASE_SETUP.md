# Supabase 数据库设置指南

本文档说明如何在 Supabase 中设置 Traveller Dashboard 系统所需的数据库表结构。

## 1. 创建表结构

在 Supabase Dashboard 的 SQL Editor 中执行以下 SQL：

```sql
-- 创建 travellers 表
CREATE TABLE IF NOT EXISTS travellers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  zoho_deal_id TEXT UNIQUE NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建 bank_accounts 表
CREATE TABLE IF NOT EXISTS bank_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  traveller_id UUID NOT NULL REFERENCES travellers(id) ON DELETE CASCADE,
  account_holder_name TEXT NOT NULL,
  bsb TEXT NOT NULL,
  account_number TEXT NOT NULL,
  bank_name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(traveller_id)
);

-- 创建 documents 表
CREATE TABLE IF NOT EXISTS documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  traveller_id UUID NOT NULL REFERENCES travellers(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('itinerary', 'brochure')),
  name TEXT NOT NULL,
  blob_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建 referrer_codes 表（未来扩展）
CREATE TABLE IF NOT EXISTS referrer_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  traveller_id UUID NOT NULL REFERENCES travellers(id) ON DELETE CASCADE,
  code TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_travellers_user_id ON travellers(user_id);
CREATE INDEX IF NOT EXISTS idx_travellers_zoho_deal_id ON travellers(zoho_deal_id);
CREATE INDEX IF NOT EXISTS idx_bank_accounts_traveller_id ON bank_accounts(traveller_id);
CREATE INDEX IF NOT EXISTS idx_documents_traveller_id ON documents(traveller_id);
CREATE INDEX IF NOT EXISTS idx_documents_type ON documents(type);
CREATE INDEX IF NOT EXISTS idx_referrer_codes_traveller_id ON referrer_codes(traveller_id);
CREATE INDEX IF NOT EXISTS idx_referrer_codes_code ON referrer_codes(code);
```

## 2. 设置 Row Level Security (RLS) 策略

执行以下 SQL 来启用 RLS 并设置策略：

```sql
-- 启用 RLS
ALTER TABLE travellers ENABLE ROW LEVEL SECURITY;
ALTER TABLE bank_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE referrer_codes ENABLE ROW LEVEL SECURITY;

-- travellers 表策略：用户只能访问自己的记录
CREATE POLICY "Users can view own traveller record"
  ON travellers FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own traveller record"
  ON travellers FOR UPDATE
  USING (auth.uid() = user_id);

-- bank_accounts 表策略：用户只能访问自己关联的账户
CREATE POLICY "Users can view own bank account"
  ON bank_accounts FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM travellers
      WHERE travellers.id = bank_accounts.traveller_id
      AND travellers.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own bank account"
  ON bank_accounts FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM travellers
      WHERE travellers.id = bank_accounts.traveller_id
      AND travellers.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own bank account"
  ON bank_accounts FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM travellers
      WHERE travellers.id = bank_accounts.traveller_id
      AND travellers.user_id = auth.uid()
    )
  );

-- documents 表策略：用户只能访问自己关联的文档
CREATE POLICY "Users can view own documents"
  ON documents FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM travellers
      WHERE travellers.id = documents.traveller_id
      AND travellers.user_id = auth.uid()
    )
  );

-- referrer_codes 表策略：用户只能访问自己的推荐码
CREATE POLICY "Users can view own referrer codes"
  ON referrer_codes FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM travellers
      WHERE travellers.id = referrer_codes.traveller_id
      AND travellers.user_id = auth.uid()
    )
  );
```

## 3. 创建触发器（可选）

如果需要自动更新 `updated_at` 字段，可以创建触发器：

```sql
-- 创建更新 updated_at 的函数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 为 travellers 表创建触发器
CREATE TRIGGER update_travellers_updated_at
  BEFORE UPDATE ON travellers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 为 bank_accounts 表创建触发器
CREATE TRIGGER update_bank_accounts_updated_at
  BEFORE UPDATE ON bank_accounts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

## 4. 环境变量配置

在项目根目录的 `.env.local` 文件中添加以下环境变量：

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
BLOB_READ_WRITE_TOKEN=your_vercel_blob_token
```

## 5. 注意事项

1. **Service Role Key**: 仅在服务器端 API 路由中使用，不要暴露给客户端
2. **RLS 策略**: 确保所有表都启用了 RLS，以保护数据安全
3. **Zoho Deal ID**: 在创建 traveller 记录时，确保 zoho_deal_id 是唯一的
4. **Vercel Blob**: 文档的 blob_url 应该指向 Vercel Blob Storage 中的文件

## 6. 测试

完成设置后，可以通过以下方式测试：

1. 访问注册页面：`/travellers/account/register?dealId=test-deal-id`
2. 创建账户后，应该能够访问 dashboard
3. 测试银行账户信息的保存和读取
4. 测试文档列表的获取
