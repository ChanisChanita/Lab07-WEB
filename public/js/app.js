// Funciones de utilidad para la aplicación
class AuthManager {
    constructor() {
        this.token = localStorage.getItem('token');
        this.user = null;
        this.checkAuthOnLoad();
    }

    // Verificar autenticación al cargar la página
    checkAuthOnLoad() {
        const currentPath = window.location.pathname;
        
        // Si estamos en una página pública y tenemos token, verificar usuario
        if (this.token && (currentPath.includes('signin') || currentPath.includes('signup') || currentPath === '/' || currentPath === '/index.html')) {
            this.fetchUserData().then(() => {
                if (this.isAuthenticated()) {
                    this.redirectToDashboard();
                }
            }).catch(() => {
                // Token inválido, limpiar y quedarse en la página
                this.token = null;
                this.user = null;
                localStorage.removeItem('token');
            });
        } 
        // Si estamos en una página protegida, verificar autenticación
        else if (!currentPath.includes('signin') && !currentPath.includes('signup') && !currentPath.includes('404') && !currentPath.includes('403')) {
            if (this.token) {
                this.fetchUserData().catch(() => {
                    this.logout();
                });
            } else {
                this.redirectToSignIn();
            }
        }
    }

    // Obtener datos del usuario actual
    async fetchUserData() {
        try {
            const response = await fetch('/api/users/me', {
                headers: {
                    'Authorization': `Bearer ${this.token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                this.user = await response.json();
                this.updateNavigation();
                return this.user;
            } else if (response.status === 401) {
                this.logout();
            } else {
                throw new Error('Error al obtener datos del usuario');
            }
        } catch (error) {
            console.error('Error:', error);
            this.logout();
        }
    }

    // Iniciar sesión
    async signIn(email, password) {
        try {
            const response = await fetch('/api/auth/signIn', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (response.ok) {
                this.token = data.token;
                localStorage.setItem('token', this.token);
                await this.fetchUserData();
                this.redirectToDashboard();
            } else {
                throw new Error(data.message || 'Error al iniciar sesión');
            }
        } catch (error) {
            throw error;
        }
    }

    // Registrarse
    async signUp(userData) {
        try {
            const response = await fetch('/api/auth/signUp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });

            const data = await response.json();

            if (response.ok) {
                return data;
            } else {
                throw new Error(data.message || 'Error al registrarse');
            }
        } catch (error) {
            throw error;
        }
    }

    // Cerrar sesión
    logout() {
        this.token = null;
        this.user = null;
        localStorage.removeItem('token');
        this.redirectToSignIn();
    }

    // Verificar si el usuario tiene un rol específico
    hasRole(role) {
        return this.user && this.user.roles && this.user.roles.includes(role);
    }

    // Verificar si el usuario está autenticado
    isAuthenticated() {
        return this.token !== null && this.user !== null;
    }

    // Actualizar navegación según el estado de autenticación
    updateNavigation() {
        const navUser = document.getElementById('nav-user');
        const navLogout = document.getElementById('nav-logout');
        
        if (this.user && navUser) {
            navUser.textContent = `${this.user.name} ${this.user.lastName}`;
            navUser.style.display = 'block';
        }
        
        if (navLogout) {
            navLogout.style.display = this.isAuthenticated() ? 'block' : 'none';
        }
    }

    // Redirecciones
    redirectToSignIn() {
        if (!window.location.pathname.includes('signin') && 
            !window.location.pathname.includes('signup')) {
            window.location.href = '/signin.html';
        }
    }

    redirectToDashboard() {
        if (this.hasRole('admin')) {
            window.location.href = '/admin-dashboard.html';
        } else {
            window.location.href = '/user-dashboard.html';
        }
    }

    // Verificar acceso a rutas protegidas
    checkRouteAccess() {
        const currentPath = window.location.pathname;
        
        // Rutas públicas - permitir acceso sin verificaciones adicionales
        if (currentPath.includes('signin') || currentPath.includes('signup') || 
            currentPath.includes('404') || currentPath.includes('403') || 
            currentPath === '/' || currentPath === '/index.html') {
            // Si está autenticado y en página de login/signup, redirigir al dashboard
            if (this.isAuthenticated() && (currentPath.includes('signin') || currentPath.includes('signup'))) {
                this.redirectToDashboard();
            }
            return;
        }

        // Para todas las demás páginas, solo verificar autenticación básica
        if (!this.isAuthenticated()) {
            this.redirectToSignIn();
            return;
        }

        // Verificación específica de admin dashboard
        if (currentPath.includes('admin-dashboard') && this.user && !this.hasRole('admin')) {
            window.location.href = '/403.html';
            return;
        }
    }
}

// Funciones de utilidad
function showLoading(show = true) {
    const loadingElements = document.querySelectorAll('.loading');
    loadingElements.forEach(el => {
        el.style.display = show ? 'block' : 'none';
    });
}

function showError(message, containerId = 'error-container') {
    const container = document.getElementById(containerId);
    if (container) {
        container.innerHTML = `
            <div class="card-panel red lighten-4 red-text text-darken-2">
                <i class="material-icons left">error</i>
                ${message}
            </div>
        `;
        container.style.display = 'block';
    } else {
        M.toast({html: message, classes: 'red'});
    }
}

function showSuccess(message, containerId = 'success-container') {
    const container = document.getElementById(containerId);
    if (container) {
        container.innerHTML = `
            <div class="card-panel green lighten-4 green-text text-darken-2">
                <i class="material-icons left">check_circle</i>
                ${message}
            </div>
        `;
        container.style.display = 'block';
    } else {
        M.toast({html: message, classes: 'green'});
    }
}

function hideMessages() {
    const containers = ['error-container', 'success-container'];
    containers.forEach(id => {
        const container = document.getElementById(id);
        if (container) {
            container.style.display = 'none';
        }
    });
}

// Formatear fecha para mostrar
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Validaciones del frontend
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validatePassword(password) {
    // Al menos 8 caracteres, 1 mayúscula, 1 dígito, 1 carácter especial
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[#$%&*@])[A-Za-z\d#$%&*@]{8,}$/;
    return passwordRegex.test(password);
}

// Instancia global del AuthManager
const authManager = new AuthManager();