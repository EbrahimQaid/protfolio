// admin-dashboard.js - النسخة الكاملة مع جميع الميزات
class AdminDashboard {
    constructor() {
        this.currentView = 'table';
        this.currentPage = {
            users: 1,
            classes: 1,
            subjects: 1
        };
        this.itemsPerPage = 10;
        this.allUsers = [];
        this.allClasses = [];
        this.allSubjects = [];
        this.allNotifications = [];
        this.tempAvatar = null;
        this.charts = {};
        this.schoolSettings = this.loadSchoolSettings();
        
        this.setupErrorHandling();
        this.init();
    }

    setupErrorHandling() {
        window.addEventListener('error', (event) => {
            console.error('خطأ غير معالج:', event.error);
            this.showToast('حدث خطأ غير متوقع', 'error');
        });
        
        window.addEventListener('unhandledrejection', (event) => {
            console.error('Promise مرفوض:', event.reason);
            this.showToast('حدث خطأ في العملية', 'error');
        });
    }

    init() {
        this.checkAuth();
        this.setupEventListeners();
        this.loadInitialData();
        this.initializeCharts();
    }

    checkAuth() {
        const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
        if (!currentUser || currentUser.role !== 'admin') {
            window.location.href = 'index.html';
            return;
        }


        // تحديث واجهة المستخدم بمعلومات المستخدم
        if (currentUser) {
            this.updateUserInfo(currentUser);
        }
                document.querySelector("#username").innerHTML = currentUser.role;

    }

    updateUserInfo(user) {
        const userNameElement = document.getElementById('user-name');
        const welcomeUserElement = document.getElementById('welcome-user');
        const userAvatarElement = document.getElementById('user-avatar');
        
        if (userNameElement) userNameElement.textContent = user.name;
        if (welcomeUserElement) welcomeUserElement.textContent = user.name;
        if (userAvatarElement && user.avatar) {
            userAvatarElement.src = user.avatar;
        }
        
    }

    setupEventListeners() {
        this.setupNavigation();
        this.setupLogout();
        this.setupSearchAndFilters();
        this.setupForms();
        this.setupModalClosures();
        this.setupQuickActions();
        this.setupViewToggle();
        this.setupReportGeneration();
    }

    setupNavigation() {
        const navLinks = document.querySelectorAll('.sidebar-nav a');
        const contentSections = document.querySelectorAll('.content-section');

        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                
                navLinks.forEach(l => l.parentElement.classList.remove('active'));
                link.parentElement.classList.add('active');
                
                contentSections.forEach(section => section.classList.remove('active'));
                
                const targetSection = link.getAttribute('data-section');
                const targetElement = document.getElementById(targetSection);
                if (targetElement) {
                    targetElement.classList.add('active');
                    this.loadSectionData(targetSection);
                }
            });
        });
    }

    setupLogout() {
        document.getElementById('logout-btn')?.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('currentUser');
            localStorage.removeItem('isLoggedIn');
            window.location.href = 'index.html';
        });
    }

    setupSearchAndFilters() {
        // البحث في المستخدمين
        document.getElementById('search-users')?.addEventListener('input', (e) => {
            this.filterUsers(e.target.value);
        });

        document.getElementById('filter-user-role')?.addEventListener('change', (e) => {
            this.filterUsersByRole(e.target.value);
        });

        // البحث في الفصول
        document.getElementById('search-classes')?.addEventListener('input', (e) => {
            this.filterClasses(e.target.value);
        });

        document.getElementById('filter-class-level')?.addEventListener('change', (e) => {
            this.filterClassesByLevel(e.target.value);
        });

        // البحث في المواد
        document.getElementById('search-subjects')?.addEventListener('input', (e) => {
            this.filterSubjects(e.target.value);
        });
    }

    setupForms() {
        document.getElementById('user-form')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveUser();
        });

        document.getElementById('change-password-form')?.addEventListener('submit', (e) => {
            this.changePassword(e);
        });

        document.getElementById('general-settings-form')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveGeneralSettings();
        });

        document.getElementById('system-settings-form')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveSystemSettings();
        });

        document.getElementById('notification-form')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.sendNotification();
        });

        document.getElementById('report-form')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.generateReport();
        });

        // زر إضافة مستخدم
        document.getElementById('add-user-btn')?.addEventListener('click', () => {
            this.showAddUserForm();
        });

        // تغيير الدور في نموذج المستخدم
        document.getElementById('user-role')?.addEventListener('change', (e) => {
            this.toggleClassField(e.target.value);
        });

        // View toggle buttons
        document.querySelectorAll('.view-toggle-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.switchView(btn.dataset.view);
            });
        });
    }

    setupModalClosures() {
        document.querySelectorAll('.modal .close').forEach(closeBtn => {
            closeBtn.addEventListener('click', () => {
                closeBtn.closest('.modal').style.display = 'none';
            });
        });

        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.style.display = 'none';
                }
            });
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                document.querySelectorAll('.modal').forEach(modal => {
                    modal.style.display = 'none';
                });
            }
        });

        document.getElementById('cancel-user-btn')?.addEventListener('click', () => {
            this.closeUserModal();
        });

        document.getElementById('cancel-password-btn')?.addEventListener('click', () => {
            this.closeChangePasswordModal();
        });

        document.getElementById('cancel-notification-btn')?.addEventListener('click', () => {
            this.closeNotificationModal();
        });

        document.getElementById('cancel-report-btn')?.addEventListener('click', () => {
            this.closeReportModal();
        });
    }

    setupQuickActions() {
        document.querySelectorAll('.action-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const action = btn.dataset.action;
                this.handleQuickAction(action);
            });
        });
    }

    setupViewToggle() {
        const viewToggleBtns = document.querySelectorAll('.view-toggle-btn');
        viewToggleBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                viewToggleBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.switchView(btn.dataset.view);
            });
        });
    }

    setupReportGeneration() {
        // إعداد تاريخ البداية والنهاية للتقارير
        const today = new Date();
        const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
        
        document.getElementById('report-start-date').value = this.formatDateForInput(firstDay);
        document.getElementById('report-end-date').value = this.formatDateForInput(today);
    }

    formatDateForInput(date) {
        return date.toISOString().split('T')[0];
    }

    async loadInitialData() {
        await Promise.all([
            this.loadUsers(),
            this.loadClasses(),
            this.loadSubjects(),
            this.loadNotifications(),
            this.loadActivities(),
            this.loadStats()
        ]);
        
        this.updateDashboardCharts();
    }

    async loadSectionData(section) {
        switch(section) {
            case 'users':
                await this.loadUsers();
                break;
            case 'classes':
                await this.loadClasses();
                break;
            case 'subjects':
                await this.loadSubjects();
                break;
            case 'reports':
                this.loadReports();
                break;
            case 'notifications':
                await this.loadNotifications();
                break;
            case 'settings':
                this.loadSettings();
                break;
        }
    }

    // ===== المخططات والرسوم البيانية =====
    initializeCharts() {
        this.initializeAttendanceChart();
    }

    initializeAttendanceChart() {
        const ctx = document.getElementById('attendance-chart');
        if (!ctx) return;

        this.charts.attendance = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس'],
                datasets: [{
                    label: 'نسبة الحضور',
                    data: [85, 92, 78, 88, 95],
                    borderColor: '#af0e0e',
                    backgroundColor: 'rgba(175, 14, 14, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                        rtl: true
                    },
                    title: {
                        display: true,
                        text: 'إحصائيات الحضور الأسبوعية'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100
                    }
                }
            }
        });
    }

    updateAttendanceChart() {
        if (this.charts.attendance) {
            const filter = document.getElementById('attendance-chart-filter').value;
            let newData;
            
            switch(filter) {
                case 'week':
                    newData = [85, 92, 78, 88, 95, 90, 87];
                    break;
                case 'month':
                    newData = [85, 88, 82, 90, 87, 89, 91, 86, 84, 88, 92, 85];
                    break;
                case 'year':
                    newData = [85, 87, 89, 88, 86, 90, 92, 91, 89, 87, 88, 90];
                    break;
            }
            
            this.charts.attendance.data.datasets[0].data = newData;
            this.charts.attendance.update();
        }
    }

    updateDashboardCharts() {
        // يمكن تحديث المخططات بالبيانات الفعلية هنا
    }

    // ===== إدارة المستخدمين =====
    async loadUsers() {
        try {
            this.showLoading();
            const response = await schoolDB.getUsers();
            
            if (response.success) {
                this.allUsers = response.data;
                this.renderUsers();
                this.updateUserStats(this.allUsers);
            } else {
                throw new Error(response.message);
            }
        } catch (error) {
            console.error('خطأ في تحميل بيانات المستخدمين:', error);
            this.showToast('حدث خطأ في تحميل بيانات المستخدمين', 'error');
        } finally {
            this.hideLoading();
        }
    }

    renderUsers() {
        if (this.currentView === 'cards') {
            this.renderUsersCards(this.allUsers);
        } else {
            this.renderUsersTable(this.allUsers);
        }
    }

    renderUsersTable(users) {
        const tbody = document.getElementById('users-table-body');
        if (!tbody) return;

        if (users.length === 0) {
            tbody.innerHTML = `
                <tr class="loading-row">
                    <td colspan="6" class="text-center">
                        <div class="no-data">
                            <i class="fas fa-users"></i>
                            <p>لا توجد مستخدمين لعرضهم</p>
                            <button class="primary-button" onclick="adminDashboard.showAddUserForm()">
                                <i class="fas fa-plus"></i>
                                إضافة مستخدم جديد
                            </button>
                        </div>
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = users.map(user => `
            <tr>
                <td>
                    <div class="user-info">
                        <img src="${user.avatar || '../image/default-avatar.png'}" 
                             alt="${user.name}" 
                             class="user-avatar-small"
                             onerror="this.src='../image/default-avatar.png'">
                        <span>${user.name}</span>
                    </div>
                </td>
                <td>${user.username}</td>
                <td>
                    <span class="badge badge-${this.getRoleBadgeClass(user.role)}">
                        ${this.translateRole(user.role)}
                    </span>
                </td>
                <td>${user.email}</td>
                <td>
                    <span class="status-badge ${user.active ? 'active' : 'inactive'}">
                        <i class="fas fa-circle"></i>
                        ${user.active ? 'نشط' : 'غير نشط'}
                    </span>
                </td>
                <td>
                    <div class="action-buttons">
                        <button class="edit-btn tooltip" 
                                data-id="${user.id}" 
                                onclick="adminDashboard.editUser(${user.id})"
                                aria-label="تعديل ${user.name}">
                            <i class="fas fa-edit"></i>
                            <span class="tooltip-text">تعديل المستخدم</span>
                        </button>
                        <button class="password-btn tooltip" 
                                data-id="${user.id}"
                                onclick="adminDashboard.showChangePasswordModal(${user.id})"
                                aria-label="تغيير كلمة مرور ${user.name}">
                            <i class="fas fa-key"></i>
                            <span class="tooltip-text">تغيير كلمة المرور</span>
                        </button>
                        <button class="delete-btn tooltip" 
                                data-id="${user.id}"
                                onclick="adminDashboard.deleteUser(${user.id})"
                                aria-label="حذف ${user.name}">
                            <i class="fas fa-trash"></i>
                            <span class="tooltip-text">حذف المستخدم</span>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');

        this.updateUsersCount(users.length);
    }

    renderUsersCards(users) {
        const container = document.getElementById('users-table-body');
        if (!container) return;

        if (users.length === 0) {
            container.innerHTML = `
                <div class="no-data">
                    <i class="fas fa-users"></i>
                    <p>لا توجد مستخدمين لعرضهم</p>
                    <button class="primary-button" onclick="adminDashboard.showAddUserForm()">
                        <i class="fas fa-plus"></i>
                        إضافة مستخدم جديد
                    </button>
                </div>
            `;
            return;
        }

        container.innerHTML = users.map(user => `
            <div class="user-card">
                <div class="user-card-avatar">
                    ${user.avatar && user.avatar !== '../image/default-avatar.png' ? 
                        `<img src="${user.avatar}" alt="${user.name}" onerror="this.src='../image/default-avatar.png'">` :
                        `<div class="avatar-placeholder">
                            <i class="fas fa-user"></i>
                        </div>`
                    }
                </div>
                <div class="user-card-info">
                    <h3 class="user-card-name">${user.name}</h3>
                    <div class="user-card-role">${this.translateRole(user.role)}</div>
                    <div class="user-card-email">${user.email}</div>
                    <div class="user-card-phone">${user.phone || 'لا يوجد'}</div>
                    <div class="user-card-status ${user.active ? 'active' : 'inactive'}">
                        ${user.active ? 'نشط' : 'غير نشط'}
                    </div>
                    <div class="user-card-actions">
                        <button class="user-card-action-btn user-card-edit" 
                                onclick="adminDashboard.editUser(${user.id})"
                                aria-label="تعديل ${user.name}">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="user-card-action-btn user-card-password"
                                onclick="adminDashboard.showChangePasswordModal(${user.id})"
                                aria-label="تغيير كلمة مرور ${user.name}">
                            <i class="fas fa-key"></i>
                        </button>
                        <button class="user-card-action-btn user-card-delete"
                                onclick="adminDashboard.deleteUser(${user.id})"
                                aria-label="حذف ${user.name}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `).join('');

        this.updateUsersCount(users.length);
    }

    switchView(view) {
        this.currentView = view;
        this.renderUsers();
    }

    getRoleBadgeClass(role) {
        const classes = {
            'admin': 'danger',
            'teacher': 'primary',
            'student': 'success',
            'parent': 'info'
        };
        return classes[role] || 'warning';
    }

    toggleClassField(role) {
        const classField = document.getElementById('class-field');
        const classSelect = document.getElementById('user-class');
        
        if (role === 'student') {
            classField.style.display = 'block';
            this.loadClassesForSelect();
        } else {
            classField.style.display = 'none';
        }
    }

    async loadClassesForSelect() {
        try {
            const response = await schoolDB.getClasses();
            if (response.success) {
                const classSelect = document.getElementById('user-class');
                classSelect.innerHTML = '<option value="">اختر الفصل</option>' +
                    response.data.map(cls => 
                        `<option value="${cls.id}">${cls.name}</option>`
                    ).join('');
            }
        } catch (error) {
            console.error('خطأ في تحميل الفصول:', error);
        }
    }

    showAddUserForm() {
        document.getElementById('user-modal-title').textContent = 'إضافة مستخدم جديد';
        document.getElementById('user-form').reset();
        document.getElementById('user-id').value = '';
        document.getElementById('class-field').style.display = 'none';
        document.getElementById('user-modal').style.display = 'flex';
    }

    async saveUser() {
        try {
            this.showLoading();
            
            const userData = {
                name: document.getElementById('user-name').value,
                username: document.getElementById('user-username').value,
                password: document.getElementById('user-password').value,
                email: document.getElementById('user-email').value,
                phone: document.getElementById('user-phone').value,
                role: document.getElementById('user-role').value,
                active: document.getElementById('user-active').value === 'true',
                avatar: this.tempAvatar || '../image/default-avatar.png'
            };

            // إضافة الفصل إذا كان المستخدم طالب
            if (userData.role === 'student') {
                userData.class_id = document.getElementById('user-class').value;
            }

            const userId = document.getElementById('user-id').value;
            let response;

            if (userId) {
                response = await schoolDB.updateUser(userId, userData);
            } else {
                response = await schoolDB.addUser(userData);
            }

            if (response.success) {
                this.showToast(response.message, 'success');
                this.closeUserModal();
                await this.loadUsers();
                this.tempAvatar = null;
            } else {
                throw new Error(response.message);
            }
        } catch (error) {
            console.error('خطأ في حفظ المستخدم:', error);
            this.showToast(error.message, 'error');
        } finally {
            this.hideLoading();
        }
    }

    async editUser(userId) {
        try {
            const user = this.allUsers.find(u => u.id == userId);
            if (!user) {
                throw new Error('المستخدم غير موجود');
            }

            document.getElementById('user-modal-title').textContent = 'تعديل بيانات المستخدم';
            document.getElementById('user-id').value = user.id;
            document.getElementById('user-name').value = user.name;
            document.getElementById('user-username').value = user.username;
            document.getElementById('user-password').value = '';
            document.getElementById('user-email').value = user.email;
            document.getElementById('user-phone').value = user.phone || '';
            document.getElementById('user-role').value = user.role;
            document.getElementById('user-active').value = user.active.toString();

            this.toggleClassField(user.role);
            if (user.role === 'student' && user.class_id) {
                await this.loadClassesForSelect();
                document.getElementById('user-class').value = user.class_id;
            }

            document.getElementById('user-modal').style.display = 'flex';
            
        } catch (error) {
            console.error('خطأ في تحميل بيانات المستخدم:', error);
            this.showToast(error.message, 'error');
        }
    }

    async deleteUser(userId) {
        if (!confirm('هل أنت متأكد من حذف هذا المستخدم؟')) return;

        try {
            this.showLoading();
            const response = await schoolDB.deleteUser(userId);
            
            if (response.success) {
                this.showToast(response.message, 'success');
                await this.loadUsers();
            } else {
                throw new Error(response.message);
            }
        } catch (error) {
            console.error('خطأ في حذف المستخدم:', error);
            this.showToast(error.message, 'error');
        } finally {
            this.hideLoading();
        }
    }

    async changePassword(event) {
        event.preventDefault();
        
        try {
            this.showLoading();
            
            const userId = document.getElementById('password-user-id').value;
            const newPassword = document.getElementById('new-password').value;
            const confirmPassword = document.getElementById('confirm-password').value;

            if (newPassword !== confirmPassword) {
                throw new Error('كلمات المرور غير متطابقة');
            }

            const response = await schoolDB.changePassword(userId, newPassword);
            
            if (response.success) {
                this.showToast(response.message, 'success');
                this.closeChangePasswordModal();
            } else {
                throw new Error(response.message);
            }
        } catch (error) {
            console.error('خطأ في تغيير كلمة المرور:', error);
            this.showToast(error.message, 'error');
        } finally {
            this.hideLoading();
        }
    }

    showChangePasswordModal(userId) {
        document.getElementById('password-user-id').value = userId;
        document.getElementById('change-password-modal').style.display = 'flex';
    }

    closeChangePasswordModal() {
        document.getElementById('change-password-modal').style.display = 'none';
        document.getElementById('change-password-form').reset();
    }

    closeUserModal() {
        document.getElementById('user-modal').style.display = 'none';
        this.tempAvatar = null;
    }

    // ===== إدارة الفصول =====
    async loadClasses() {
        try {
            this.showLoading();
            const response = await schoolDB.getClasses();
            
            if (response.success) {
                this.allClasses = response.data;
                this.renderClassesTable(this.allClasses);
                this.updateClassesStats(this.allClasses);
            }
        } catch (error) {
            console.error('خطأ في تحميل بيانات الفصول:', error);
            this.showToast('حدث خطأ في تحميل بيانات الفصول', 'error');
        } finally {
            this.hideLoading();
        }
    }

    renderClassesTable(classes) {
        const tbody = document.getElementById('classes-table-body');
        if (!tbody) return;

        if (classes.length === 0) {
            tbody.innerHTML = `
                <tr class="loading-row">
                    <td colspan="6" class="text-center">
                        <div class="no-data">
                            <i class="fas fa-school"></i>
                            <p>لا توجد فصول لعرضها</p>
                            <button class="primary-button" onclick="adminDashboard.showAddClassForm()">
                                <i class="fas fa-plus"></i>
                                إضافة فصل جديد
                            </button>
                        </div>
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = classes.map(cls => `
            <tr>
                <td>${cls.name}</td>
                <td>${cls.section}</td>
                <td>${cls.level}</td>
                <td>${cls.teacher_name}</td>
                <td>${cls.students_count}</td>
                <td>
                    <div class="action-buttons">
                        <button class="view-btn" data-id="${cls.id}">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="edit-btn" data-id="${cls.id}">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="delete-btn" data-id="${cls.id}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    showAddClassForm() {
        this.showToast('نموذج إضافة فصل جديد قريباً', 'info');
    }

    // ===== إدارة المواد =====
    async loadSubjects() {
        try {
            this.showLoading();
            const response = await schoolDB.getSubjects();
            
            if (response.success) {
                this.allSubjects = response.data;
                this.renderSubjectsTable(this.allSubjects);
                this.updateSubjectsStats(this.allSubjects);
            }
        } catch (error) {
            console.error('خطأ في تحميل بيانات المواد:', error);
            this.showToast('حدث خطأ في تحميل بيانات المواد', 'error');
        } finally {
            this.hideLoading();
        }
    }

    renderSubjectsTable(subjects) {
        const tbody = document.getElementById('subjects-table-body');
        if (!tbody) return;

        if (subjects.length === 0) {
            tbody.innerHTML = `
                <tr class="loading-row">
                    <td colspan="4" class="text-center">
                        <div class="no-data">
                            <i class="fas fa-book"></i>
                            <p>لا توجد مواد لعرضها</p>
                            <button class="primary-button" onclick="adminDashboard.showAddSubjectForm()">
                                <i class="fas fa-plus"></i>
                                إضافة مادة جديدة
                            </button>
                        </div>
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = subjects.map(subject => `
            <tr>
                <td>${subject.name}</td>
                <td>${subject.code}</td>
                <td>${subject.description}</td>
                <td>
                    <div class="action-buttons">
                        <button class="edit-btn" data-id="${subject.id}">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="delete-btn" data-id="${subject.id}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    showAddSubjectForm() {
        this.showToast('نموذج إضافة مادة جديدة قريباً', 'info');
    }

    // ===== نظام الإشعارات =====
    async loadNotifications() {
        try {
            const response = await schoolDB.getNotifications();
            if (response.success) {
                this.allNotifications = response.data;
                this.renderNotifications(this.allNotifications);
            }
        } catch (error) {
            console.error('خطأ في تحميل الإشعارات:', error);
        }
    }

    renderNotifications(notifications) {
        const container = document.getElementById('notifications-list');
        if (!container) return;

        if (notifications.length === 0) {
            container.innerHTML = `
                <div class="no-data">
                    <i class="fas fa-bell"></i>
                    <p>لا توجد إشعارات لعرضها</p>
                </div>
            `;
            return;
        }

        container.innerHTML = notifications.map(notification => `
            <div class="notification-item">
                <div class="notification-header">
                    <h3>${notification.title}</h3>
                    <span class="notification-date">${this.formatDate(notification.created_at)}</span>
                </div>
                <p class="notification-content">${notification.content}</p>
                <div class="notification-footer">
                    <span class="notification-recipients">المستلمون: ${this.translateRecipients(notification.recipients)}</span>
                    <div class="notification-actions">
                        <button class="edit-btn" aria-label="تعديل الإشعار">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="delete-btn" aria-label="حذف الإشعار">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    translateRecipients(recipients) {
        const translations = {
            'all': 'الجميع',
            'students': 'الطلاب',
            'teachers': 'المعلمون',
            'parents': 'أولياء الأمور'
        };
        
        if (Array.isArray(recipients)) {
            return recipients.map(r => translations[r] || r).join('، ');
        }
        return translations[recipients] || recipients;
    }

    async sendNotification() {
        try {
            this.showLoading();
            
            const notificationData = {
                title: document.getElementById('notification-title').value,
                content: document.getElementById('notification-content').value,
                recipients: Array.from(document.getElementById('notification-recipients').selectedOptions)
                    .map(option => option.value),
                priority: document.getElementById('notification-priority').value,
                created_by: JSON.parse(localStorage.getItem('currentUser')).id
            };

            const response = await schoolDB.addNotification(notificationData);
            
            if (response.success) {
                this.showToast('تم إرسال الإشعار بنجاح', 'success');
                this.closeNotificationModal();
                await this.loadNotifications();
            } else {
                throw new Error(response.message);
            }
        } catch (error) {
            console.error('خطأ في إرسال الإشعار:', error);
            this.showToast(error.message, 'error');
        } finally {
            this.hideLoading();
        }
    }

    showAddNotificationForm() {
        document.getElementById('notification-form').reset();
        document.getElementById('notification-modal').style.display = 'flex';
    }

    closeNotificationModal() {
        document.getElementById('notification-modal').style.display = 'none';
    }

    // ===== نظام التقارير المتقدم =====
    async generateReport() {
        try {
            this.showLoading();
            
            const reportType = document.getElementById('report-type').value;
            const startDate = document.getElementById('report-start-date').value;
            const endDate = document.getElementById('report-end-date').value;
            const format = document.getElementById('report-format').value;
            
            const options = {
                includeCharts: document.getElementById('include-charts').checked,
                includeSummary: document.getElementById('include-summary').checked,
                colorCoded: document.getElementById('color-coded').checked
            };

            let reportData = await this.generateReportData(reportType, startDate, endDate);

            if (format === 'pdf') {
                await this.generatePDFReport(reportData, reportType, options);
            } else {
                this.showToast(`تم إنشاء تقرير ${this.translateReportType(reportType)} بنجاح`, 'success');
            }

        } catch (error) {
            console.error('خطأ في إنشاء التقرير:', error);
            this.showToast(error.message, 'error');
        } finally {
            this.hideLoading();
            this.closeReportModal();
        }
    }

    async generateReportData(reportType, startDate, endDate) {
        // محاكاة بيانات التقرير
        const reports = {
            attendance: {
                title: 'تقرير الحضور',
                overall: 87,
                data: this.generateAttendanceData()
            },
            grades: {
                title: 'تقرير الدرجات',
                overall: 85,
                data: this.generateGradesData()
            },
            students: {
                title: 'تقرير الطلاب',
                total: this.allUsers.filter(u => u.role === 'student').length,
                data: this.generateStudentsData()
            },
            teachers: {
                title: 'تقرير المعلمين',
                total: this.allUsers.filter(u => u.role === 'teacher').length,
                data: this.generateTeachersData()
            },
            financial: {
                title: 'تقرير مالي',
                total: 150000,
                data: this.generateFinancialData()
            },
            academic: {
                title: 'تقرير أكاديمي',
                data: this.generateAcademicData()
            }
        };

        return reports[reportType] || {};
    }

    generateAttendanceData() {
        return [
            { الفصل: 'الصف الأول أ', الحضور: 95, الغياب: 5 },
            { الفصل: 'الصف الثاني ب', الحضور: 82, الغياب: 18 },
            { الفصل: 'الصف الثالث ج', الحضور: 78, الغياب: 22 }
        ];
    }

    generateGradesData() {
        return [
            { المادة: 'اللغة العربية', المتوسط: 88, الأعلى: 98, الأدنى: 75 },
            { المادة: 'الرياضيات', المتوسط: 82, الأعلى: 95, الأدنى: 65 },
            { المادة: 'العلوم', المتوسط: 85, الأعلى: 96, الأدنى: 70 }
        ];
    }

    generateStudentsData() {
        return this.allUsers
            .filter(u => u.role === 'student')
            .map(student => ({
                الاسم: student.name,
                الصف: student.class_id || 'غير محدد',
                الحالة: student.active ? 'نشط' : 'غير نشط'
            }));
    }

    generateTeachersData() {
        return this.allUsers
            .filter(u => u.role === 'teacher')
            .map(teacher => ({
                الاسم: teacher.name,
                البريد: teacher.email,
                الحالة: teacher.active ? 'نشط' : 'غير نشط'
            }));
    }

    generateFinancialData() {
        return [
            { البند: 'الرسوم الدراسية', المبلغ: 100000 },
            { البند: 'النشاطات', المبلغ: 20000 },
            { البند: 'التبرعات', المبلغ: 30000 }
        ];
    }

    generateAcademicData() {
        return [
            { المؤشر: 'متوسط الدرجات', القيمة: 85 },
            { المؤشر: 'نسبة النجاح', القيمة: 92 },
            { المؤشر: 'نسبة الحضور', القيمة: 87 }
        ];
    }

    async generatePDFReport(reportData, reportType, options) {
        if (typeof jsPDF !== 'undefined') {
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();
            
            // إضافة رأس التقرير
            this.addReportHeader(doc, reportData.title);
            
            // إضافة محتوى التقرير
            this.addReportContent(doc, reportData, options);
            
            // إضافة تذييل التقرير
            this.addReportFooter(doc);
            
            // حفظ الملف
            const fileName = `تقرير_${reportType}_${new Date().toISOString().split('T')[0]}.pdf`;
            doc.save(fileName);
        } else {
            this.showToast('لم يتم تحميل مكتبة PDF، جاري التحميل...', 'warning');
            // نسخة احتياطية
            this.downloadJSONReport(reportData, reportType);
        }
    }

    addReportHeader(doc, title) {
        const schoolName = this.schoolSettings.schoolName || 'مدرستي';
        const currentDate = new Date().toLocaleDateString('ar-SA');
        
        // خلفية الرأس
        doc.setFillColor(175, 14, 14);
        doc.rect(0, 0, 210, 40, 'F');
        
        // النص في الرأس
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(20);
        doc.setFont('Cairo', 'bold');
        doc.text(schoolName, 105, 15, { align: 'center' });
        
        doc.setFontSize(14);
        doc.text(title, 105, 25, { align: 'center' });
        
        // تاريخ التقرير
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(10);
        doc.text(`تاريخ التقرير: ${currentDate}`, 15, 50);
    }

    addReportContent(doc, reportData, options) {
        let yPosition = 60;
        
        if (options.includeSummary) {
            doc.setFontSize(12);
            doc.setFont('Cairo', 'bold');
            doc.text('ملخص تنفيذي:', 15, yPosition);
            yPosition += 10;
            
            doc.setFont('Cairo', 'normal');
            const summary = this.generateExecutiveSummary(reportData);
            const splitSummary = doc.splitTextToSize(summary, 180);
            doc.text(splitSummary, 15, yPosition);
            yPosition += splitSummary.length * 6 + 10;
        }

        // إضافة البيانات الرئيسية
        doc.setFontSize(12);
        doc.setFont('Cairo', 'bold');
        doc.text('البيانات التفصيلية:', 15, yPosition);
        yPosition += 10;

        // إضافة البيانات في جدول
        this.addReportTable(doc, reportData.data, yPosition);
    }

    addReportTable(doc, data, startY) {
        let y = startY;
        
        if (data && data.length > 0) {
            const headers = Object.keys(data[0]);
            const columnWidth = 180 / headers.length;
            
            // رأس الجدول
            doc.setFillColor(175, 14, 14);
            doc.rect(15, y, 180, 10, 'F');
            doc.setTextColor(255, 255, 255);
            
            headers.forEach((header, index) => {
                doc.text(header, 15 + (index * columnWidth) + (columnWidth / 2), y + 7, { align: 'center' });
            });
            
            y += 10;
            doc.setTextColor(0, 0, 0);
            
            // بيانات الجدول
            data.forEach((row, rowIndex) => {
                if (y > 270) {
                    doc.addPage();
                    y = 20;
                }
                
                headers.forEach((header, colIndex) => {
                    const value = row[header] || '';
                    doc.text(String(value), 15 + (colIndex * columnWidth) + (columnWidth / 2), y + 7, { align: 'center' });
                });
                
                y += 10;
            });
        }
    }

    addReportFooter(doc) {
        const footerText = `تم إنشاء هذا التقرير تلقائياً من نظام إدارة المدرسة - ${this.schoolSettings.schoolName || 'مدرستي'}`;
        doc.setFontSize(8);
        doc.setTextColor(128, 128, 128);
        doc.text(footerText, 105, 290, { align: 'center' });
    }

    generateExecutiveSummary(reportData) {
        if (reportData.overall) {
            return `إجمالي النسبة: ${reportData.overall}% - بناءً على تحليل ${reportData.data?.length || 0} عنصر`;
        } else if (reportData.total) {
            return `إجمالي العدد: ${reportData.total} - ${reportData.data?.length || 0} سجل`;
        }
        return `تحليل ${reportData.data?.length || 0} عنصر من البيانات`;
    }

    translateReportType(type) {
        const types = {
            'attendance': 'الحضور',
            'grades': 'الدرجات',
            'students': 'الطلاب',
            'teachers': 'المعلمين',
            'financial': 'المالي',
            'academic': 'الأكاديمي'
        };
        return types[type] || type;
    }

    downloadJSONReport(data, reportType) {
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `تقرير_${reportType}_${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }

    generateQuickReport() {
        document.getElementById('report-modal').style.display = 'flex';
    }

    closeReportModal() {
        document.getElementById('report-modal').style.display = 'none';
    }

    // ===== الإعدادات الحقيقية =====
    loadSchoolSettings() {
        const defaultSettings = {
            schoolName: 'مدرستي',
            schoolEmail: 'info@school.com',
            schoolPhone: '0123456789',
            schoolAddress: 'شارع المدارس، المدينة',
            academicYear: '2023-2024',
            currentTerm: 'الفصل الأول',
            theme: 'light',
            language: 'ar'
        };
        
        const savedSettings = localStorage.getItem('schoolSettings');
        return savedSettings ? { ...defaultSettings, ...JSON.parse(savedSettings) } : defaultSettings;
    }

    saveSchoolSettings(settings) {
        localStorage.setItem('schoolSettings', JSON.stringify(settings));
        this.schoolSettings = settings;
    }

    async saveGeneralSettings() {
        try {
            const settings = {
                schoolName: document.getElementById('school-name').value,
                schoolEmail: document.getElementById('school-email').value,
                schoolPhone: document.getElementById('school-phone').value,
                schoolAddress: document.getElementById('school-address').value
            };

            this.saveSchoolSettings({ ...this.schoolSettings, ...settings });
            this.showToast('تم حفظ الإعدادات العامة بنجاح', 'success');
        } catch (error) {
            console.error('خطأ في حفظ الإعدادات:', error);
            this.showToast('حدث خطأ في حفظ الإعدادات', 'error');
        }
    }

    async saveSystemSettings() {
        try {
            const settings = {
                academicYear: document.getElementById('academic-year').value,
                currentTerm: document.getElementById('current-term').value,
                theme: document.getElementById('theme').value,
                language: document.getElementById('language').value
            };

            this.saveSchoolSettings({ ...this.schoolSettings, ...settings });
            
            // تطبيق الإعدادات فوراً
            this.applySystemSettings(settings);
            
            this.showToast('تم حفظ إعدادات النظام بنجاح', 'success');
        } catch (error) {
            console.error('خطأ في حفظ الإعدادات:', error);
            this.showToast('حدث خطأ في حفظ الإعدادات', 'error');
        }
    }

    applySystemSettings(settings) {
        // تطبيق السمة
        if (settings.theme === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
        } else {
            document.documentElement.removeAttribute('data-theme');
        }

        // تطبيق اللغة
        if (settings.language) {
            document.documentElement.lang = settings.language;
        }
    }

    loadSettings() {
        // تحميل الإعدادات إلى النماذج
        const settings = this.schoolSettings;
        
        document.getElementById('school-name').value = settings.schoolName;
        document.getElementById('school-email').value = settings.schoolEmail;
        document.getElementById('school-phone').value = settings.schoolPhone;
        document.getElementById('school-address').value = settings.schoolAddress;
        document.getElementById('academic-year').value = settings.academicYear;
        document.getElementById('current-term').value = settings.currentTerm;
        document.getElementById('theme').value = settings.theme;
        document.getElementById('language').value = settings.language;
        
        // تطبيق الإعدادات الحالية
        this.applySystemSettings(settings);
    }

    // ===== أدوات النظام =====
    async exportData() {
        try {
            this.showLoading();
            const response = await schoolDB.exportData();
            if (response.success) {
                this.showToast('تم تصدير البيانات بنجاح', 'success');
            }
        } catch (error) {
            this.showToast('حدث خطأ في تصدير البيانات', 'error');
        } finally {
            this.hideLoading();
        }
    }

    async importData() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = async (e) => {
            const file = e.target.files[0];
            if (file) {
                try {
                    this.showLoading();
                    const response = await schoolDB.importData(file);
                    if (response.success) {
                        this.showToast('تم استيراد البيانات بنجاح', 'success');
                        await this.loadInitialData();
                    }
                } catch (error) {
                    this.showToast('حدث خطأ في استيراد البيانات', 'error');
                } finally {
                    this.hideLoading();
                }
            }
        };
        input.click();
    }

    async clearCache() {
        if (confirm('هل أنت متأكد من مسح الذاكرة المؤقتة؟')) {
            localStorage.removeItem('schoolSettings');
            this.showToast('تم مسح الذاكرة المؤقتة', 'success');
        }
    }

    async resetSystem() {
        if (confirm('هل أنت متأكد من إعادة تعيين النظام؟ سيتم حذف جميع البيانات.')) {
            try {
                this.showLoading();
                const response = await schoolDB.clearAllData();
                if (response.success) {
                    this.showToast('تم إعادة تعيين النظام بنجاح', 'success');
                    setTimeout(() => {
                        window.location.reload();
                    }, 2000);
                }
            } catch (error) {
                this.showToast('حدث خطأ في إعادة التعيين', 'error');
            } finally {
                this.hideLoading();
            }
        }
    }

    // ===== النشاطات =====
    async loadActivities() {
        try {
            const response = await schoolDB.getActivities(5);
            if (response.success) {
                this.renderActivities(response.data);
            }
        } catch (error) {
            console.error('خطأ في تحميل النشاطات:', error);
        }
    }

    renderActivities(activities) {
        const container = document.getElementById('activity-list');
        if (!container) return;

        container.innerHTML = activities.map(activity => `
            <div class="activity-item">
                <div class="activity-icon">
                    <i class="fas fa-${this.getActivityIcon(activity.type)}"></i>
                </div>
                <div class="activity-details">
                    <p class="activity-text">${activity.message}</p>
                    <span class="activity-time">${this.formatTime(activity.created_at)}</span>
                </div>
            </div>
        `).join('');
    }

    getActivityIcon(type) {
        const icons = {
            'user_added': 'user-plus',
            'user_updated': 'user-edit',
            'user_deleted': 'user-times',
            'class_added': 'school',
            'subject_added': 'book',
            'notification_sent': 'bell',
            'password_changed': 'key',
            'data_exported': 'download',
            'data_imported': 'upload'
        };
        return icons[type] || 'info-circle';
    }

    // ===== الإحصائيات =====
    async loadStats() {
        try {
            const response = await schoolDB.getStats();
            if (response.success) {
                this.updateStats(response.data);
            }
        } catch (error) {
            console.error('خطأ في تحميل الإحصائيات:', error);
        }
    }

    updateStats(stats) {
        document.getElementById('students-count').textContent = stats.students;
        document.getElementById('teachers-count').textContent = stats.teachers;
        document.getElementById('classes-count').textContent = stats.classes;
        document.getElementById('subjects-count').textContent = stats.subjects;
    }

    updateUserStats(users) {
        const students = users.filter(user => user.role === 'student').length;
        const teachers = users.filter(user => user.role === 'teacher').length;
        
        document.getElementById('students-count').textContent = students;
        document.getElementById('teachers-count').textContent = teachers;
    }

    updateClassesStats(classes) {
        document.getElementById('classes-count').textContent = classes.length;
    }

    updateSubjectsStats(subjects) {
        document.getElementById('subjects-count').textContent = subjects.length;
    }

    updateUsersCount(count) {
        const usersCountElement = document.getElementById('users-count');
        if (usersCountElement) {
            usersCountElement.textContent = `عرض ${count} من ${count} مستخدم`;
        }
    }

    // ===== البحث والتصفية =====
    filterUsers(searchTerm) {
        const filteredUsers = this.allUsers.filter(user => 
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase())
        );

        this.renderUsers();
    }

    filterUsersByRole(role) {
        if (role === 'all') {
            this.renderUsers();
        } else {
            const filteredUsers = this.allUsers.filter(user => user.role === role);
            if (this.currentView === 'cards') {
                this.renderUsersCards(filteredUsers);
            } else {
                this.renderUsersTable(filteredUsers);
            }
        }
    }

    filterClasses(searchTerm) {
        const filteredClasses = this.allClasses.filter(cls => 
            cls.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            cls.section.toLowerCase().includes(searchTerm.toLowerCase())
        );
        this.renderClassesTable(filteredClasses);
    }

    filterClassesByLevel(level) {
        if (level === 'all') {
            this.renderClassesTable(this.allClasses);
        } else {
            const filteredClasses = this.allClasses.filter(cls => cls.level === level);
            this.renderClassesTable(filteredClasses);
        }
    }

    filterSubjects(searchTerm) {
        const filteredSubjects = this.allSubjects.filter(subject => 
            subject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            subject.code.toLowerCase().includes(searchTerm.toLowerCase())
        );
        this.renderSubjectsTable(filteredSubjects);
    }

    // ===== دوال مساعدة =====
    showLoading() {
        const spinner = document.getElementById('loading-spinner');
        if (spinner) {
            spinner.style.display = 'flex';
        }
    }

    hideLoading() {
        const spinner = document.getElementById('loading-spinner');
        if (spinner) {
            spinner.style.display = 'none';
        }
    }

    showToast(message, type = 'info') {
        try {
            let toastContainer = document.getElementById('toast-container');
            if (!toastContainer) {
                toastContainer = document.createElement('div');
                toastContainer.id = 'toast-container';
                toastContainer.className = 'toast-container';
                document.body.appendChild(toastContainer);
            }

            const toast = document.createElement('div');
            toast.className = `toast toast-${type}`;
            toast.innerHTML = `
                <div class="toast-content">
                    <i class="fas fa-${this.getToastIcon(type)}"></i>
                    <span>${message}</span>
                </div>
                <button class="toast-close" onclick="this.parentElement.remove()">
                    <i class="fas fa-times"></i>
                </button>
            `;
            toast.style.animation = 'toastSlideIn 0.3s ease';

            toastContainer.appendChild(toast);

            setTimeout(() => {
                if (toast.parentNode) {
                    toast.style.animation = 'toastSlideOut 0.3s ease';
                    setTimeout(() => toast.remove(), 300);
                }
            }, 5000);
        } catch (error) {
            console.error('Error showing toast:', error);
        }
    }

    getToastIcon(type) {
        const icons = {
            'success': 'check-circle',
            'error': 'exclamation-circle',
            'warning': 'exclamation-triangle',
            'info': 'info-circle'
        };
        return icons[type] || 'info-circle';
    }

    translateRole(role) {
        const roles = {
            'admin': 'مسؤول',
            'teacher': 'معلم',
            'student': 'طالب',
            'parent': 'ولي أمر'
        };
        return roles[role] || role;
    }

    formatTime(dateString) {
        try {
            const date = new Date(dateString);
            const now = new Date();
            const diff = now - date;
            
            const minutes = Math.floor(diff / 60000);
            const hours = Math.floor(diff / 3600000);
            const days = Math.floor(diff / 86400000);
            
            if (minutes < 1) return 'الآن';
            if (minutes < 60) return `منذ ${minutes} دقيقة`;
            if (hours < 24) return `منذ ${hours} ساعة`;
            if (days < 7) return `منذ ${days} يوم`;
            
            return date.toLocaleDateString('ar-SA');
        } catch (error) {
            return dateString;
        }
    }

    formatDate(dateString) {
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('ar-SA');
        } catch (error) {
            return dateString;
        }
    }

    // ===== الوظائف الإضافية =====
    showProfile() {
        this.showToast('صفحة الملف الشخصي قريباً', 'info');
    }

    showNotifications() {
        this.showToast('قائمة الإشعارات الكاملة قريباً', 'info');
    }

    showAllActivities() {
        this.showToast('جميع النشاطات قريباً', 'info');
    }

    handleQuickAction(action) {
        const actions = {
            'add-user': () => this.showAddUserForm(),
            'add-class': () => this.showAddClassForm(),
            'send-notification': () => this.showAddNotificationForm(),
            'generate-report': () => this.generateQuickReport()
        };

        if (actions[action]) {
            actions[action]();
        }
    }

    generateReport(type) {
        document.getElementById('report-type').value = type;
        this.generateQuickReport();
    }

    loadReports() {
        // يمكن تحميل التقارير المحفوظة هنا
    }
}

// جعل الكائن متاحاً globally
const adminDashboard = new AdminDashboard();

// وظيفة تبديل القائمة الجانبية
function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    sidebar.classList.toggle('active');
}


