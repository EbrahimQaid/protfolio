// login.js - النسخة الكاملة مع جميع الميزات
class LoginSystem {
    constructor() {
        this.currentUserType = 'student';
        this.isLoading = false;
        this.init();
    }

    init() {
        // الانتظار حتى تحميل DOM بالكامل
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.initialize();
            });
        } else {
            this.initialize();
        }
    }

    initialize() {
        this.setupEventListeners();
        this.checkSavedCredentials();
    }

    setupEventListeners() {
        // User type selection
        const userTypes = document.querySelectorAll('.user-type');
        if (userTypes.length > 0) {
            userTypes.forEach(type => {
                type.addEventListener('click', (e) => {
                    this.selectUserType(e.currentTarget.dataset.type);
                });
                
                // إضافة دعم لوحة المفاتيح
                type.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        this.selectUserType(e.currentTarget.dataset.type);
                    }
                });
            });
        }

        // Password visibility toggle
        const togglePassword = document.getElementById('togglePassword');
        if (togglePassword) {
            togglePassword.addEventListener('click', () => {
                this.togglePasswordVisibility();
            });
        }

        // Form submission
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleLogin();
            });
        }

        // Real-time form validation
        const usernameInput = document.getElementById('username');
        if (usernameInput) {
            usernameInput.addEventListener('input', () => {
                this.validateForm();
            });
        }

        const passwordInput = document.getElementById('password');
        if (passwordInput) {
            passwordInput.addEventListener('input', () => {
                this.validateForm();
                this.updatePasswordStrength();
            });
        }

        // Demo accounts click
        document.querySelectorAll('.demo-account').forEach(account => {
            account.addEventListener('click', () => {
                const username = account.dataset.username;
                const password = account.dataset.password;
                const userType = account.dataset.user;
                
                document.getElementById('username').value = username;
                document.getElementById('password').value = password;
                this.selectUserType(userType);
                this.validateForm();
                
                this.showTempMessage(`تم تعبئة بيانات ${this.translateUserType(userType)} تلقائياً`, 'info');
            });
        });

        // Enter key support
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && this.isFormValid()) {
                this.handleLogin();
            }
        });

        // Remember me functionality
        const rememberMe = document.getElementById('rememberMe');
        if (rememberMe) {
            rememberMe.addEventListener('change', () => {
                this.updateRememberMeState();
            });
        }
    }

    selectUserType(type) {
        // Remove active class from all types
        document.querySelectorAll('.user-type').forEach(el => {
            el.classList.remove('active');
        });

        // Add active class to selected type
        const selectedType = document.querySelector(`[data-type="${type}"]`);
        if (selectedType) {
            selectedType.classList.add('active');
        }
        
        this.currentUserType = type;
        
        // Update form validation
        this.validateForm();
        
        // Show user type specific feedback
        this.showUserTypeFeedback(type);
    }

    showUserTypeFeedback(type) {
        const messages = {
            student: 'مرحباً بك أيها الطالب! يرجى استخدام بياناتك الخاصة بالمنصة.',
            teacher: 'أهلاً بك أيها المعلم! يمكنك الوصول إلى لوحة التحكم الخاصة بك.',
            admin: 'مرحباً بك في لوحة تحكم الإدارة. يرجى استخدام بيانات المسؤول.'
        };
        
        if (messages[type]) {
            this.showTempMessage(messages[type], 'info');
        }
    }

    translateUserType(type) {
        const types = {
            student: 'طالب',
            teacher: 'معلم',
            admin: 'مسؤول'
        };
        return types[type] || type;
    }

    togglePasswordVisibility() {
        const passwordInput = document.getElementById('password');
        const toggleIcon = document.getElementById('togglePassword');
        
        if (!passwordInput || !toggleIcon) return;
        
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            toggleIcon.innerHTML = '<i class="fas fa-eye"></i>';
            toggleIcon.setAttribute('aria-label', 'إخفاء كلمة المرور');
        } else {
            passwordInput.type = 'password';
            toggleIcon.innerHTML = '<i class="fas fa-eye-slash"></i>';
            toggleIcon.setAttribute('aria-label', 'إظهار كلمة المرور');
        }
    }

    updatePasswordStrength() {
        const password = document.getElementById('password')?.value || '';
        const strengthBar = document.querySelector('.strength-bar');
        
        if (!strengthBar) return;
        
        let strength = 0;
        let className = '';
        
        if (password.length > 0) {
            if (password.length < 6) {
                strength = 33;
                className = 'weak';
            } else if (password.length < 10) {
                strength = 66;
                className = 'medium';
            } else {
                strength = 100;
                className = 'strong';
            }
            
            // Additional strength checks
            if (/[A-Z]/.test(password)) strength += 10;
            if (/[0-9]/.test(password)) strength += 10;
            if (/[^A-Za-z0-9]/.test(password)) strength += 10;
            
            strength = Math.min(strength, 100);
        }
        
        strengthBar.style.width = strength + '%';
        strengthBar.className = 'strength-bar ' + className;
        strengthBar.setAttribute('aria-valuenow', strength);
    }

    validateForm() {
        const username = document.getElementById('username')?.value.trim() || '';
        const password = document.getElementById('password')?.value || '';
        const loginBtn = document.getElementById('loginBtn');
        
        if (!loginBtn) return false;
        
        const isValid = username.length >= 3 && password.length >= 6;
        
        loginBtn.disabled = !isValid;
        
        // Update visual feedback
        if (username.length > 0) {
            this.updateUsernameFeedback(username);
        }
        
        return isValid;
    }

    updateUsernameFeedback(username) {
        // يمكن إضافة تحقق إضافي على اسم المستخدم
        const feedback = document.querySelector('.form-group:first-child .form-feedback');
        if (feedback) {
            if (username.length < 3) {
                feedback.textContent = 'يجب أن يكون اسم المستخدم至少 3 أحرف';
                feedback.style.color = '#dc3545';
            } else {
                feedback.textContent = '';
            }
        }
    }

    isFormValid() {
        return this.validateForm();
    }

    async handleLogin() {
        if (this.isLoading || !this.isFormValid()) return;
        
        const username = document.getElementById('username')?.value.trim() || '';
        const password = document.getElementById('password')?.value || '';
        
        this.setLoadingState(true);
        this.hideError();
        
        try {
            // Simulate API call
            const user = await this.authenticateUser(username, password, this.currentUserType);
            
            if (user) {
                this.handleSuccessfulLogin(user);
            } else {
                this.handleFailedLogin('اسم المستخدم أو كلمة المرور غير صحيحة');
            }
        } catch (error) {
            console.error('Login error:', error);
            this.handleFailedLogin('حدث خطأ في الاتصال. يرجى المحاولة مرة أخرى.');
        } finally {
            this.setLoadingState(false);
        }
    }

    async authenticateUser(username, password, userType) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Mock authentication - استخدام أسماء المستخدمين الإنجليزية لتتوافق مع قاعدة البيانات
        const mockUsers = {
            student: [
                { username: 'ابراهيم قائد', password: '123456', name: 'أحمد محمد', role: 'student', avatar: '../image/default-avatar.png' },
                { username: 'student2', password: '123456', name: 'فاطمة أحمد', role: 'student', avatar: '../image/default-avatar.png' },
                { username: 'student3', password: '123456', name: 'سارة أحمد', role: 'student', avatar: '../image/default-avatar.png' },
                { username: 'student4', password: '123456', name: 'يوسف محمد', role: 'student', avatar: '../image/default-avatar.png' }
            ],
            teacher: [
                { username: 'teacher1', password: '123456', name: 'أستاذ أحمد محمد', role: 'teacher', avatar: '../image/default-avatar.png' },
                { username: 'teacher2', password: '123456', name: 'أستاذة مريم حسن', role: 'teacher', avatar: '../image/default-avatar.png' }
            ],
            admin: [
                { username: 'admin', password: '123456', name: 'مدير النظام', role: 'admin', avatar: '../image/avatar.jpg' },
                { username: 'خالد', password: '123456', name: 'مدير النظام', role: 'admin', avatar: '../image/avatar.jpg' }
            ]
        };
        
        const users = mockUsers[userType];
        if (!users) return null;
        
        return users.find(user => 
            user.username === username && user.password === password
        );
    }

    handleSuccessfulLogin(user) {
        // Save user data to localStorage
        localStorage.setItem('currentUser', JSON.stringify(user));
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userType', this.currentUserType);
        
        // Save credentials for next time
        this.saveCredentials(user.username, this.currentUserType);
        
        // Show success message
        this.showTempMessage(`مرحباً بعودتك، ${user.name}!`, 'success');
        
        // Add success class to button
        const loginBtn = document.getElementById('loginBtn');
        if (loginBtn) {
            loginBtn.classList.add('success');
        }
        
        // Redirect to dashboard after delay
        setTimeout(() => {
            this.redirectToDashboard(user.role);
        }, 1000);
    }

    handleFailedLogin(message) {
        this.showError(message);
        
        // Shake animation for error
        const form = document.getElementById('loginForm');
        if (form) {
            form.style.animation = 'shake 0.5s ease-in-out';
            setTimeout(() => {
                form.style.animation = '';
            }, 500);
        }
        
        // Clear password field for security
        document.getElementById('password').value = '';
        this.validateForm();
    }

    redirectToDashboard(role) {
        const dashboards = {
            student: 'student-dashboard.html',
            teacher: 'teacher-dashboard.html',
            admin: 'admin-dashboard.html'
        };
        
        const dashboardUrl = dashboards[role] || 'admin-dashboard.html';
        console.log('Redirecting to:', dashboardUrl);
        window.location.href = dashboardUrl;
    }

    setLoadingState(loading) {
        this.isLoading = loading;
        const loginBtn = document.getElementById('loginBtn');
        
        if (!loginBtn) return;
        
        if (loading) {
            loginBtn.classList.add('loading');
            loginBtn.disabled = true;
            loginBtn.setAttribute('aria-label', 'جاري تسجيل الدخول...');
        } else {
            loginBtn.classList.remove('loading');
            loginBtn.disabled = !this.isFormValid();
            loginBtn.setAttribute('aria-label', 'تسجيل الدخول');
        }
    }

    showError(message) {
        const errorElement = document.getElementById('loginError');
        if (!errorElement) return;
        
        errorElement.textContent = message;
        errorElement.style.display = 'block';
        errorElement.setAttribute('aria-live', 'assertive');
        
        // Auto-hide error after 5 seconds
        setTimeout(() => {
            this.hideError();
        }, 5000);
    }

    hideError() {
        const errorElement = document.getElementById('loginError');
        if (errorElement) {
            errorElement.textContent = '';
            errorElement.style.display = 'none';
        }
    }

    showTempMessage(message, type = 'info') {
        // Remove existing messages first
        const existingMessages = document.querySelectorAll('.temp-message');
        existingMessages.forEach(msg => msg.remove());
        
        const messageElement = document.createElement('div');
        messageElement.className = `temp-message ${type}`;
        messageElement.textContent = message;
        messageElement.setAttribute('role', 'alert');
        messageElement.setAttribute('aria-live', 'polite');
        messageElement.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#17a2b8'};
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            z-index: 1000;
            animation: slideDown 0.3s ease;
            font-weight: 500;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            max-width: 90%;
            text-align: center;
        `;
        
        document.body.appendChild(messageElement);
        
        setTimeout(() => {
            if (messageElement.parentNode) {
                messageElement.style.animation = 'slideUp 0.3s ease';
                setTimeout(() => {
                    if (messageElement.parentNode) {
                        messageElement.remove();
                    }
                }, 300);
            }
        }, 3000);
    }

    checkSavedCredentials() {
        const savedUsername = localStorage.getItem('lastUsername');
        const savedUserType = localStorage.getItem('lastUserType');
        const rememberMe = localStorage.getItem('rememberMe') === 'true';
        
        const usernameInput = document.getElementById('username');
        const rememberMeCheckbox = document.getElementById('rememberMe');
        
        if (usernameInput && savedUsername && rememberMe) {
            usernameInput.value = savedUsername;
        }
        
        if (rememberMeCheckbox) {
            rememberMeCheckbox.checked = rememberMe;
        }
        
        if (savedUserType) {
            this.selectUserType(savedUserType);
        }
        
        this.validateForm();
    }

    saveCredentials(username, userType) {
        const rememberMe = document.getElementById('rememberMe')?.checked;
        
        if (rememberMe) {
            localStorage.setItem('lastUsername', username);
            localStorage.setItem('lastUserType', userType);
            localStorage.setItem('rememberMe', 'true');
        } else {
            localStorage.removeItem('lastUsername');
            localStorage.removeItem('lastUserType');
            localStorage.setItem('rememberMe', 'false');
        }
    }

    updateRememberMeState() {
        const rememberMe = document.getElementById('rememberMe')?.checked;
        localStorage.setItem('rememberMe', rememberMe.toString());
        
        if (!rememberMe) {
            localStorage.removeItem('lastUsername');
            localStorage.removeItem('lastUserType');
        }
    }
}

// Initialize login system when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new LoginSystem();
});

// Add animations
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
    }
    
    @keyframes slideDown {
        from {
            opacity: 0;
            transform: translateX(-50%) translateY(-20px);
        }
        to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }
    }
    
    @keyframes slideUp {
        from {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }
        to {
            opacity: 0;
            transform: translateX(-50%) translateY(-20px);
        }
    }
    
    .demo-account {
        cursor: pointer;
        transition: all 0.3s ease;
    }
    
    .demo-account:hover {
        transform: translateX(-5px);
    }
    
    .form-control:invalid {
        border-color: #dc3545;
    }
    
    .form-control:valid {
        border-color: #28a745;
    }
    
    @media (prefers-reduced-motion: reduce) {
        * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
        }
    }
`;
document.head.appendChild(style);