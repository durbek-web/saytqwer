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
    initializeMobileMenu();
}

// Login ekranini ko'rsatish
function showLoginScreen() {
    document.getElementById('loginScreen').classList.remove('hidden');
    document.getElementById('adminContent').classList.add('hidden');
    document.getElementById('loginForm').reset();
}

// Mobile menu funksiyalari
function initializeMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
        
        // Mobile menu tugmalarini sozlash
        const mobileStudentsBtn = document.getElementById('mobile-menu-students');
        const mobileTestsBtn = document.getElementById('mobile-menu-tests');
        const mobileLogoutBtn = document.getElementById('mobile-logoutBtn');
        
        if (mobileStudentsBtn) {
            mobileStudentsBtn.addEventListener('click', () => {
                showSection('students');
                mobileMenu.classList.add('hidden');
            });
        }
        
        if (mobileTestsBtn) {
            mobileTestsBtn.addEventListener('click', () => {
                showSection('tests');
                mobileMenu.classList.add('hidden');
            });
        }
        
        if (mobileLogoutBtn) {
            mobileLogoutBtn.addEventListener('click', () => {
                logout();
                mobileMenu.classList.add('hidden');
            });
        }
    }
}

// Bo'limni ko'rsatish
function showSection(sectionName) {
    // Barcha bo'limlarni yashirish
    document.getElementById('students-section').classList.add('hidden');
    document.getElementById('tests-section').classList.add('hidden');
    
    // Barcha menu tugmalarini inactive qilish
    document.querySelectorAll('.menu-btn').forEach(btn => btn.classList.remove('active'));
    
    // Tanlangan bo'limni ko'rsatish
    if (sectionName === 'students') {
        document.getElementById('students-section').classList.remove('hidden');
        document.getElementById('menu-students').classList.add('active');
        document.getElementById('mobile-menu-students').classList.add('active');
    } else if (sectionName === 'tests') {
        document.getElementById('tests-section').classList.remove('hidden');
        document.getElementById('menu-tests').classList.add('active');
        document.getElementById('mobile-menu-tests').classList.add('active');
    }
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
        tbody.innerHTML = '<tr><td colspan="10" class="py-8 text-center text-white/60">Hali o\'quvchilar ro\'yxatdan o\'tmagan</td></tr>';
        return;
    }
    
    tbody.innerHTML = students.map((student, index) => {
        // O'rtacha bahoni hisoblash
        let averageGrade = 0;
        if (student.testResults && student.testResults.length > 0) {
            const totalPercent = student.testResults.reduce((sum, result) => sum + result.percent, 0);
            averageGrade = Math.round(totalPercent / student.testResults.length);
        }
        
        return `
            <tr class="border-b border-white/10 hover:bg-white/5 transition-colors">
                <td class="py-2 sm:py-3 px-2 sm:px-4 text-sm sm:text-base font-bold" data-label="№">${index + 1}</td>
                <td class="py-2 sm:py-3 px-2 sm:px-4 text-sm sm:text-base font-semibold" data-label="Ism">${student.name} ${student.surname}</td>
                <td class="py-2 sm:py-3 px-2 sm:px-4 text-sm sm:text-base hidden sm:table-cell" data-label="Telefon">${student.phone}</td>
                <td class="py-2 sm:py-3 px-2 sm:px-4 text-sm sm:text-base hidden lg:table-cell" data-label="Email">${student.email}</td>
                <td class="py-2 sm:py-3 px-2 sm:px-4 text-sm sm:text-base hidden lg:table-cell" data-label="Ro'yxatdan o'tgan">${student.registrationDate}</td>
                <td class="py-2 sm:py-3 px-2 sm:px-4 text-sm sm:text-base hidden xl:table-cell" data-label="Oxirgi tashrif">${student.lastVisit}</td>
                <td class="py-2 sm:py-3 px-2 sm:px-4 text-center text-sm sm:text-base font-semibold" data-label="Testlar">${student.testResults ? student.testResults.length : 0}</td>
                <td class="py-2 sm:py-3 px-2 sm:px-4 text-center text-sm sm:text-base hidden sm:table-cell" data-label="O'rtacha baho">
                    <span class="bg-gradient-to-r from-indigo-500 to-pink-500 text-white px-2 py-1 rounded-full text-xs font-bold">${averageGrade}%</span>
                </td>
                <td class="py-2 sm:py-3 px-2 sm:px-4 text-center" data-label="Batafsil">
                    <button onclick="showStudentDetails(${student.id})" 
                            class="bg-gradient-to-r from-indigo-500 to-pink-500 text-white px-2 sm:px-3 py-1 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold hover:scale-105 transition-all duration-300 shadow-lg">
                        Ko'rish
                    </button>
                </td>
                <td class="py-2 sm:py-3 px-2 sm:px-4 text-center" data-label="O'chir">
                    <button onclick="deleteStudent(${student.id})" 
                            class="bg-red-500 text-white px-2 sm:px-3 py-1 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold hover:bg-red-600 transition-all duration-300 shadow-lg">
                        O'chir
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

// O'quvchini o'chirish
function deleteStudent(studentId) {
    if (confirm('Bu o\'quvchini o\'chirishni xohlaysizmi? Bu amalni qaytarib bo\'lmaydi!')) {
        const students = getStudents();
        const updatedStudents = students.filter(student => student.id !== studentId);
        localStorage.setItem('students_list', JSON.stringify(updatedStudents));
        
        // Jadvalni yangilash
        renderStudentsTable();
        updateStats();
        
        alert('O\'quvchi muvaffaqiyatli o\'chirildi!');
    }
}

// Barcha o'quvchilarni o'chirish
function deleteAllStudents() {
    const students = getStudents();
    if (students.length === 0) {
        alert('O\'chirish uchun o\'quvchilar mavjud emas!');
        return;
    }
    
    if (confirm(`Barcha ${students.length} ta o\'quvchini o\'chirishni xohlaysizmi? Bu amalni qaytarib bo\'lmaydi!`)) {
        localStorage.setItem('students_list', JSON.stringify([]));
        
        // Jadvalni yangilash
        renderStudentsTable();
        updateStats();
        
        alert('Barcha o\'quvchilar muvaffaqiyatli o\'chirildi!');
    }
}

// O'quvchi batafsil ma'lumotlarini ko'rsatish
function showStudentDetails(studentId) {
    const students = getStudents();
    const student = students.find(s => s.id === studentId);
    
    if (!student) return;
    
    const modal = document.getElementById('studentDetailsModal');
    modal.innerHTML = getStudentDetailsHTML(student);
    modal.classList.remove('hidden');
}

// O'quvchi batafsil ma'lumotlari HTML
function getStudentDetailsHTML(student) {
    let averageGrade = 0;
    if (student.testResults && student.testResults.length > 0) {
        const totalPercent = student.testResults.reduce((sum, result) => sum + result.percent, 0);
        averageGrade = Math.round(totalPercent / student.testResults.length);
    }
    
    return `
        <div class="bg-white rounded-2xl sm:rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto mx-4">
            <div class="bg-gradient-to-r from-indigo-500 to-pink-500 p-4 sm:p-6">
                <div class="flex items-center justify-between">
                    <h2 class="text-lg sm:text-xl lg:text-2xl font-bold text-white">O'quvchi ma'lumotlari</h2>
                    <button onclick="closeStudentDetails()" class="text-white hover:bg-white/20 p-2 rounded-full transition-all duration-300">
                        <svg class="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                        </svg>
                    </button>
                </div>
            </div>
            <div class="p-4 sm:p-6">
                <div class="space-y-4 sm:space-y-6">
                    <div class="text-center">
                        <div class="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-gradient-to-br from-indigo-500 to-pink-500 rounded-full mx-auto mb-3 sm:mb-4 flex items-center justify-center text-xl sm:text-2xl lg:text-3xl font-bold text-white">
                            ${student.name.charAt(0)}${student.surname.charAt(0)}
                        </div>
                        <h3 class="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 mb-1 sm:mb-2">${student.name} ${student.surname}</h3>
                        <p class="text-gray-600 text-sm sm:text-base">O'quvchi</p>
                    </div>
                    
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
                        <div class="bg-gray-50 rounded-xl p-3 sm:p-4">
                            <div class="flex items-center gap-2 sm:gap-3 mb-2">
                                <span class="text-lg sm:text-xl">📱</span>
                                <span class="text-gray-700 font-semibold text-sm sm:text-base">Telefon:</span>
                            </div>
                            <p class="text-gray-600 ml-7 sm:ml-8 text-sm sm:text-base break-all">${student.phone}</p>
                        </div>
                        
                        <div class="bg-gray-50 rounded-xl p-3 sm:p-4">
                            <div class="flex items-center gap-2 sm:gap-3 mb-2">
                                <span class="text-lg sm:text-xl">📧</span>
                                <span class="text-gray-700 font-semibold text-sm sm:text-base">Email:</span>
                            </div>
                            <p class="text-gray-600 ml-7 sm:ml-8 text-sm sm:text-base break-all">${student.email}</p>
                        </div>
                        
                        <div class="bg-gray-50 rounded-xl p-3 sm:p-4">
                            <div class="flex items-center gap-2 sm:gap-3 mb-2">
                                <span class="text-lg sm:text-xl">📅</span>
                                <span class="text-gray-700 font-semibold text-sm sm:text-base">Ro'yxatdan o'tgan:</span>
                            </div>
                            <p class="text-gray-600 ml-7 sm:ml-8 text-sm sm:text-base">${student.registrationDate}</p>
                        </div>
                        
                        <div class="bg-gray-50 rounded-xl p-3 sm:p-4">
                            <div class="flex items-center gap-2 sm:gap-3 mb-2">
                                <span class="text-lg sm:text-xl">📊</span>
                                <span class="text-gray-700 font-semibold text-sm sm:text-base">O'rtacha baho:</span>
                            </div>
                            <p class="text-gray-600 ml-7 sm:ml-8 text-sm sm:text-base">
                                <span class="bg-gradient-to-r from-indigo-500 to-pink-500 text-white px-2 py-1 rounded-full text-xs font-bold">${averageGrade}%</span>
                            </p>
                        </div>
                    </div>
                    
                    ${student.testResults && student.testResults.length > 0 ? `
                        <div class="bg-gray-50 rounded-xl p-3 sm:p-4">
                            <h4 class="text-base sm:text-lg font-bold text-gray-800 mb-3">Test natijalari tarixi:</h4>
                            <div class="space-y-2 max-h-48 sm:max-h-60 overflow-y-auto">
                                ${student.testResults.map((result, index) => `
                                    <div class="bg-white rounded-lg p-2 sm:p-3 border border-gray-200">
                                        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-1 gap-1">
                                            <span class="text-sm font-semibold text-gray-700">Test ${index + 1}</span>
                                            <span class="text-xs sm:text-sm text-gray-500">${result.date}</span>
                                        </div>
                                        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                                            <span class="text-xs text-gray-600">${result.correct}/${result.total} to'g'ri</span>
                                            <span class="text-sm font-bold ${result.percent >= 80 ? 'text-green-600' : result.percent >= 60 ? 'text-yellow-600' : 'text-red-600'}">${result.percent}%</span>
                                            <span class="text-xs font-bold bg-gray-200 px-2 py-1 rounded">${result.grade}</span>
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    ` : `
                        <div class="bg-gray-50 rounded-xl p-3 sm:p-4">
                            <div class="text-center">
                                <div class="text-3xl sm:text-4xl mb-2">📝</div>
                                <p class="text-gray-600 text-sm sm:text-base">Hali test ishlanmagan</p>
                                <p class="text-gray-500 text-xs sm:text-sm mt-1">Test ishlaganingizdan so'ng natijalar bu yerda ko'rinadi</p>
                            </div>
                        </div>
                    `}
                    
                    <div class="pt-2 sm:pt-4">
                        <button onclick="closeStudentDetails()" class="w-full bg-gradient-to-r from-indigo-500 to-pink-500 text-white py-2 sm:py-3 rounded-xl font-semibold hover:scale-105 transition-all duration-300 text-sm sm:text-base shadow-lg">
                            Yopish
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// O'quvchi batafsil ma'lumotlarini yashirish
function closeStudentDetails() {
    document.getElementById('studentDetailsModal').classList.add('hidden');
}

// Savollar jadvalini ko'rsatish
function renderTable() {
    const questions = getQuestions();
    const tbody = document.getElementById('questionsTable');
    
    if (questions.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="py-8 text-center text-white/60">Hali savollar qo\'shilmagan</td></tr>';
        return;
    }
    
    tbody.innerHTML = questions.map((question, index) => `
        <tr class="border-b border-white/10 hover:bg-white/5 transition-colors">
            <td class="py-2 sm:py-3 px-2 sm:px-4 text-sm sm:text-base" data-label="№">${index + 1}</td>
            <td class="py-2 sm:py-3 px-2 sm:px-4 text-sm sm:text-base" data-label="Savol">${question.text.length > 100 ? question.text.substring(0, 100) + '...' : question.text}</td>
            <td class="py-2 sm:py-3 px-2 sm:px-4 text-sm sm:text-base hidden sm:table-cell" data-label="A">${question.options[0].length > 30 ? question.options[0].substring(0, 30) + '...' : question.options[0]}</td>
            <td class="py-2 sm:py-3 px-2 sm:px-4 text-sm sm:text-base hidden sm:table-cell" data-label="B">${question.options[1].length > 30 ? question.options[1].substring(0, 30) + '...' : question.options[1]}</td>
            <td class="py-2 sm:py-3 px-2 sm:px-4 text-sm sm:text-base hidden sm:table-cell" data-label="C">${question.options[2].length > 30 ? question.options[2].substring(0, 30) + '...' : question.options[2]}</td>
            <td class="py-2 sm:py-3 px-2 sm:px-4 text-center text-sm sm:text-base" data-label="To'g'ri">
                <span class="bg-green-500 text-white px-2 py-1 rounded text-xs sm:text-sm font-bold">${String.fromCharCode(65 + question.answer)}</span>
            </td>
            <td class="py-2 sm:py-3 px-2 sm:px-4 text-center" data-label="O'chir">
                <button onclick="deleteQuestion(${index})" 
                        class="bg-red-500 text-white px-2 sm:px-3 py-1 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold hover:bg-red-600 transition-all duration-300">
                    O'chir
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

// Savol qo'shish
function addQuestion(questionData) {
    const questions = getQuestions();
    questions.push(questionData);
    setQuestions(questions);
    renderTable();
    updateStats();
}

// Import funksiyasi
function importQuestions(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const importedQuestions = JSON.parse(e.target.result);
            const currentQuestions = getQuestions();
            
            // Yangi savollarni qo'shish
            const updatedQuestions = [...currentQuestions, ...importedQuestions];
            setQuestions(updatedQuestions);
            
            renderTable();
            updateStats();
            alert(`${importedQuestions.length} ta savol muvaffaqiyatli qo'shildi!`);
        } catch (error) {
            alert('Fayl formatida xatolik! Iltimos, to\'g\'ri JSON faylini tanlang.');
        }
    };
    reader.readAsText(file);
}

// Export funksiyasi
function exportQuestions() {
    const questions = getQuestions();
    const dataStr = JSON.stringify(questions, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = 'reading_questions.json';
    link.click();
}

// Avtomatik test sozlamalarini saqlash
function saveAutoTestSettings() {
    const isEnabled = document.getElementById('autoTestToggle').checked;
    const testCount = parseInt(document.getElementById('autoTestCount').value);
    const delay = parseInt(document.getElementById('autoTestDelay').value);
    
    const settings = {
        enabled: isEnabled,
        testCount: testCount,
        delay: delay,
        lastUpdated: new Date().toISOString()
    };
    
    localStorage.setItem('auto_test_settings', JSON.stringify(settings));
    alert('Avtomatik test sozlamalari saqlandi!');
    updateAutoTestStats();
}

// Avtomatik test sozlamalarini yuklash
function loadAutoTestSettings() {
    const settings = JSON.parse(localStorage.getItem('auto_test_settings') || '{}');
    
    if (settings.enabled !== undefined) {
        document.getElementById('autoTestToggle').checked = settings.enabled;
    }
    if (settings.testCount) {
        document.getElementById('autoTestCount').value = settings.testCount;
    }
    if (settings.delay) {
        document.getElementById('autoTestDelay').value = settings.delay;
    }
}

// Avtomatik test statistikalarini yangilash
function updateAutoTestStats() {
    const usedTests = JSON.parse(localStorage.getItem('used_tests') || '[]');
    const totalTests = 30; // Yangilangan TEST_DATABASE length
    const remainingTests = totalTests - usedTests.length;
    const lastAdded = localStorage.getItem('last_test_completion');
    
    document.getElementById('totalTestDatabase').textContent = totalTests;
    document.getElementById('usedTestsCount').textContent = usedTests.length;
    document.getElementById('remainingTests').textContent = remainingTests;
    
    if (lastAdded) {
        const lastTime = new Date(lastAdded);
        document.getElementById('lastAddedTime').textContent = lastTime.toLocaleString('uz-UZ');
    } else {
        document.getElementById('lastAddedTime').textContent = '-';
    }
}

// Avtomatik test tizimini test qilish
function testAutoTestSystem() {
    const settings = JSON.parse(localStorage.getItem('auto_test_settings') || '{}');
    if (!settings.enabled) {
        alert('Avtomatik test qo\'shish o\'chirilgan!');
        return;
    }
    
    // Test qo'shish simulyatsiyasi
    const testCount = settings.testCount || 7;
    const usedTests = JSON.parse(localStorage.getItem('used_tests') || '[]');
    const availableTests = 30 - usedTests.length; // Yangilangan son
    
    if (availableTests < testCount) {
        alert(`Faqat ${availableTests} ta test qoldi! Avval testlar bazasini to'ldiring.`);
        return;
    }
    
    // Simulyatsiya qilish
    const newTests = [];
    for (let i = 0; i < testCount; i++) {
        newTests.push({
            text: `Test savol ${i + 1}`,
            options: ['A', 'B', 'C', 'D'],
            answer: 0
        });
    }
    
    const currentQuestions = getQuestions();
    const updatedQuestions = [...currentQuestions, ...newTests];
    setQuestions(updatedQuestions);
    
    // Ishlatilgan testlarni yangilash
    const newUsedTests = [...usedTests, ...newTests.map(t => t.text)];
    localStorage.setItem('used_tests', JSON.stringify(newUsedTests));
    
    // Oxirgi qo'shilgan vaqtni yangilash
    localStorage.setItem('last_test_completion', new Date().toISOString());
    
    renderTable();
    updateStats();
    updateAutoTestStats();
    
    alert(`${testCount} ta test muvaffaqiyatli qo'shildi!`);
}

// Avtomatik test tizimini qayta boshlash
function resetAutoTestSystem() {
    if (confirm('Avtomatik test tizimini qayta boshlashni xohlaysizmi? Bu barcha ishlatilgan testlar ro\'yxatini tozalaydi.')) {
        localStorage.removeItem('used_tests');
        localStorage.removeItem('last_test_completion');
        localStorage.removeItem('auto_test_settings');
        
        // Sozlamalarni qayta yuklash
        loadAutoTestSettings();
        updateAutoTestStats();
        
        alert('Avtomatik test tizimi qayta boshlangandi!');
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
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const password = document.getElementById('adminPassword').value;
            if (!login(password)) {
                alert('Noto\'g\'ri parol!');
            }
        });
    }
    
    // Menu tugmalari
    const studentsBtn = document.getElementById('menu-students');
    const testsBtn = document.getElementById('menu-tests');
    const logoutBtn = document.getElementById('logoutBtn');
    
    if (studentsBtn) {
        studentsBtn.addEventListener('click', () => showSection('students'));
    }
    
    if (testsBtn) {
        testsBtn.addEventListener('click', () => showSection('tests'));
    }
    
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }
    
    // Savol qo'shish formasi
    const addForm = document.getElementById('addForm');
    if (addForm) {
        addForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const questionData = {
                text: document.getElementById('qText').value.trim(),
                options: [
                    document.getElementById('optA').value.trim(),
                    document.getElementById('optB').value.trim(),
                    document.getElementById('optC').value.trim()
                ],
                answer: parseInt(document.getElementById('qAnswer').value)
            };
            
            if (!questionData.text || !questionData.options[0] || !questionData.options[1] || !questionData.options[2] || questionData.answer === undefined) {
                alert('Barcha maydonlarni to\'ldiring!');
                return;
            }
            
            addQuestion(questionData);
            addForm.reset();
        });
    }
    
    // Import fayl input
    const importInput = document.getElementById('importInput');
    if (importInput) {
        importInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                importQuestions(file);
                e.target.value = ''; // Input ni tozalash
            }
        });
    }
    
    // Export tugmasi
    const exportBtn = document.getElementById('exportBtn');
    if (exportBtn) {
        exportBtn.addEventListener('click', exportQuestions);
    }
    
    // Mavjud savollarni tozalash
    cleanExistingQuestions();
    
    // Dastlabki ma'lumotlarni ko'rsatish
    updateStats();
    renderStudentsTable();
    renderTable();
    
    // Avtomatik test sozlamalarini yuklash
    loadAutoTestSettings();
    updateAutoTestStats();
    
    // Dastlabki bo'limni ko'rsatish
    showSection('students');
});

// Global event listener - modal yashirish
document.addEventListener('click', function(e) {
    if (e.target.id === 'studentDetailsModal') {
        closeStudentDetails();
    }
});