// Global o'zgaruvchilar
let questions = JSON.parse(localStorage.getItem('reading_questions') || '[]');
let current = 0;
let answers = {};
let testFinished = false;
let currentStudent = null;

// O'quvchi ma'lumotlarini saqlash
function saveStudent(studentData) {
    const students = JSON.parse(localStorage.getItem('students_list') || '[]');
    const newStudent = {
        id: Date.now(),
        name: studentData.name,
        surname: studentData.surname,
        phone: studentData.phone,
        email: studentData.email,
        registrationDate: new Date().toLocaleString('uz-UZ'),
        lastVisit: new Date().toLocaleString('uz-UZ'),
        testResults: []
    };
    students.push(newStudent);
    localStorage.setItem('students_list', JSON.stringify(students));
    return newStudent;
}

// O'quvchi ma'lumotlarini yangilash
function updateStudentLastVisit(studentId) {
    const students = JSON.parse(localStorage.getItem('students_list') || '[]');
    const studentIndex = students.findIndex(s => s.id === studentId);
    if (studentIndex !== -1) {
        students[studentIndex].lastVisit = new Date().toLocaleString('uz-UZ');
        localStorage.setItem('students_list', JSON.stringify(students));
    }
}

// O'quvchi tashrifini hisoblash
function incrementStudentVisits() {
    const visits = parseInt(localStorage.getItem('student_visits') || '0');
    localStorage.setItem('student_visits', (visits + 1).toString());
}

// Notification count yangilash
function updateNotificationCount() {
    const questionCount = questions.length;
    document.getElementById('notification-count').textContent = questionCount;
}

// Savollar modalini ko'rsatish
function showQuestionsModal() {
    const modal = document.getElementById('questionsModal');
    const questionsList = document.getElementById('questionsList');
    
    questionsList.innerHTML = getQuestionsModalHTML();
    modal.classList.remove('hidden');
}

// Savollar modal HTML
function getQuestionsModalHTML() {
    return questions.map((question, index) => `
        <div class="bg-gray-50 rounded-2xl p-6 border border-gray-200">
            <div class="flex items-start justify-between">
                <div class="flex-1">
                    <div class="flex items-center gap-3 mb-3">
                        <span class="bg-indigo-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                            Savol ${index + 1}
                        </span>
                        <span class="text-gray-500 text-sm">
                            ${answers[index] !== undefined ? '✅ Bajarilgan' : '⏳ Bajarilmagan'}
                        </span>
                    </div>
                    <h3 class="text-lg font-semibold text-gray-800 mb-3">${question.text}</h3>
                    <div class="space-y-2">
                        ${question.options.map((option, optIndex) => `
                            <div class="flex items-center gap-3">
                                <span class="w-6 h-6 rounded-full border-2 flex items-center justify-center text-sm font-bold
                                    ${answers[index] === optIndex ? 'bg-blue-500 border-blue-500 text-white' : 'border-gray-300 text-gray-600'}">
                                    ${String.fromCharCode(65 + optIndex)}
                                </span>
                                <span class="text-gray-700 ${answers[index] === optIndex ? 'font-semibold' : ''}">${option}</span>
                                ${answers[index] === optIndex ? '<span class="text-green-500">✓</span>' : ''}
                            </div>
                        `).join('')}
                    </div>
                </div>
                <div class="ml-4">
                    <button onclick="goToQuestion(${index})" 
                            class="bg-gradient-to-r from-indigo-500 to-pink-500 text-white px-4 py-2 rounded-xl font-semibold hover:scale-105 transition-all duration-300">
                        ${answers[index] !== undefined ? 'Qayta ko\'rish' : 'Bajarish'}
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Savollar modalini yashirish
function hideQuestionsModal() {
    document.getElementById('questionsModal').classList.add('hidden');
}

// Profil modalini ko'rsatish
function showProfileModal() {
    const modal = document.getElementById('profileModal');
    const content = document.getElementById('profileContent');
    
    // O'quvchi ma'lumotlarini LocalStorage'dan olish
    const students = JSON.parse(localStorage.getItem('students_list') || '[]');
    const currentStudentData = students.find(s => s.id === currentStudent?.id) || currentStudent;
    
    if (currentStudentData && currentStudentData.testResults && currentStudentData.testResults.length > 0) {
        content.innerHTML = getProfileModalHTML(currentStudentData);
    } else if (currentStudentData) {
        content.innerHTML = getProfileModalHTML(currentStudentData);
    } else {
        content.innerHTML = getNoProfileHTML();
    }
    
    modal.classList.remove('hidden');
}

// Profil modalini yashirish
function hideProfileModal() {
    document.getElementById('profileModal').classList.add('hidden');
}

// Profil modal HTML
function getProfileModalHTML(student) {
    return `
        <div class="space-y-4 sm:space-y-6">
            <div class="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-indigo-500 to-pink-500 rounded-full mx-auto flex items-center justify-center text-2xl sm:text-3xl font-bold text-white">
                ${student.name.charAt(0)}${student.surname.charAt(0)}
            </div>
            
            <div>
                <h3 class="text-xl sm:text-2xl font-bold text-gray-800 mb-2">${student.name} ${student.surname}</h3>
                <p class="text-gray-600 text-sm sm:text-base">O'quvchi</p>
            </div>
            
            <div class="space-y-3 sm:space-y-4">
                <div class="bg-gray-50 rounded-xl p-3 sm:p-4">
                    <div class="flex items-center gap-2 sm:gap-3 mb-1">
                        <span class="text-lg sm:text-xl">📱</span>
                        <span class="text-gray-700 font-semibold text-sm sm:text-base">Telefon:</span>
                    </div>
                    <p class="text-gray-600 ml-7 sm:ml-8 text-sm sm:text-base">${student.phone}</p>
                </div>
                
                <div class="bg-gray-50 rounded-xl p-3 sm:p-4">
                    <div class="flex items-center gap-2 sm:gap-3 mb-1">
                        <span class="text-lg sm:text-xl">📧</span>
                        <span class="text-gray-700 font-semibold text-sm sm:text-base">Email:</span>
                    </div>
                    <p class="text-gray-600 ml-7 sm:ml-8 text-sm sm:text-base">${student.email}</p>
                </div>
                
                <div class="bg-gray-50 rounded-xl p-3 sm:p-4">
                    <div class="flex items-center gap-2 sm:gap-3 mb-1">
                        <span class="text-lg sm:text-xl">📅</span>
                        <span class="text-gray-700 font-semibold text-sm sm:text-base">Ro'yxatdan o'tgan:</span>
                    </div>
                    <p class="text-gray-600 ml-7 sm:ml-8 text-sm sm:text-base">${student.registrationDate}</p>
                </div>
                
                <div class="bg-gray-50 rounded-xl p-3 sm:p-4">
                    <div class="flex items-center gap-2 sm:gap-3 mb-1">
                        <span class="text-lg sm:text-xl">📊</span>
                        <span class="text-gray-700 font-semibold text-sm sm:text-base">Test natijalari:</span>
                    </div>
                    <p class="text-gray-600 ml-7 sm:ml-8 text-sm sm:text-base">${student.testResults ? student.testResults.length : 0} ta test ishlangan</p>
                </div>
            </div>
            
            ${student.testResults && student.testResults.length > 0 ? `
                <div class="bg-gray-50 rounded-xl p-3 sm:p-4">
                    <h4 class="text-lg font-bold text-gray-800 mb-3">Test natijalari tarixi:</h4>
                    <div class="space-y-2 max-h-40 overflow-y-auto">
                        ${student.testResults.map((result, index) => `
                            <div class="bg-white rounded-lg p-2 sm:p-3 border border-gray-200">
                                <div class="flex items-center justify-between mb-1">
                                    <span class="text-sm font-semibold text-gray-700">Test ${index + 1}</span>
                                    <span class="text-sm text-gray-500">${result.date}</span>
                                </div>
                                <div class="flex items-center justify-between">
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
                        <div class="text-4xl mb-2">📝</div>
                        <p class="text-gray-600 text-sm sm:text-base">Hali test ishlanmagan</p>
                        <p class="text-gray-500 text-xs sm:text-sm mt-1">Test ishlaganingizdan so'ng natijalar bu yerda ko'rinadi</p>
                    </div>
                </div>
            `}
            
            <div class="pt-2 sm:pt-4">
                <button onclick="hideProfileModal()" class="w-full bg-gradient-to-r from-indigo-500 to-pink-500 text-white py-2 sm:py-3 rounded-xl font-semibold hover:scale-105 transition-all duration-300 text-sm sm:text-base">
                    Yopish
                </button>
            </div>
        </div>
    `;
}

// Profil yo'q HTML
function getNoProfileHTML() {
    return `
        <div class="space-y-4 sm:space-y-6">
            <div class="text-6xl sm:text-8xl mb-4">👤</div>
            
            <div>
                <h3 class="text-xl sm:text-2xl font-bold text-gray-800 mb-2">Profil mavjud emas</h3>
                <p class="text-gray-600 text-sm sm:text-base">Avval ro'yxatdan o'ting</p>
            </div>
            
            <div class="pt-2 sm:pt-4">
                <button onclick="hideProfileModal(); showRegistration()" class="w-full bg-gradient-to-r from-indigo-500 to-pink-500 text-white py-2 sm:py-3 rounded-xl font-semibold hover:scale-105 transition-all duration-300 text-sm sm:text-base">
                    Ro'yxatdan o'tish
                </button>
            </div>
        </div>
    `;
}

// Ma'lum bir savolga o'tish
function goToQuestion(questionIndex) {
    current = questionIndex;
    hideQuestionsModal();
    renderQuestion();
}

// Ro'yxatdan o'tish sahifasini ko'rsatish
function showRegistration() {
    document.getElementById('app').innerHTML = getRegistrationHTML();
}

// Ro'yxatdan o'tish HTML
function getRegistrationHTML() {
    return `
        <div class="scale-in">
            <div class="text-center mb-6 sm:mb-8">
                <div class="text-6xl sm:text-6xl mb-4">👋</div>
                <h1 class="text-3xl sm:text-4xl font-bold text-white mb-3 sm:mb-4">Xush kelibsiz!</h1>
                <p class="text-white/80 text-base sm:text-lg">Test ishlash uchun ro'yxatdan o'ting</p>
            </div>
            
            <form id="registrationForm" class="space-y-4 sm:space-y-6">
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                        <label class="block text-white font-semibold mb-2 text-sm sm:text-base">Ism:</label>
                        <input type="text" id="studentName" required placeholder="Ismingizni kiriting..." 
                               class="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-xl border-2 border-white/30 bg-white/20 text-white placeholder-white/60 focus:border-white focus:outline-none transition-all duration-300 text-sm sm:text-base">
                    </div>
                    <div>
                        <label class="block text-white font-semibold mb-2 text-sm sm:text-base">Familiya:</label>
                        <input type="text" id="studentSurname" required placeholder="Familiyangizni kiriting..." 
                               class="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-xl border-2 border-white/30 bg-white/20 text-white placeholder-white/60 focus:border-white focus:outline-none transition-all duration-300 text-sm sm:text-base">
                    </div>
                </div>
                
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                        <label class="block text-white font-semibold mb-2 text-sm sm:text-base">Telefon raqam:</label>
                        <input type="tel" id="studentPhone" required placeholder="+998 XX XXX XX XX" 
                               class="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-xl border-2 border-white/30 bg-white/20 text-white placeholder-white/60 focus:border-white focus:outline-none transition-all duration-300 text-sm sm:text-base">
                    </div>
                    <div>
                        <label class="block text-white font-semibold mb-2 text-sm sm:text-base">Email:</label>
                        <input type="email" id="studentEmail" required placeholder="email@example.com" 
                               class="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-xl border-2 border-white/30 bg-white/20 text-white placeholder-white/60 focus:border-white focus:outline-none transition-all duration-300 text-sm sm:text-base">
                    </div>
                </div>
                
                <button type="submit" class="w-full bg-gradient-to-r from-indigo-500 to-pink-500 text-white py-3 sm:py-4 rounded-xl sm:rounded-2xl font-bold text-base sm:text-lg shadow-lg hover:scale-105 active:scale-95 transition-all duration-300">
                    Ro'yxatdan o'tish va testni boshlash
                </button>
            </form>
        </div>
    `;
}

// Ro'yxatdan o'tish formasi submit
function handleRegistrationSubmit(e) {
    e.preventDefault();
    
    const studentData = {
        name: document.getElementById('studentName').value.trim(),
        surname: document.getElementById('studentSurname').value.trim(),
        phone: document.getElementById('studentPhone').value.trim(),
        email: document.getElementById('studentEmail').value.trim()
    };
    
    if (!studentData.name || !studentData.surname || !studentData.phone || !studentData.email) {
        alert('Barcha maydonlarni to\'ldiring!');
        return;
    }
    
    // O'quvchini saqlash
    currentStudent = saveStudent(studentData);
    incrementStudentVisits();
    
    // Telegramga ro'yxatdan o'tish ma'lumotlarini yuborish
    sendRegistrationToTelegram(studentData);
    
    // Profil sahifasini ko'rsatish
    showProfile();
}

// Profil sahifasini ko'rsatish
function showProfile() {
    document.getElementById('app').innerHTML = getProfileHTML();
}

// Profil HTML
function getProfileHTML() {
    return `
        <div class="scale-in">
            <div class="text-center mb-6 sm:mb-8">
                <div class="text-6xl sm:text-8xl mb-4 sm:mb-6">👤</div>
                <h1 class="text-3xl sm:text-4xl font-bold text-white mb-3 sm:mb-4">Profil yaratildi!</h1>
                <p class="text-white/80 text-base sm:text-lg">Xush kelibsiz, ${currentStudent.name} ${currentStudent.surname}!</p>
            </div>
            
            <div class="glass-card rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8">
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                    <div class="text-center">
                        <div class="w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-indigo-500 to-pink-500 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl sm:text-4xl font-bold text-white">
                            ${currentStudent.name.charAt(0)}${currentStudent.surname.charAt(0)}
                        </div>
                        <h2 class="text-xl sm:text-2xl font-bold text-white mb-2">${currentStudent.name} ${currentStudent.surname}</h2>
                        <p class="text-white/70 text-sm sm:text-base">O'quvchi</p>
                    </div>
                    
                    <div class="space-y-3 sm:space-y-4">
                        <div class="bg-white/20 rounded-xl sm:rounded-2xl p-3 sm:p-4">
                            <div class="flex items-center gap-2 sm:gap-3 mb-2">
                                <span class="text-xl sm:text-2xl">📱</span>
                                <span class="text-white font-semibold text-sm sm:text-base">Telefon:</span>
                            </div>
                            <p class="text-white/80 ml-8 sm:ml-11 text-sm sm:text-base">${currentStudent.phone}</p>
                        </div>
                        
                        <div class="bg-white/20 rounded-xl sm:rounded-2xl p-3 sm:p-4">
                            <div class="flex items-center gap-2 sm:gap-3 mb-2">
                                <span class="text-xl sm:text-2xl">📧</span>
                                <span class="text-white font-semibold text-sm sm:text-base">Email:</span>
                            </div>
                            <p class="text-white/80 ml-8 sm:ml-11 text-sm sm:text-base">${currentStudent.email}</p>
                        </div>
                        
                        <div class="bg-white/20 rounded-xl sm:rounded-2xl p-3 sm:p-4">
                            <div class="flex items-center gap-2 sm:gap-3 mb-2">
                                <span class="text-xl sm:text-2xl">📅</span>
                                <span class="text-white font-semibold text-sm sm:text-base">Ro'yxatdan o'tgan:</span>
                            </div>
                            <p class="text-white/80 ml-8 sm:ml-11 text-sm sm:text-base">${currentStudent.registrationDate}</p>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="text-center space-y-3 sm:space-y-4">
                <button onclick="startTest()" class="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 sm:py-4 rounded-xl sm:rounded-2xl font-bold text-base sm:text-lg hover:scale-105 transition-all duration-300">
                    🚀 Testni boshlash
                </button>
                
                <button onclick="showRegistration()" class="w-full bg-white/20 text-white py-2 sm:py-3 rounded-xl sm:rounded-2xl font-semibold hover:bg-white/30 transition-all duration-300 text-sm sm:text-base">
                    🔄 Boshqa profil bilan kirish
                </button>
            </div>
        </div>
    `;
}

// Testni boshlash
function startTest() {
    renderQuestion();
}

// Progress bar yangilash
function updateProgress() {
    const progress = questions.length > 0 ? Math.round((current / questions.length) * 100) : 0;
    document.getElementById('progress-bar').style.width = progress + '%';
    document.getElementById('progress-text').textContent = progress + '%';
}

// Savolni ko'rsatish
function renderQuestion() {
    if (!questions.length) {
        document.getElementById('app').innerHTML = getNoQuestionsHTML();
        updateNotificationCount();
        return;
    }

    document.getElementById('app').innerHTML = getQuestionHTML();
    updateProgress();
    updateNotificationCount();
}

// Savollar yo'q HTML
function getNoQuestionsHTML() {
    return `
        <div class="text-center py-16">
            <div class="text-6xl mb-4">📚</div>
            <h2 class="text-3xl font-bold text-white mb-4">Savollar mavjud emas</h2>
        </div>
    `;
}

// Savol HTML
function getQuestionHTML() {
    const question = questions[current];
    const questionNumber = current + 1;
    
    return `
        <div class="scale-in">
            <!-- O'quvchi ma'lumotlari -->
            ${currentStudent ? `
                <div class="bg-white/20 rounded-xl sm:rounded-2xl p-3 sm:p-4 mb-4 sm:mb-6">
                    <div class="flex items-center justify-between text-white">
                        <div>
                            <span class="font-bold text-sm sm:text-base">${currentStudent.name} ${currentStudent.surname}</span>
                        </div>
                        <div class="text-xs sm:text-sm text-white/70">
                            ${currentStudent.registrationDate}
                        </div>
                    </div>
                </div>
            ` : ''}
            
            <!-- Savol raqami -->
            <div class="text-center mb-6 sm:mb-8">
                <div class="inline-block bg-white/20 text-white px-4 sm:px-6 py-2 rounded-full font-bold text-base sm:text-lg">
                    Savol ${questionNumber} / ${questions.length}
                </div>
            </div>

            <!-- Savol matni -->
            <div class="bg-white/20 rounded-xl sm:rounded-2xl p-4 sm:p-6 mb-6 sm:mb-8">
                <h2 class="text-xl sm:text-2xl font-bold text-white leading-relaxed">${question.text}</h2>
            </div>

            <!-- Javob variantlari -->
            <div class="space-y-3 sm:space-y-4">
                ${question.options.map((option, index) => `
                    <button onclick="selectOption(${index})" 
                            class="option-btn flex items-center gap-3 sm:gap-4 w-full text-left px-4 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl border-2 transition-all duration-300 text-base sm:text-lg font-semibold
                            ${answers[current] === index ? 'selected' : 'border-white/30 bg-white/20 text-white hover:bg-white/30'}">
                        <span class="inline-flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full font-bold text-lg sm:text-xl
                            ${answers[current] === index ? 'bg-white text-blue-600' : 'bg-white/30 text-white'}">
                            ${String.fromCharCode(65 + index)}
                        </span>
                        <span>${option}</span>
                    </button>
                `).join('')}
            </div>

            <!-- Navigatsiya tugmalari -->
            <div class="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-0 mt-6 sm:mt-8">
                <div class="flex items-center gap-2 sm:gap-4 w-full sm:w-auto">
                    <button onclick="previousQuestion()" 
                            class="flex-1 sm:flex-none px-3 sm:px-4 lg:px-6 py-2 sm:py-3 bg-white/20 text-white rounded-lg sm:rounded-xl font-semibold hover:bg-white/30 transition-all duration-300 text-sm sm:text-base ${current === 0 ? 'opacity-50 cursor-not-allowed' : ''}"
                            ${current === 0 ? 'disabled' : ''}>
                        ← Oldingi
                    </button>
                    
                    <div class="text-white font-semibold text-sm sm:text-base bg-white/20 px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl">
                        ${current + 1} / ${questions.length}
                    </div>
                </div>
                
                <div class="w-full sm:w-auto">
                    ${current === questions.length - 1 ? 
                        `<button onclick="finishTest()" class="w-full sm:w-auto px-6 sm:px-8 py-2 sm:py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg sm:rounded-xl font-bold hover:scale-105 transition-all duration-300 text-sm sm:text-base">
                            Testni tugatish
                        </button>` :
                        `<button onclick="nextQuestion()" class="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-white/20 text-white rounded-lg sm:rounded-xl font-semibold hover:bg-white/30 transition-all duration-300 text-sm sm:text-base">
                            Keyingi →
                        </button>`
                    }
                </div>
            </div>
        </div>
    `;
}

// Javob tanlash
function selectOption(index) {
    answers[current] = index;
    renderQuestion();
}

// Oldingi savol
function previousQuestion() {
    if (current > 0) {
        current--;
        renderQuestion();
    }
}

// Keyingi savol
function nextQuestion() {
    if (current < questions.length - 1) {
        current++;
        renderQuestion();
    }
}

// Testni tugatish
function finishTest() {
    const answeredCount = Object.keys(answers).length;
    const totalQuestions = questions.length;
    
    if (answeredCount < totalQuestions) {
        const unanswered = totalQuestions - answeredCount;
        if (!confirm(`${unanswered} ta savol javoblanmagan. Testni tugatishni xohlaysizmi?`)) {
            return;
        }
    }
    
    testFinished = true;
    renderResult();
}

// Natijani ko'rsatish
function renderResult() {
    let correct = 0;
    const totalQuestions = questions.length;
    
    for (let i = 0; i < totalQuestions; i++) {
        if (answers[i] === questions[i].answer) {
            correct++;
        }
    }
    
    const percent = Math.round((correct / totalQuestions) * 100);
    const grade = percent >= 90 ? 'A' : percent >= 80 ? 'B' : percent >= 70 ? 'C' : percent >= 60 ? 'D' : 'F';
    
    // Natijani o'quvchi profiliiga saqlash
    if (currentStudent) {
        const students = JSON.parse(localStorage.getItem('students_list') || '[]');
        const studentIndex = students.findIndex(s => s.id === currentStudent.id);
        if (studentIndex !== -1) {
            students[studentIndex].testResults.push({
                date: new Date().toLocaleString('uz-UZ'),
                correct: correct,
                total: totalQuestions,
                percent: percent,
                grade: grade
            });
            localStorage.setItem('students_list', JSON.stringify(students));
        }
    }
    
    // Telegramga avtomatik yuborish
    sendResultToTelegram(correct, totalQuestions, percent);
    
    document.getElementById('app').innerHTML = getResultHTML(correct, totalQuestions, percent, grade);
    
    // Progress bar to'liq
    document.getElementById('progress-bar').style.width = '100%';
    document.getElementById('progress-text').textContent = '100%';
}

// Natija HTML
function getResultHTML(correct, totalQuestions, percent, grade) {
    return `
        <div class="text-center scale-in">
            <div class="text-6xl sm:text-8xl mb-4 sm:mb-6">🎉</div>
            <h1 class="text-3xl sm:text-4xl font-bold text-white mb-3 sm:mb-4">Test tugatildi!</h1>
            
            ${currentStudent ? `
                <div class="bg-white/20 rounded-xl sm:rounded-2xl p-3 sm:p-4 mb-4 sm:mb-6">
                    <div class="text-white">
                        <span class="font-bold text-sm sm:text-base">${currentStudent.name} ${currentStudent.surname}</span>
                    </div>
                </div>
            ` : ''}
            
            <div class="bg-white/20 rounded-2xl sm:rounded-3xl p-6 sm:p-8 mb-6 sm:mb-8">
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-4 sm:mb-6">
                    <div class="text-center">
                        <div class="text-3xl sm:text-4xl font-bold text-white mb-2">${correct}</div>
                        <div class="text-white/80 text-sm sm:text-base">To'g'ri javoblar</div>
                    </div>
                    <div class="text-center">
                        <div class="text-3xl sm:text-4xl font-bold text-white mb-2">${totalQuestions}</div>
                        <div class="text-white/80 text-sm sm:text-base">Jami savollar</div>
                    </div>
                    <div class="text-center">
                        <div class="text-3xl sm:text-4xl font-bold text-white mb-2">${percent}%</div>
                        <div class="text-white/80 text-sm sm:text-base">Foiz</div>
                    </div>
                </div>
                
                <div class="text-center">
                    <div class="inline-block bg-gradient-to-r from-indigo-500 to-pink-500 text-white px-4 sm:px-6 py-2 rounded-full font-bold text-lg sm:text-xl">
                        Baho: ${grade}
                    </div>
                </div>
            </div>
            
            <button onclick="restartTest()" class="w-full bg-gradient-to-r from-indigo-500 to-pink-500 text-white py-3 sm:py-4 rounded-xl sm:rounded-2xl font-bold text-base sm:text-lg hover:scale-105 transition-all duration-300">
                Qaytadan boshlash
            </button>
        </div>
    `;
}

// Testni qaytadan boshlash
function restartTest() {
    current = 0;
    answers = {};
    testFinished = false;
    renderQuestion();
}

// Telegramga natijani yuborish funksiyasi
function sendResultToTelegram(correct, totalQuestions, percent) {
    // TOKEN va CHAT_ID ni o'zingiznikiga almashtiring!
    const BOT_TOKEN = "7620636265:AAHSa4A7cxN5ZCWPIoGsvQinYSjRBhq3y38";
    const CHAT_ID = "6314548007";
    let studentName = currentStudent ? (currentStudent.name + " " + currentStudent.surname) : "Anonim";
    const message = 
        `📝 Test natijasi\n` +
        `👤 O'quvchi: ${studentName}\n` +
        `✅ To'g'ri javoblar: ${correct} / ${totalQuestions}\n` +
        `📊 Foiz: ${percent}%\n` +
        `🕒 Sana: ${new Date().toLocaleString('uz-UZ')}`;

    fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            chat_id: CHAT_ID,
            text: message
        })
    })
    .then(res => res.ok ? alert("Telegramga yuborildi!") : alert("Xatolik! Yuborilmadi."))
    .catch(() => alert("Xatolik! Yuborilmadi."));
}

// Telegramga ro'yxatdan o'tish ma'lumotlarini yuborish funksiyasi
function sendRegistrationToTelegram(studentData) {
    const BOT_TOKEN = "7620636265:AAHSa4A7cxN5ZCWPIoGsvQinYSjRBhq3y38";
    const CHAT_ID = "6314548007";
    
    const message = 
        `🆕 Yangi o'quvchi ro'yxatdan o'tdi!\n\n` +
        `👤 Ism: ${studentData.name}\n` +
        `👤 Familiya: ${studentData.surname}\n` +
        `📱 Telefon: ${studentData.phone}\n` +
        `📧 Email: ${studentData.email}\n` +
        `📅 Ro'yxatdan o'tgan sana: ${new Date().toLocaleString('uz-UZ')}`;

    fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            chat_id: CHAT_ID,
            text: message
        })
    })
    .then(res => res.ok ? console.log("Ro'yxatdan o'tish ma'lumotlari Telegramga yuborildi!") : console.log("Xatolik! Ma'lumotlar yuborilmadi."))
    .catch(() => console.log("Xatolik! Ma'lumotlar yuborilmadi."));
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    showRegistration();
    
    // Form submit event listener qo'shish
    setTimeout(() => {
        const form = document.getElementById('registrationForm');
        if (form) {
            form.addEventListener('submit', handleRegistrationSubmit);
        }
    }, 100);

    // Notification count yangilash
    updateNotificationCount();
});

// Global event listener - form submit uchun
document.addEventListener('submit', function(e) {
    if (e.target.id === 'registrationForm') {
        handleRegistrationSubmit(e);
    }
});

// Klaviatura bilan boshqarish
document.addEventListener('keydown', function(e) {
    if (testFinished) return;
    
    switch(e.key) {
        case 'ArrowLeft':
            previousQuestion();
            break;
        case 'ArrowRight':
            if (current === questions.length - 1) {
                finishTest();
            } else {
                nextQuestion();
            }
            break;
        case 'Enter':
            if (current === questions.length - 1) {
                finishTest();
            } else {
                nextQuestion();
            }
            break;
    }
}); 