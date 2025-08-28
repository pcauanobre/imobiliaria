ALTER TABLE usuario
  ADD CONSTRAINT uk_usuario_email UNIQUE (email);
