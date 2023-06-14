CREATE TABLE IF NOT EXISTS key (
  id BIGINT PRIMARY KEY,
  public_jwk JSON,
  private_jwk JSON
);
