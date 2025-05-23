class usuario {
  constructor(data) {
    this.identificacion = data.identificacion;
    this.nombres_apellidos = data.nombres_apellidos;
    this.fecha_nacimiento = data.fecha_nacimiento;
    this.genero = data.genero;
    this.telefono = data.telefono;
    this.correo = data.correo;
    this.fotografia = data.fotografia;
    this.redes_sociales = data.redes_sociales;
  }
}

module.exports = Usuario;
