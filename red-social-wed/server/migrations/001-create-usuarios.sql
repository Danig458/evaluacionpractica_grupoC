CREATE TABLE IF NOT EXISTS estudiantes (
  id SERIAL PRIMARY KEY,
  identificacion VARCHAR(20) NOT NULL,
  nombres_apellidos VARCHAR(100) NOT NULL,
  fecha_nacimiento DATE NOT NULL,
  genero VARCHAR(20) NOT NULL,
  telefono VARCHAR(20),
  correo VARCHAR(100) NOT NULL,
  fotografia VARCHAR(255),
  redes_sociales TEXT
);
