// Admin parol
const ADMIN_PASSWORD = "admin123"; // O'zingizning parolingizni kiriting

// Login holatini tekshirish
function checkLoginStatus() {
    return localStorage.getItem('admin_logged_in') === 'true';
}

// Login qilish
function login(password) {
    if (password === ADMIN_PASSWORD) {
        localStorage.setItem('admin_logged_in', 'true');
        showAdminPanel();
        return true;
    }
    return false;
}

// Logout qilish
function logout() {
    localStorage.removeItem('admin_logged_in');
    showLoginScreen();
}

// Admin panelini ko'rsatish
function showAdminPanel() {
    document.getElementById('loginScreen').classList.add('hidden');
    document.getElementById('adminContent').classList.remove('hidden');
}

// Login ekranini ko'rsatish
function showLoginScreen() {
    document.getElementById('loginScreen').classList.remove('hidden');
    document.getElementById('adminContent').classList.add('hidden');
    document.getElementById('loginForm').reset();
}

// LocalStorage funksiyalari
function getQuestions() {
    return JSON.parse(localStorage.getItem('reading_questions') || '[]');
}

function setQuestions(arr) {
    localStorage.setItem('reading_questions', JSON.stringify(arr));
}

function getStudents() {
    return JSON.parse(localStorage.getItem('students_list') || '[]');
}

function getStudentVisits() {
    return parseInt(localStorage.getItem('student_visits') || '0');
}

function setStudentVisits(count) {
    localStorage.setItem('student_visits', count.toString());
}

// Mavjud savollardan "Read the passage:" ni olib tashlash
function cleanExistingQuestions() {
    const questions = getQuestions();
    let hasChanges = false;
    
    questions.forEach(question => {
        if (question.text.includes('Read the passage:')) {
            question.text = question.text.replace(/^Read the passage:\s*/i, '');
            hasChanges = true;
        }
    });
    
    if (hasChanges) {
        setQuestions(questions);
        console.log('Mavjud savollardan "Read the passage:" olib tashlandi');
    }
}

// Statistikalarni yangilash
function updateStats() {
    const questions = getQuestions();
    const students = getStudents();
    const visits = getStudentVisits();
    
    // Jami test ishlangan sonini hisoblash
    let totalTests = 0;
    students.forEach(student => {
        totalTests += student.testResults.length;
    });
    
    document.getElementById('questionCount').textContent = questions.length;
    document.getElementById('studentCount').textContent = students.length;
    document.getElementById('totalTests').textContent = totalTests;
}

// O'quvchilar jadvalini ko'rsatish
function renderStudentsTable() {
    const students = getStudents();
    const tbody = document.getElementById('studentsTable');
    
    if (students.length === 0) {
        tbody.innerHTML = '<tr><td colspan="9" class="py-8 text-center text-white/60">Hali o\'quvchilar ro\'yxatdan o\'tmagan</td></tr>';
        return;
    }
    
    tbody.innerHTML = students.map((student, index) => {
        // O'rtacha bahoni hisoblash
        let averageGrade = 'N/A';
        if (student.testResults.length > 0) {
            const totalPercent = student.testResults.reduce((sum, result) => sum + result.percent, 0);
            const avgPercent = Math.round(totalPercent / student.testResults.length);
            averageGrade = avgPercent >= 90 ? 'A' : avgPercent >= 80 ? 'B' : avgPercent >= 70 ? 'C' : avgPercent >= 60 ? 'D' : 'F';
        }
        
        return `
            <tr class="border-b border-white/20 hover:bg-white/10 transition-colors">
                <td class="py-3 px-2 sm:px-4 font-bold text-sm sm:text-base" data-label="#">${index + 1}</td>
                <td class="py-3 px-2 sm:px-4" data-label="Ism">
                    <div class="font-semibold text-sm sm:text-base">${student.name} ${student.surname}</div>
                </td>
                <td class="py-3 px-2 sm:px-4 hidden sm:table-cell" data-label="Telefon">
                    <div class="text-sm sm:text-base">${student.phone}</div>
                </td>
                <td class="py-3 px-2 sm:px-4 hidden lg:table-cell" data-label="Email">
                    <div class="text-sm sm:text-base">${student.email}</div>
                </td>
                <td class="py-3 px-2 sm:px-4 hidden lg:table-cell" data-label="Ro'yxatdan o'tgan">
                    <div class="text-sm sm:text-base">${student.registrationDate}</div>
                </td>
                <td class="py-3 px-2 sm:px-4 hidden xl:table-cell" data-label="Oxirgi tashrif">
                    <div class="text-sm sm:text-base">${student.lastVisit}</div>
                </td>
                <td class="py-3 px-2 sm:px-4 text-center font-bold text-sm sm:text-base" data-label="Testlar">${student.testResults.length}</td>
                <td class="py-3 px-2 sm:px-4 text-center font-bold text-sm sm:text-base hidden sm:table-cell" data-label="O'rtacha baho">${averageGrade}</td>
                <td class="py-3 px-2 sm:px-4 text-center" data-label="Batafsil">
                    <button onclick="showStudentDetails(${student.id})" class="bg-blue-500 hover:bg-blue-600 text-white px-2 sm:px-3 py-1 rounded-lg transition-colors text-xs sm:text-sm">
                        Ko'rish
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

// O'quvchi batafsil ma'lumotlarini ko'rsatish
function showStudentDetails(studentId) {
    const students = getStudents();
    const student = students.find(s => s.id === studentId);
    
    if (!student) return;
    
    const modal = document.getElementById('studentDetailsModal');
    modal.innerHTML = getStudentDetailsHTML(student);
    modal.classList.remove('hidden');
    
    // Modal tashqarisini bosganda yopish
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.classList.add('hidden');
        }
    });
}

// O'quvchi batafsil ma'lumotlari HTML
function getStudentDetailsHTML(student) {
    return `
        <div class="glass-card rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div class="flex justify-between items-center mb-4 sm:mb-6">
                <h2 class="text-2xl sm:text-3xl font-bold text-white">${student.name} ${student.surname} - Profil</h2>
                <button onclick="this.closest('.fixed').remove()" class="text-white hover:text-red-400 text-xl sm:text-2xl font-bold">
                    ×
                </button>
            </div>
            
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
                <div class="bg-white/20 rounded-xl sm:rounded-2xl p-4 sm:p-6">
                    <h3 class="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4">Shaxsiy ma'lumotlar</h3>
                    <div class="space-y-2 sm:space-y-3 text-white text-sm sm:text-base">
                        <div><span class="font-semibold">Ism:</span> ${student.name}</div>
                        <div><span class="font-semibold">Familiya:</span> ${student.surname}</div>
                        <div><span class="font-semibold">Telefon:</span> ${student.phone}</div>
                        <div><span class="font-semibold">Email:</span> ${student.email}</div>
                        <div><span class="font-semibold">Ro'yxatdan o'tgan:</span> ${student.registrationDate}</div>
                        <div><span class="font-semibold">Oxirgi tashrif:</span> ${student.lastVisit}</div>
                    </div>
                </div>
                
                <div class="bg-white/20 rounded-xl sm:rounded-2xl p-4 sm:p-6">
                    <h3 class="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4">Test statistikasi</h3>
                    <div class="space-y-2 sm:space-y-3 text-white text-sm sm:text-base">
                        <div><span class="font-semibold">Jami testlar:</span> ${student.testResults.length}</div>
                        ${student.testResults.length > 0 ? `
                            <div><span class="font-semibold">Eng yaxshi natija:</span> ${Math.max(...student.testResults.map(r => r.percent))}%</div>
                            <div><span class="font-semibold">Eng yomon natija:</span> ${Math.min(...student.testResults.map(r => r.percent))}%</div>
                            <div><span class="font-semibold">O'rtacha natija:</span> ${Math.round(student.testResults.reduce((sum, r) => sum + r.percent, 0) / student.testResults.length)}%</div>
                        ` : '<div class="text-white/60">Hali test ishlanmagan</div>'}
                    </div>
                </div>
            </div>
            
            ${student.testResults.length > 0 ? `
                <div class="bg-white/20 rounded-xl sm:rounded-2xl p-4 sm:p-6">
                    <h3 class="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4">Test natijalari</h3>
                    <div class="overflow-x-auto">
                        <table class="w-full bg-white/10 rounded-lg sm:rounded-xl overflow-hidden">
                            <thead>
                                <tr class="bg-white/20">
                                    <th class="py-2 sm:py-3 px-2 sm:px-4 text-left text-white font-bold text-sm sm:text-base">Sana</th>
                                    <th class="py-2 sm:py-3 px-2 sm:px-4 text-center text-white font-bold text-sm sm:text-base">To'g'ri</th>
                                    <th class="py-2 sm:py-3 px-2 sm:px-4 text-center text-white font-bold text-sm sm:text-base">Jami</th>
                                    <th class="py-2 sm:py-3 px-2 sm:px-4 text-center text-white font-bold text-sm sm:text-base">Foiz</th>
                                    <th class="py-2 sm:py-3 px-2 sm:px-4 text-center text-white font-bold text-sm sm:text-base">Baho</th>
                                </tr>
                            </thead>
                            <tbody class="text-white text-sm sm:text-base">
                                ${student.testResults.map(result => `
                                    <tr class="border-b border-white/10">
                                        <td class="py-2 px-2 sm:px-4">${result.date}</td>
                                        <td class="py-2 px-2 sm:px-4 text-center">${result.correct}</td>
                                        <td class="py-2 px-2 sm:px-4 text-center">${result.total}</td>
                                        <td class="py-2 px-2 sm:px-4 text-center font-bold">${result.percent}%</td>
                                        <td class="py-2 px-2 sm:px-4 text-center font-bold">${result.grade}</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            ` : ''}
        </div>
    `;
}

// Savollar jadvalini ko'rsatish
function renderTable() {
    const questions = getQuestions();
    const tbody = document.getElementById('questionsTable');
    
    if (questions.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="py-8 text-center text-white/60">Hali savollar qo\'shilmagan</td></tr>';
        return;
    }
    
    tbody.innerHTML = questions.map((q, index) => `
        <tr class="border-b border-white/20 hover:bg-white/10 transition-colors">
            <td class="py-3 px-2 sm:px-4 font-bold text-sm sm:text-base" data-label="#">${index + 1}</td>
            <td class="py-3 px-2 sm:px-4" data-label="Savol">
                <div class="text-sm sm:text-base max-w-xs sm:max-w-md lg:max-w-lg truncate" title="${q.text}">${q.text}</div>
            </td>
            <td class="py-3 px-2 sm:px-4 hidden sm:table-cell" data-label="A">
                <div class="text-sm sm:text-base max-w-20 sm:max-w-24 truncate" title="${q.options[0]}">${q.options[0]}</div>
            </td>
            <td class="py-3 px-2 sm:px-4 hidden sm:table-cell" data-label="B">
                <div class="text-sm sm:text-base max-w-20 sm:max-w-24 truncate" title="${q.options[1]}">${q.options[1]}</div>
            </td>
            <td class="py-3 px-2 sm:px-4 hidden sm:table-cell" data-label="C">
                <div class="text-sm sm:text-base max-w-20 sm:max-w-24 truncate" title="${q.options[2]}">${q.options[2]}</div>
            </td>
            <td class="py-3 px-2 sm:px-4 text-center font-bold text-sm sm:text-base" data-label="To'g'ri">${String.fromCharCode(65 + q.answer)}</td>
            <td class="py-3 px-2 sm:px-4 text-center" data-label="O'chirish">
                <button onclick="deleteQuestion(${index})" class="bg-red-500 hover:bg-red-600 text-white px-2 sm:px-3 py-1 rounded-lg transition-colors text-xs sm:text-sm">
                    O'chirish
                </button>
            </td>
        </tr>
    `).join('');
}

// Savolni o'chirish
function deleteQuestion(index) {
    if (confirm('Bu savolni o\'chirishni xohlaysizmi?')) {
        const questions = getQuestions();
        questions.splice(index, 1);
        setQuestions(questions);
        renderTable();
        updateStats();
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    // Login holatini tekshirish
    if (checkLoginStatus()) {
        showAdminPanel();
    } else {
        showLoginScreen();
    }
    
    // Login form
    document.getElementById('loginForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const password = document.getElementById('adminPassword').value;
        
        if (login(password)) {
            alert('Muvaffaqiyatli kirdingiz!');
        } else {
            alert('Noto\'g\'ri parol!');
            document.getElementById('adminPassword').value = '';
            document.getElementById('adminPassword').focus();
        }
    });
    
    // Logout tugmasi
    document.getElementById('logoutBtn').addEventListener('click', function() {
        logout();
    });
    
    // Mavjud savollardan "Read the passage:" ni olib tashlash
    cleanExistingQuestions();
    
    // Yangi savol qo'shish
    document.getElementById('addForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        let text = document.getElementById('qText').value.trim();
        const optA = document.getElementById('optA').value.trim();
        const optB = document.getElementById('optB').value.trim();
        const optC = document.getElementById('optC').value.trim();
        const answer = parseInt(document.getElementById('qAnswer').value);
        
        if (!text || !optA || !optB || !optC) {
            alert('Barcha maydonlarni to\'ldiring!');
            return;
        }
        
        // "Read the passage:" ni olib tashlash
        text = text.replace(/^Read the passage:\s*/i, '');
        
        const questions = getQuestions();
        questions.push({
            text: text,
            options: [optA, optB, optC],
            answer: answer
        });
        
        setQuestions(questions);
        this.reset();
        renderTable();
        updateStats();
        
        alert('Savol muvaffaqiyatli qo\'shildi!');
    });

    // Menu tugmalari
    document.getElementById('menu-students').addEventListener('click', function() {
        document.getElementById('students-section').classList.remove('hidden');
        document.getElementById('tests-section').classList.add('hidden');
        
        document.getElementById('menu-students').classList.add('active');
        document.getElementById('menu-tests').classList.remove('active');
        
        renderStudentsTable();
    });
    
    document.getElementById('menu-tests').addEventListener('click', function() {
        document.getElementById('students-section').classList.add('hidden');
        document.getElementById('tests-section').classList.remove('hidden');
        
        document.getElementById('menu-students').classList.remove('active');
        document.getElementById('menu-tests').classList.add('active');
    });

    // Sahifa yuklanganda
    updateStats();
    renderTable();
    renderStudentsTable();
});