// database.js - قاعدة بيانات وهمية تعمل في المتصفح
class SchoolDatabase {
    constructor() {
        this.init();
    }

    init() {
        // تهيئة البيانات من localStorage أو استخدام البيانات الافتراضية
        if (!localStorage.getItem('school_users')) {
            this.initializeDefaultData();
        }
        this.loadData();
        this.initializeDemoData();
    }

    initializeDemoData() {
        // إضافة بيانات تجريبية إضافية
        if (!localStorage.getItem('demo_data_initialized')) {
            this.addDemoData();
            localStorage.setItem('demo_data_initialized', 'true');
        }
    }

    addDemoData() {
        // إضافة طلاب إضافيين
        const additionalStudents = [
            {
                id: this.generateId(),
                name: "سارة أحمد",
                username: "student3",
                password: "123456",
                email: "sara@school.com",
                phone: "0123456783",
                role: "student",
                avatar: "../image/default-avatar.png",
                active: true,
                class_id: 1,
                created_at: new Date().toISOString()
            },
            {
                id: this.generateId(),
                name: "يوسف محمد",
                username: "student4",
                password: "123456",
                email: "yousef@school.com",
                phone: "0123456784",
                role: "student",
                avatar: "../image/default-avatar.png",
                active: true,
                class_id: 2,
                created_at: new Date().toISOString()
            }
        ];

        this.users.push(...additionalStudents);
        this.saveData();

        // إضافة معلمين إضافيين
        const additionalTeachers = [
            {
                id: this.generateId(),
                name: "أستاذة مريم حسن",
                username: "teacher2",
                password: "123456",
                email: "maryam@school.com",
                phone: "0123456790",
                role: "teacher",
                avatar: "../image/default-avatar.png",
                active: true,
                created_at: new Date().toISOString()
            }
        ];

        this.users.push(...additionalTeachers);
        this.saveData();
    }

    initializeDefaultData() {
        const defaultData = {
            users: [
                {
                    id: 1,
                    name: "مدير النظام",
                    username: "admin",
                    password: "123456",
                    email: "admin@school.com",
                    phone: "0123456789",
                    role: "admin",
                    avatar: "../image/avatar.jpg",
                    active: true,
                    created_at: new Date().toISOString()
                },
                {
                    id: 2,
                    name: "أستاذ أحمد محمد",
                    username: "teacher1",
                    password: "123456",
                    email: "ahmed@school.com",
                    phone: "0123456780",
                    role: "teacher",
                    avatar: "../image/default-avatar.png",
                    active: true,
                    created_at: new Date().toISOString()
                },
                {
                    id: 3,
                    name: "فاطمة علي",
                    username: "ابراهيم قائد",
                    password: "123456",
                    email: "fatima@school.com",
                    phone: "0123456781",
                    role: "student",
                    avatar: "../image/default-avatar.png",
                    active: true,
                    class_id: 1,
                    created_at: new Date().toISOString()
                },
                {
                    id: 4,
                    name: "محمد إبراهيم",
                    username: "student2",
                    password: "123456",
                    email: "mohamed@school.com",
                    phone: "0123456782",
                    role: "student",
                    avatar: "../image/default-avatar.png",
                    active: true,
                    class_id: 1,
                    created_at: new Date().toISOString()
                }
            ],
            classes: [
                {
                    id: 1,
                    name: "الصف الأول أ",
                    section: "أ",
                    level: "ابتدائي",
                    teacher_id: 2,
                    max_students: 30,
                    created_at: new Date().toISOString()
                },
                {
                    id: 2,
                    name: "الصف الثاني ب",
                    section: "ب",
                    level: "ابتدائي",
                    teacher_id: null,
                    max_students: 25,
                    created_at: new Date().toISOString()
                },
                {
                    id: 3,
                    name: "الصف الثالث ج",
                    section: "ج",
                    level: "ابتدائي",
                    teacher_id: null,
                    max_students: 28,
                    created_at: new Date().toISOString()
                }
            ],
            subjects: [
                {
                    id: 1,
                    name: "اللغة العربية",
                    code: "ARB101",
                    description: "مادة اللغة العربية للمرحلة الابتدائية",
                    created_at: new Date().toISOString()
                },
                {
                    id: 2,
                    name: "الرياضيات",
                    code: "MATH101",
                    description: "مادة الرياضيات الأساسية",
                    created_at: new Date().toISOString()
                },
                {
                    id: 3,
                    name: "العلوم",
                    code: "SCI101",
                    description: "مادة العلوم العامة",
                    created_at: new Date().toISOString()
                },
                {
                    id: 4,
                    name: "التربية الإسلامية",
                    code: "ISL101",
                    description: "مادة التربية الإسلامية",
                    created_at: new Date().toISOString()
                }
            ],
            notifications: [
                {
                    id: 1,
                    title: "موعد الاختبارات النهائية",
                    content: "تبدأ الاختبارات النهائية للفصل الدراسي الأول يوم الأحد القادم",
                    recipients: ["all"],
                    created_by: 1,
                    created_at: new Date().toISOString()
                },
                {
                    id: 2,
                    title: "تسليم واجب اللغة العربية",
                    content: "تذكير بموعد تسليم واجب اللغة العربية يوم الخميس القادم",
                    recipients: ["student"],
                    created_by: 1,
                    created_at: new Date().toISOString()
                }
            ],
            activities: [
                {
                    id: 1,
                    type: "user_added",
                    message: "تم إضافة طالب جديد: فاطمة أحمد",
                    user_id: 1,
                    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
                },
                {
                    id: 2,
                    type: "user_added",
                    message: "تم إضافة معلم جديد: أحمد محمد",
                    user_id: 1,
                    created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
                },
                {
                    id: 3,
                    type: "notification_sent",
                    message: "تم إرسال إشعار: موعد الاختبارات النهائية",
                    user_id: 1,
                    created_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString()
                }
            ]
        };

        this.saveData(defaultData);
    }
    loadData() {
        this.users = JSON.parse(localStorage.getItem('school_users') || '[]');
        this.classes = JSON.parse(localStorage.getItem('school_classes') || '[]');
        this.subjects = JSON.parse(localStorage.getItem('school_subjects') || '[]');
        this.notifications = JSON.parse(localStorage.getItem('school_notifications') || '[]');
        this.activities = JSON.parse(localStorage.getItem('school_activities') || '[]');
    }

    saveData(data = null) {
        if (data) {
            localStorage.setItem('school_users', JSON.stringify(data.users));
            localStorage.setItem('school_classes', JSON.stringify(data.classes));
            localStorage.setItem('school_subjects', JSON.stringify(data.subjects));
            localStorage.setItem('school_notifications', JSON.stringify(data.notifications));
            localStorage.setItem('school_activities', JSON.stringify(data.activities));
        } else {
            localStorage.setItem('school_users', JSON.stringify(this.users));
            localStorage.setItem('school_classes', JSON.stringify(this.classes));
            localStorage.setItem('school_subjects', JSON.stringify(this.subjects));
            localStorage.setItem('school_notifications', JSON.stringify(this.notifications));
            localStorage.setItem('school_activities', JSON.stringify(this.activities));
        }
        this.loadData();
    }

    // === عمليات المستخدمين ===
    async getUsers(filters = {}) {
        await this.delay(300);
        let users = [...this.users];

        if (filters.role && filters.role !== 'all') {
            users = users.filter(user => user.role === filters.role);
        }

        if (filters.search) {
            const searchTerm = filters.search.toLowerCase();
            users = users.filter(user => 
                user.name.toLowerCase().includes(searchTerm) ||
                user.username.toLowerCase().includes(searchTerm) ||
                user.email.toLowerCase().includes(searchTerm)
            );
        }

        return { success: true, data: users };
    }

    async addUser(userData) {
        await this.delay(500);
        
        const newUser = {
            id: this.generateId(),
            ...userData,
            avatar: userData.avatar || '../image/default-avatar.png',
            created_at: new Date().toISOString(),
            active: userData.active !== undefined ? userData.active : true
        };

        this.users.push(newUser);
        this.saveData();

        await this.addActivity({
            type: 'user_added',
            message: `تم إضافة ${this.getRoleArabic(userData.role)} جديد: ${userData.name}`,
            user_id: this.getCurrentUser()?.id
        });

        return { success: true, data: newUser, message: 'تم إضافة المستخدم بنجاح' };
    }

    async updateUser(userId, userData) {
        await this.delay(400);
        
        const userIndex = this.users.findIndex(user => user.id == userId);
        if (userIndex === -1) {
            return { success: false, message: 'المستخدم غير موجود' };
        }

        this.users[userIndex] = { 
            ...this.users[userIndex], 
            ...userData, 
            updated_at: new Date().toISOString() 
        };
        this.saveData();

        await this.addActivity({
            type: 'user_updated',
            message: `تم تعديل بيانات المستخدم: ${userData.name}`,
            user_id: this.getCurrentUser()?.id
        });

        return { success: true, data: this.users[userIndex], message: 'تم تعديل المستخدم بنجاح' };
    }

    async deleteUser(userId) {
        await this.delay(400);
        
        const userIndex = this.users.findIndex(user => user.id == userId);
        if (userIndex === -1) {
            return { success: false, message: 'المستخدم غير موجود' };
        }

        const deletedUser = this.users[userIndex];
        this.users.splice(userIndex, 1);
        this.saveData();

        await this.addActivity({
            type: 'user_deleted',
            message: `تم حذف المستخدم: ${deletedUser.name}`,
            user_id: this.getCurrentUser()?.id
        });

        return { success: true, message: 'تم حذف المستخدم بنجاح' };
    }

    async changePassword(userId, newPassword) {
        await this.delay(400);
        
        const userIndex = this.users.findIndex(user => user.id == userId);
        if (userIndex === -1) {
            return { success: false, message: 'المستخدم غير موجود' };
        }

        this.users[userIndex].password = newPassword;
        this.users[userIndex].updated_at = new Date().toISOString();
        this.saveData();

        await this.addActivity({
            type: 'password_changed',
            message: `تم تغيير كلمة مرور المستخدم: ${this.users[userIndex].name}`,
            user_id: this.getCurrentUser()?.id
        });

        return { success: true, message: 'تم تغيير كلمة المرور بنجاح' };
    }

    // === عمليات الفصول ===
    async getClasses(filters = {}) {
        await this.delay(300);
        let classes = [...this.classes];

        if (filters.level && filters.level !== 'all') {
            classes = classes.filter(cls => cls.level === filters.level);
        }

        if (filters.search) {
            const searchTerm = filters.search.toLowerCase();
            classes = classes.filter(cls => 
                cls.name.toLowerCase().includes(searchTerm) ||
                cls.section.toLowerCase().includes(searchTerm)
            );
        }

        // إضافة عدد الطلاب لكل فصل
        classes = classes.map(cls => ({
            ...cls,
            students_count: this.users.filter(user => user.role === 'student' && user.class_id == cls.id).length,
            teacher_name: this.getTeacherName(cls.teacher_id)
        }));

        return { success: true, data: classes };
    }

    async addClass(classData) {
        await this.delay(500);
        
        const newClass = {
            id: this.generateId(),
            ...classData,
            created_at: new Date().toISOString()
        };

        this.classes.push(newClass);
        this.saveData();

        await this.addActivity({
            type: 'class_added',
            message: `تم إضافة فصل جديد: ${classData.name}`,
            user_id: this.getCurrentUser()?.id
        });

        return { success: true, data: newClass, message: 'تم إضافة الفصل بنجاح' };
    }

    async updateClass(classId, classData) {
        await this.delay(400);
        
        const classIndex = this.classes.findIndex(cls => cls.id == classId);
        if (classIndex === -1) {
            return { success: false, message: 'الفصل غير موجود' };
        }

        this.classes[classIndex] = { 
            ...this.classes[classIndex], 
            ...classData, 
            updated_at: new Date().toISOString() 
        };
        this.saveData();

        await this.addActivity({
            type: 'class_updated',
            message: `تم تعديل بيانات الفصل: ${classData.name}`,
            user_id: this.getCurrentUser()?.id
        });

        return { success: true, data: this.classes[classIndex], message: 'تم تعديل الفصل بنجاح' };
    }

    async deleteClass(classId) {
        await this.delay(400);
        
        const classIndex = this.classes.findIndex(cls => cls.id == classId);
        if (classIndex === -1) {
            return { success: false, message: 'الفصل غير موجود' };
        }

        const deletedClass = this.classes[classIndex];
        this.classes.splice(classIndex, 1);
        this.saveData();

        await this.addActivity({
            type: 'class_deleted',
            message: `تم حذف الفصل: ${deletedClass.name}`,
            user_id: this.getCurrentUser()?.id
        });

        return { success: true, message: 'تم حذف الفصل بنجاح' };
    }

    // === عمليات المواد ===
    async getSubjects(filters = {}) {
        await this.delay(300);
        let subjects = [...this.subjects];

        if (filters.search) {
            const searchTerm = filters.search.toLowerCase();
            subjects = subjects.filter(subject => 
                subject.name.toLowerCase().includes(searchTerm) ||
                subject.code.toLowerCase().includes(searchTerm)
            );
        }

        return { success: true, data: subjects };
    }

    async addSubject(subjectData) {
        await this.delay(500);
        
        const newSubject = {
            id: this.generateId(),
            ...subjectData,
            created_at: new Date().toISOString()
        };

        this.subjects.push(newSubject);
        this.saveData();

        await this.addActivity({
            type: 'subject_added',
            message: `تم إضافة مادة جديدة: ${subjectData.name}`,
            user_id: this.getCurrentUser()?.id
        });

        return { success: true, data: newSubject, message: 'تم إضافة المادة بنجاح' };
    }

    async updateSubject(subjectId, subjectData) {
        await this.delay(400);
        
        const subjectIndex = this.subjects.findIndex(subject => subject.id == subjectId);
        if (subjectIndex === -1) {
            return { success: false, message: 'المادة غير موجودة' };
        }

        this.subjects[subjectIndex] = { 
            ...this.subjects[subjectIndex], 
            ...subjectData, 
            updated_at: new Date().toISOString() 
        };
        this.saveData();

        await this.addActivity({
            type: 'subject_updated',
            message: `تم تعديل بيانات المادة: ${subjectData.name}`,
            user_id: this.getCurrentUser()?.id
        });

        return { success: true, data: this.subjects[subjectIndex], message: 'تم تعديل المادة بنجاح' };
    }

    async deleteSubject(subjectId) {
        await this.delay(400);
        
        const subjectIndex = this.subjects.findIndex(subject => subject.id == subjectId);
        if (subjectIndex === -1) {
            return { success: false, message: 'المادة غير موجودة' };
        }

        const deletedSubject = this.subjects[subjectIndex];
        this.subjects.splice(subjectIndex, 1);
        this.saveData();

        await this.addActivity({
            type: 'subject_deleted',
            message: `تم حذف المادة: ${deletedSubject.name}`,
            user_id: this.getCurrentUser()?.id
        });

        return { success: true, message: 'تم حذف المادة بنجاح' };
    }

    // === عمليات الإشعارات ===
    async getNotifications() {
        await this.delay(300);
        return { success: true, data: this.notifications };
    }

    async addNotification(notificationData) {
        await this.delay(500);
        
        const newNotification = {
            id: this.generateId(),
            ...notificationData,
            created_at: new Date().toISOString()
        };

        this.notifications.unshift(newNotification);
        this.saveData();

        await this.addActivity({
            type: 'notification_sent',
            message: `تم إرسال إشعار جديد: ${notificationData.title}`,
            user_id: this.getCurrentUser()?.id
        });

        return { success: true, data: newNotification, message: 'تم إرسال الإشعار بنجاح' };
    }

    async updateNotification(notificationId, notificationData) {
        await this.delay(400);
        
        const notificationIndex = this.notifications.findIndex(notif => notif.id == notificationId);
        if (notificationIndex === -1) {
            return { success: false, message: 'الإشعار غير موجود' };
        }

        this.notifications[notificationIndex] = { 
            ...this.notifications[notificationIndex], 
            ...notificationData, 
            updated_at: new Date().toISOString() 
        };
        this.saveData();

        return { success: true, data: this.notifications[notificationIndex], message: 'تم تعديل الإشعار بنجاح' };
    }

    async deleteNotification(notificationId) {
        await this.delay(400);
        
        const notificationIndex = this.notifications.findIndex(notif => notif.id == notificationId);
        if (notificationIndex === -1) {
            return { success: false, message: 'الإشعار غير موجود' };
        }

        const deletedNotification = this.notifications[notificationIndex];
        this.notifications.splice(notificationIndex, 1);
        this.saveData();

        await this.addActivity({
            type: 'notification_deleted',
            message: `تم حذف الإشعار: ${deletedNotification.title}`,
            user_id: this.getCurrentUser()?.id
        });

        return { success: true, message: 'تم حذف الإشعار بنجاح' };
    }

    // === النشاطات ===
    async getActivities(limit = 10) {
        await this.delay(200);
        const activities = this.activities
            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
            .slice(0, limit);
        
        return { success: true, data: activities };
    }

    async addActivity(activityData) {
        const newActivity = {
            id: this.generateId(),
            ...activityData,
            created_at: new Date().toISOString()
        };

        this.activities.unshift(newActivity);
        // الحفاظ على آخر 50 نشاط فقط
        if (this.activities.length > 50) {
            this.activities = this.activities.slice(0, 50);
        }
        this.saveData();
        return { success: true, data: newActivity };
    }

    // === إحصائيات ===
    async getStats() {
        await this.delay(400);
        
        const stats = {
            students: this.users.filter(user => user.role === 'student').length,
            teachers: this.users.filter(user => user.role === 'teacher').length,
            classes: this.classes.length,
            subjects: this.subjects.length,
            active_users: this.users.filter(user => user.active).length,
            total_users: this.users.length
        };

        return { success: true, data: stats };
    }

    // === دوال مساعدة ===
    getRoleArabic(role) {
        const roles = {
            'student': 'طالب',
            'teacher': 'معلم',
            'admin': 'مسؤول',
            'parent': 'ولي أمر'
        };
        return roles[role] || 'مستخدم';
    }

    getTeacherName(teacherId) {
        if (!teacherId) return 'غير محدد';
        const teacher = this.users.find(user => user.id == teacherId && user.role === 'teacher');
        return teacher ? teacher.name : 'غير محدد';
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    generateId() {
        return Date.now() + Math.floor(Math.random() * 1000);
    }

    getCurrentUser() {
        const userData = localStorage.getItem('currentUser');
        return userData ? JSON.parse(userData) : null;
    }

    // === النسخ الاحتياطي ===
    async exportData() {
        const data = {
            users: this.users,
            classes: this.classes,
            subjects: this.subjects,
            notifications: this.notifications,
            activities: this.activities,
            exported_at: new Date().toISOString()
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `school_backup_${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);

        await this.addActivity({
            type: 'data_exported',
            message: 'تم تصدير نسخة احتياطية من البيانات',
            user_id: this.getCurrentUser()?.id
        });

        return { success: true, message: 'تم تصدير البيانات بنجاح' };
    }

    async importData(file) {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const data = JSON.parse(e.target.result);
                    this.saveData(data);
                    
                    this.addActivity({
                        type: 'data_imported',
                        message: 'تم استيراد نسخة احتياطية للبيانات',
                        user_id: this.getCurrentUser()?.id
                    });
                    
                    resolve({ success: true, message: 'تم استيراد البيانات بنجاح' });
                } catch (error) {
                    resolve({ success: false, message: 'خطأ في تنسيق الملف' });
                }
            };
            reader.readAsText(file);
        });
    }

    // === تنظيف البيانات ===
    async clearAllData() {
        if (!confirm('هل أنت متأكد من حذف جميع البيانات؟ هذا الإجراء لا يمكن التراجع عنه.')) {
            return { success: false, message: 'تم إلغاء العملية' };
        }

        localStorage.removeItem('school_users');
        localStorage.removeItem('school_classes');
        localStorage.removeItem('school_subjects');
        localStorage.removeItem('school_notifications');
        localStorage.removeItem('school_activities');
        
        this.initializeDefaultData();
        
        await this.addActivity({
            type: 'data_cleared',
            message: 'تم مسح جميع البيانات وإعادة التعيين',
            user_id: this.getCurrentUser()?.id
        });

        return { success: true, message: 'تم مسح جميع البيانات بنجاح' };
    }
}

// إنشاء instance عام للاستخدام
const schoolDB = new SchoolDatabase();