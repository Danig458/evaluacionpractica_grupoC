class FormValidator {
    constructor() {
        this.form = document.getElementById('registrationForm');
        this.submitBtn = document.getElementById('submitBtn');
        this.btnText = document.getElementById('btnText');
        this.errorMessage = document.getElementById('errorMessage');
        this.successMessage = document.getElementById('successMessage');
        
        // Definir validadores para cada campo
        this.validators = {
            identification: this.validateIdentification.bind(this),
            idType: this.validateRequired.bind(this),
            firstName: this.validateName.bind(this),
            lastName: this.validateName.bind(this),
            birthDate: this.validateBirthDate.bind(this),
            gender: this.validateRequired.bind(this),
            phone: this.validatePhone.bind(this),
            email: this.validateEmail.bind(this),
            terms: this.validateTerms.bind(this)
        };
        
        this.init();
    }
    
    /**
     * Inicializar event listeners
     */
    init() {
        // Event listener para envío del formulario
        this.form.addEventListener('submit', this.handleSubmit.bind(this));
        
        // Validación en tiempo real para cada campo
        Object.keys(this.validators).forEach(fieldName => {
            const field = document.getElementById(fieldName);
            if (field) {
                // Validar cuando el campo pierde el foco
                field.addEventListener('blur', () => this.validateField(fieldName));
                // Limpiar errores mientras el usuario escribe
                field.addEventListener('input', () => this.clearFieldError(fieldName));
            }
        });
        
        // Validación especial para checkboxes de términos
        const termsCheckbox = document.getElementById('terms');
        if (termsCheckbox) {
            termsCheckbox.addEventListener('change', () => this.validateField('terms'));
        }
    }
    
    /**
     * Validar un campo específico
     * @param {string} fieldName - Nombre del campo a validar
     * @returns {boolean} - True si el campo es válido
     */
    validateField(fieldName) {
        const field = document.getElementById(fieldName);
        const validator = this.validators[fieldName];
        
        if (!field || !validator) return true;
        
        const result = validator(field.value, field);
        this.displayFieldResult(fieldName, result);
        
        return result.isValid;
    }
    
    /**
     * Validación genérica para campos obligatorios
     * @param {string} value - Valor del campo
     * @returns {object} - Resultado de la validación
     */
    validateRequired(value) {
        return {
            isValid: value.trim() !== '',
            message: 'Este campo es obligatorio'
        };
    }
    
    /**
     * Validar número de identificación
     * @param {string} value - Número de identificación
     * @returns {object} - Resultado de la validación
     */
    validateIdentification(value) {
        if (!value.trim()) {
            return { 
                isValid: false, 
                message: 'El número de identificación es obligatorio' 
            };
        }
        
        // Validar que solo contenga números y tenga longitud apropiada
        if (!/^\d{6,15}$/.test(value.trim())) {
            return { 
                isValid: false, 
                message: 'El número de identificación debe contener entre 6 y 15 dígitos' 
            };
        }
        
        return { 
            isValid: true, 
            message: 'Número de identificación válido' 
        };
    }
    
    /**
     * Validar nombres y apellidos
     * @param {string} value - Nombre o apellido
     * @returns {object} - Resultado de la validación
     */
    validateName(value) {
        if (!value.trim()) {
            return { 
                isValid: false, 
                message: 'Este campo es obligatorio' 
            };
        }
        
        if (value.trim().length < 2) {
            return { 
                isValid: false, 
                message: 'Debe tener al menos 2 caracteres' 
            };
        }
        
        // Solo letras, espacios y caracteres especiales del español
        if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value.trim())) {
            return { 
                isValid: false, 
                message: 'Solo se permiten letras y espacios' 
            };
        }
        
        return { 
            isValid: true, 
            message: 'Nombre válido' 
        };
    }
    
    /**
     * Validar fecha de nacimiento
     * @param {string} value - Fecha de nacimiento
     * @returns {object} - Resultado de la validación
     */
    validateBirthDate(value) {
        if (!value) {
            return { 
                isValid: false, 
                message: 'La fecha de nacimiento es obligatoria' 
            };
        }
        
        const birthDate = new Date(value);
        const today = new Date();
        
        // Calcular edad
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        
        // Validaciones de fecha
        if (birthDate > today) {
            return { 
                isValid: false, 
                message: 'La fecha de nacimiento no puede ser futura' 
            };
        }
        
        if (age < 13) {
            return { 
                isValid: false, 
                message: 'Debes tener al menos 13 años para registrarte' 
            };
        }
        
        if (age > 120) {
            return { 
                isValid: false, 
                message: 'Por favor verifica la fecha de nacimiento' 
            };
        }
        
        return { 
            isValid: true, 
            message: 'Fecha de nacimiento válida' 
        };
    }
    
    /**
     * Validar número de teléfono
     * @param {string} value - Número de teléfono
     * @returns {object} - Resultado de la validación
     */
    validatePhone(value) {
        if (!value.trim()) {
            return { 
                isValid: false, 
                message: 'El número de teléfono es obligatorio' 
            };
        }
        
        // Remover espacios, guiones y paréntesis para validación
        const cleanPhone = value.replace(/[\s\-\(\)]/g, '');
        
        if (!/^\d{7,15}$/.test(cleanPhone)) {
            return { 
                isValid: false, 
                message: 'El teléfono debe tener entre 7 y 15 dígitos' 
            };
        }
        
        return { 
            isValid: true, 
            message: 'Número de teléfono válido' 
        };
    }
    
    /**
     * Validar correo electrónico
     * @param {string} value - Correo electrónico
     * @returns {object} - Resultado de la validación
     */
    validateEmail(value) {
        if (!value.trim()) {
            return { 
                isValid: false, 
                message: 'El correo electrónico es obligatorio' 
            };
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value.trim())) {
            return { 
                isValid: false, 
                message: 'Por favor ingresa un correo electrónico válido' 
            };
        }
        
        // Validar dominios comunes (opcional)
        const domain = value.split('@')[1];
        if (domain && domain.length < 3) {
            return { 
                isValid: false, 
                message: 'El dominio del correo no es válido' 
            };
        }
        
        return { 
            isValid: true, 
            message: 'Correo electrónico válido' 
        };
    }
    
    /**
     * Validar aceptación de términos y condiciones
     * @param {string} value - Valor del campo
     * @param {HTMLElement} field - Elemento del campo
     * @returns {object} - Resultado de la validación
     */
    validateTerms(value, field) {
        return {
            isValid: field.checked,
            message: 'Debes aceptar los términos y condiciones para continuar'
        };
    }
    
    /**
     * Mostrar resultado de validación en el campo
     * @param {string} fieldName - Nombre del campo
     * @param {object} result - Resultado de la validación
     */
    displayFieldResult(fieldName, result) {
        const field = document.getElementById(fieldName);
        const errorDiv = document.getElementById(`${fieldName}-error`);
        
        if (!field || !errorDiv) return;
        
        // Limpiar clases anteriores
        field.classList.remove('is-valid', 'is-invalid');
        
        if (result.isValid) {
            field.classList.add('is-valid');
            errorDiv.textContent = '';
        } else {
            field.classList.add('is-invalid');
            errorDiv.textContent = result.message;
        }
    }
    
    /**
     * Limpiar error de un campo específico
     * @param {string} fieldName - Nombre del campo
     */
    clearFieldError(fieldName) {
        const field = document.getElementById(fieldName);
        const errorDiv = document.getElementById(`${fieldName}-error`);
        
        if (field && field.classList.contains('is-invalid')) {
            field.classList.remove('is-invalid');
            if (errorDiv) errorDiv.textContent = '';
        }
    }
    
    /**
     * Validar todos los campos del formulario
     * @returns {object} - Resultado de la validación completa
     */
    validateAllFields() {
        let isFormValid = true;
        const errors = [];
        
        Object.keys(this.validators).forEach(fieldName => {
            const isValid = this.validateField(fieldName);
            if (!isValid) {
                isFormValid = false;
                const field = document.getElementById(fieldName);
                const label = field ? this.getFieldLabel(fieldName) : fieldName;
                errors.push(label);
            }
        });
        
        return { isValid: isFormValid, errors };
    }
    
    /**
     * Obtener etiqueta legible del campo
     * @param {string} fieldName - Nombre del campo
     * @returns {string} - Etiqueta del campo
     */
    getFieldLabel(fieldName) {
        const labels = {
            identification: 'Número de identificación',
            idType: 'Tipo de documento',
            firstName: 'Nombres',
            lastName: 'Apellidos',
            birthDate: 'Fecha de nacimiento',
            gender: 'Género',
            phone: 'Número de teléfono',
            email: 'Correo electrónico',
            terms: 'Términos y condiciones'
        };
        
        return labels[fieldName] || fieldName;
    }
    
    /**
     * Mostrar mensaje de error general
     * @param {string} message - Mensaje de error
     */
    showError(message) {
        document.getElementById('errorText').textContent = message;
        this.errorMessage.style.display = 'block';
        this.successMessage.style.display = 'none';
        
        // Scroll al mensaje de error
        this.errorMessage.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
        });
    }
    
    /**
     * Mostrar mensaje de éxito
     */
    showSuccess() {
        this.successMessage.style.display = 'block';
        this.errorMessage.style.display = 'none';
        
        // Scroll al mensaje de éxito
        this.successMessage.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
        });
    }
    
    /**
     * Controlar estado de carga del botón
     * @param {boolean} isLoading - Estado de carga
     */
    setLoading(isLoading) {
        if (isLoading) {
            this.submitBtn.disabled = true;
            this.btnText.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Procesando...';
        } else {
            this.submitBtn.disabled = false;
            this.btnText.innerHTML = 'Unirse a la Red Social';
        }
    }
    
    /**
     * Obtener datos del formulario
     * @returns {object} - Datos del formulario
     */
    getFormData() {
        const formData = new FormData(this.form);
        const data = {};
        
        // Campos normales
        for (let [key, value] of formData.entries()) {
            if (key !== 'socialMedia') {
                data[key] = value;
            }
        }
        
        // Redes sociales seleccionadas
        const socialMediaCheckboxes = document.querySelectorAll('input[name="socialMedia"]:checked');
        data.socialMedia = Array.from(socialMediaCheckboxes).map(cb => cb.value);
        
        return data;
    }
    
    /**
     * Simular envío de datos al servidor
     * @param {object} data - Datos a enviar
     * @returns {Promise} - Promise del envío
     */
    async submitToServer(data) {
        // Simular delay de red
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Simular respuesta exitosa (en la realidad sería una llamada AJAX)
                console.log('Datos enviados:', data);
                resolve({ success: true, message: 'Usuario registrado exitosamente' });
            }, 2000);
        });
    }
    
    /**
     * Manejar envío del formulario
     * @param {Event} e - Evento del formulario
     */
    async handleSubmit(e) {
        e.preventDefault();
        
        // Ocultar mensajes anteriores
        this.errorMessage.style.display = 'none';
        this.successMessage.style.display = 'none';
        
        // Validar todos los campos
        const validation = this.validateAllFields();
        
        if (!validation.isValid) {
            const errorMessage = validation.errors.length > 1 
                ? `Por favor corrige los siguientes campos: ${validation.errors.join(', ')}`
                : `Por favor corrige el campo: ${validation.errors[0]}`;
            
            this.showError(errorMessage);
            return;
        }
        
        // Obtener datos del formulario
        const formData = this.getFormData();
        
        // Validación adicional para redes sociales (opcional)
        if (formData.socialMedia.length === 0) {
            const confirmation = confirm(
                '¿Estás seguro de que no utilizas ninguna red social? ' +
                'Esto podría limitar algunas funcionalidades de la plataforma.'
            );
            
            if (!confirmation) {
                return;
            }
        }
        
        try {
            // Mostrar estado de carga
            this.setLoading(true);
            
            // Enviar datos al servidor
            const response = await this.submitToServer(formData);
            
            if (response.success) {
                this.showSuccess();
                
                // Opcional: resetear formulario después del éxito
                setTimeout(() => {
                    this.form.reset();
                    this.clearAllFieldStates();
                }, 3000);
            } else {
                this.showError(response.message || 'Error al procesar el registro');
            }
            
        } catch (error) {
            console.error('Error en el envío:', error);
            this.showError('Error de conexión. Por favor intenta nuevamente.');
        } finally {
            // Quitar estado de carga
            this.setLoading(false);
        }
    }
    
    /**
     * Limpiar estados visuales de todos los campos
     */
    clearAllFieldStates() {
        Object.keys(this.validators).forEach(fieldName => {
            const field = document.getElementById(fieldName);
            const errorDiv = document.getElementById(`${fieldName}-error`);
            
            if (field) {
                field.classList.remove('is-valid', 'is-invalid');
            }
            
            if (errorDiv) {
                errorDiv.textContent = '';
            }
        });
    }
}

// Funciones utilitarias adicionales
const FormUtils = {
    /**
     * Formatear número de teléfono mientras se escribe
     * @param {HTMLElement} phoneInput - Campo de teléfono
     */
    formatPhoneNumber: function(phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            let formattedValue = '';
            
            if (value.length > 0) {
                if (value.length <= 3) {
                    formattedValue = value;
                } else if (value.length <= 6) {
                    formattedValue = value.slice(0, 3) + '-' + value.slice(3);
                } else {
                    formattedValue = value.slice(0, 3) + '-' + value.slice(3, 6) + '-' + value.slice(6, 10);
                }
            }
            
            e.target.value = formattedValue;
        });
    },
    
    /**
     * Capitalizar primera letra de cada palabra
     * @param {HTMLElement} textInput - Campo de texto
     */
    capitalizeWords: function(textInput) {
        textInput.addEventListener('blur', function(e) {
            const words = e.target.value.toLowerCase().split(' ');
            const capitalizedWords = words.map(word => 
                word.charAt(0).toUpperCase() + word.slice(1)
            );
            e.target.value = capitalizedWords.join(' ');
        });
    }
};

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    // Crear instancia del validador
    const validator = new FormValidator();
    
    // Aplicar utilidades adicionales
    const phoneInput = document.getElementById('phone');
    const firstNameInput = document.getElementById('firstName');
    const lastNameInput = document.getElementById('lastName');
    
    if (phoneInput) {
        FormUtils.formatPhoneNumber(phoneInput);
    }
    
    if (firstNameInput) {
        FormUtils.capitalizeWords(firstNameInput);
    }
    
    if (lastNameInput) {
        FormUtils.capitalizeWords(lastNameInput);
    }
    
    console.log('Validador de formulario inicializado correctamente');
});