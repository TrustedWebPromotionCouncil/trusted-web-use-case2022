CREATE TABLE IF NOT EXISTS credentials (
  id BIGINT PRIMARY KEY,
  format TEXT,
  vc TEXT,
  manifest JSON,
  type TEXT[],
  credential_subject JSON,
  vc_history JSON[],
  related_transactions JSON[],
  credential_id UUID
);
