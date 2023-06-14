CREATE TABLE IF NOT EXISTS transactions (
  id BIGINT PRIMARY KEY,
  transaction_id UUID,
  title TEXT,
  status TEXT,
  updated_at TEXT,
  vendor JSON,
  industry_association JSON,
  sme_agency JSON,
  maker TEXT
);
