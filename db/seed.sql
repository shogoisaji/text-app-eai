-- seed.sql
-- 実行コマンド
-- wrangler d1 execute text-app-eai-db --local --file=seed.sql
DROP TABLE IF EXISTS users;  -- 既存のテーブルを削除

CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL,
  password TEXT NOT NULL,
  role TEXT NOT NULL
);

INSERT INTO users ( email, password, role) VALUES ( 'admin_user@gmail.com', 'e6ca2e19a8f113f6f58bd81eee1ca85d8d3029329a3aa6fe51c1df5451d4f490', 'admin');
INSERT INTO users ( email, password, role) VALUES ( 'email','password', 'user');

DROP TABLE IF EXISTS systems;

CREATE TABLE systems (
  status INTEGER NOT NULL
);

INSERT INTO systems ( status ) VALUES ( 1 );