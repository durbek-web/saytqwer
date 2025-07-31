// Global o'zgaruvchilar
let questions = JSON.parse(localStorage.getItem('reading_questions') || '[]');
let current = 0;
let answers = {};
let testFinished = false;
let currentStudent = null;

// Avtomatik test qo'shish tizimi
let autoTestTimer = null;
let lastTestCompletionTime = null;

// Test bazasi - barcha mumkin bo'lgan testlar
const TEST_DATABASE = [
    {
        text: "The Industrial Revolution, which began in Britain in the late 18th century, marked a fundamental change in the way goods were produced. This period saw the transition from manual production methods to machines, new chemical manufacturing and iron production processes, improved efficiency of water power, the increasing use of steam power, and the development of machine tools. The Industrial Revolution also led to the rise of the factory system and the growth of cities. What was the primary technological advancement that enabled the Industrial Revolution?",
        options: [
            "The development of electricity",
            "The invention of the steam engine",
            "The creation of the internet",
            "The discovery of nuclear power"
        ],
        answer: 1
    },
    {
        text: "Climate change refers to long-term shifts in global or regional climate patterns. While climate has changed throughout Earth's history, the current warming trend is of particular significance because it is proceeding at a rate that is unprecedented over the past 10,000 years. According to the Intergovernmental Panel on Climate Change (IPCC), the current warming trend is extremely likely to be the result of human activity since the mid-20th century. The primary cause of current climate change is the increase in greenhouse gas concentrations in the atmosphere. Which of the following best describes the main cause of current climate change?",
        options: [
            "Natural variations in Earth's orbit",
            "Volcanic eruptions",
            "Human activities releasing greenhouse gases",
            "Changes in solar radiation"
        ],
        answer: 2
    },
    {
        text: "Artificial Intelligence (AI) has become one of the most transformative technologies of the 21st century. Machine learning, a subset of AI, enables computers to learn and make decisions without being explicitly programmed for every task. Deep learning, which uses neural networks with multiple layers, has revolutionized fields such as image recognition, natural language processing, and autonomous vehicles. However, AI also raises important ethical questions about privacy, job displacement, and decision-making transparency. What is the primary characteristic of machine learning?",
        options: [
            "It requires explicit programming for every task",
            "It enables computers to learn without explicit programming",
            "It only works with large datasets",
            "It is limited to mathematical calculations"
        ],
        answer: 1
    },
    {
        text: "The human brain is the most complex organ in the human body, containing approximately 86 billion neurons connected by trillions of synapses. It is responsible for all cognitive functions, including memory, learning, decision-making, and consciousness. The brain processes information through electrical and chemical signals, with different regions specialized for specific functions. Recent advances in neuroscience have revealed the brain's remarkable plasticity—its ability to form new neural connections throughout life. What is the approximate number of neurons in the human brain?",
        options: [
            "100 million neurons",
            "1 billion neurons",
            "86 billion neurons",
            "1 trillion neurons"
        ],
        answer: 2
    },
    {
        text: "Quantum computing represents a paradigm shift in computational power, utilizing quantum mechanical phenomena such as superposition and entanglement to process information. Unlike classical computers that use bits (0 or 1), quantum computers use quantum bits or qubits, which can exist in multiple states simultaneously. This allows quantum computers to solve certain problems exponentially faster than classical computers. However, quantum computers are highly sensitive to environmental interference and require extremely low temperatures to operate. What is the fundamental unit of information in quantum computing?",
        options: [
            "Bit (0 or 1)",
            "Byte (8 bits)",
            "Qubit (quantum bit)",
            "Pixel (picture element)"
        ],
        answer: 2
    },
    {
        text: "The theory of evolution by natural selection, proposed by Charles Darwin in 1859, explains how species change over time through the process of adaptation. According to this theory, individuals with traits that are advantageous for survival and reproduction are more likely to pass those traits to their offspring. Over many generations, these advantageous traits become more common in the population, leading to evolutionary change. The theory is supported by extensive evidence from multiple scientific disciplines. What is the primary mechanism driving evolution according to Darwin's theory?",
        options: [
            "Random genetic mutations",
            "Natural selection",
            "Geographic isolation",
            "Artificial breeding"
        ],
        answer: 1
    },
    {
        text: "Renewable energy sources, such as solar, wind, and hydroelectric power, are becoming increasingly important as the world seeks to reduce greenhouse gas emissions and combat climate change. Unlike fossil fuels, renewable energy sources are naturally replenished and produce little to no emissions during operation. Solar energy, which harnesses the power of the sun, has seen dramatic cost reductions in recent years, making it competitive with traditional energy sources in many regions. What is the main advantage of renewable energy sources over fossil fuels?",
        options: [
            "They are always available",
            "They produce no emissions during operation",
            "They are cheaper to install",
            "They require no maintenance"
        ],
        answer: 1
    },
    {
        text: "The human genome, which contains all the genetic information needed to build and maintain a human being, consists of approximately 3 billion base pairs of DNA. This genetic code is organized into 23 pairs of chromosomes and contains an estimated 20,000-25,000 genes. The Human Genome Project, completed in 2003, successfully mapped the entire human genome, providing scientists with a comprehensive understanding of human genetics. This knowledge has revolutionized medicine, enabling the development of personalized treatments and genetic therapies. How many base pairs of DNA are in the human genome?",
        options: [
            "1 billion base pairs",
            "3 billion base pairs",
            "5 billion base pairs",
            "10 billion base pairs"
        ],
        answer: 1
    },
    {
        text: "Space exploration has advanced significantly since the first human spaceflight in 1961. Modern space missions utilize sophisticated technology, including robotic probes, satellites, and space stations. The International Space Station (ISS), a collaborative project involving multiple countries, has been continuously inhabited since 2000 and serves as a laboratory for scientific research in microgravity. Private companies are now also entering the space industry, developing reusable rockets and planning commercial space tourism. What is the primary purpose of the International Space Station?",
        options: [
            "Military surveillance",
            "Commercial space tourism",
            "Scientific research in microgravity",
            "Satellite repair and maintenance"
        ],
        answer: 2
    },
    {
        text: "The internet, originally developed as a military communication network in the 1960s, has evolved into a global system that connects billions of devices worldwide. It operates on a decentralized architecture, with data transmitted through a network of interconnected routers and servers. The World Wide Web, created by Tim Berners-Lee in 1989, provides a user-friendly interface for accessing information on the internet through web browsers. The internet has transformed nearly every aspect of modern life, from communication and commerce to education and entertainment. What was the original purpose of the internet?",
        options: [
            "Commercial communication",
            "Military communication",
            "Academic research",
            "Entertainment and gaming"
        ],
        answer: 1
    },
    {
        text: "The human immune system is a complex network of cells, tissues, and organs that work together to defend the body against harmful pathogens such as bacteria, viruses, and fungi. The immune system has two main components: the innate immune system, which provides immediate but non-specific defense, and the adaptive immune system, which provides long-term, specific immunity. White blood cells, including T cells and B cells, play crucial roles in the adaptive immune response. What are the two main components of the human immune system?",
        options: [
            "Red blood cells and white blood cells",
            "Innate and adaptive immune systems",
            "Bones and muscles",
            "Heart and lungs"
        ],
        answer: 1
    },
    {
        text: "Photosynthesis is the process by which plants, algae, and some bacteria convert light energy into chemical energy that can be used to fuel their activities. During photosynthesis, carbon dioxide and water are converted into glucose and oxygen using energy from sunlight. This process occurs in specialized organelles called chloroplasts, which contain the green pigment chlorophyll. Photosynthesis is essential for life on Earth as it produces oxygen and forms the base of most food chains. What are the main products of photosynthesis?",
        options: [
            "Carbon dioxide and water",
            "Glucose and oxygen",
            "Nitrogen and hydrogen",
            "Methane and carbon monoxide"
        ],
        answer: 1
    },
    {
        text: "The periodic table is a systematic arrangement of chemical elements based on their atomic number, electron configuration, and recurring chemical properties. Elements are organized into periods (rows) and groups (columns), with elements in the same group having similar chemical properties. The periodic table was first developed by Dmitri Mendeleev in 1869 and has since been expanded to include 118 known elements. What is the primary organizing principle of the periodic table?",
        options: [
            "Element names in alphabetical order",
            "Atomic number and chemical properties",
            "Element colors and physical appearance",
            "Discovery date of elements"
        ],
        answer: 1
    },
    {
        text: "The theory of relativity, developed by Albert Einstein in the early 20th century, consists of two parts: special relativity and general relativity. Special relativity deals with the relationship between space and time, while general relativity describes gravity as a curvature of spacetime caused by mass and energy. These theories have revolutionized our understanding of the universe and have been confirmed by numerous experiments and observations. What are the two main parts of Einstein's theory of relativity?",
        options: [
            "Quantum mechanics and classical physics",
            "Special relativity and general relativity",
            "Nuclear physics and particle physics",
            "Thermodynamics and electromagnetism"
        ],
        answer: 1
    },
    {
        text: "The cell is the basic structural and functional unit of all known living organisms. Cells can be classified into two main types: prokaryotic cells, which lack a nucleus and membrane-bound organelles, and eukaryotic cells, which have a nucleus and various organelles. All cells contain genetic material, cytoplasm, and a cell membrane. The cell theory states that all living things are composed of cells, cells are the basic units of life, and all cells come from pre-existing cells. What are the two main types of cells?",
        options: [
            "Plant cells and animal cells",
            "Prokaryotic and eukaryotic cells",
            "Red cells and white cells",
            "Nerve cells and muscle cells"
        ],
        answer: 1
    },
    {
        text: "The water cycle, also known as the hydrologic cycle, describes the continuous movement of water on, above, and below the surface of the Earth. This cycle involves several key processes: evaporation, condensation, precipitation, and collection. Water evaporates from oceans, lakes, and rivers, forms clouds through condensation, falls as precipitation, and eventually returns to water bodies through runoff and groundwater flow. What are the main processes involved in the water cycle?",
        options: [
            "Melting, freezing, and boiling",
            "Evaporation, condensation, precipitation, and collection",
            "Photosynthesis and respiration",
            "Erosion and deposition"
        ],
        answer: 1
    },
    {
        text: "The nervous system is the body's electrical wiring, consisting of the brain, spinal cord, and a vast network of nerves that transmit signals throughout the body. It is divided into two main parts: the central nervous system (CNS), which includes the brain and spinal cord, and the peripheral nervous system (PNS), which includes all the nerves outside the CNS. The nervous system controls all bodily functions, from basic reflexes to complex thoughts and emotions. What are the two main parts of the nervous system?",
        options: [
            "Brain and heart",
            "Central nervous system and peripheral nervous system",
            "Arteries and veins",
            "Bones and muscles"
        ],
        answer: 1
    },
    {
        text: "The digestive system is responsible for breaking down food into nutrients that can be absorbed and used by the body. This process involves several organs working together: the mouth, esophagus, stomach, small intestine, large intestine, liver, and pancreas. Food is mechanically and chemically broken down as it passes through these organs, with nutrients being absorbed into the bloodstream and waste products being eliminated. What is the primary function of the digestive system?",
        options: [
            "To pump blood throughout the body",
            "To break down food into absorbable nutrients",
            "To produce hormones",
            "To filter waste from the blood"
        ],
        answer: 1
    },
    {
        text: "The circulatory system, also known as the cardiovascular system, is responsible for transporting blood, nutrients, oxygen, and waste products throughout the body. It consists of the heart, blood vessels (arteries, veins, and capillaries), and blood. The heart pumps blood through the vessels, delivering oxygen and nutrients to cells while removing carbon dioxide and other waste products. What is the main function of the circulatory system?",
        options: [
            "To digest food",
            "To transport blood and nutrients throughout the body",
            "To produce hormones",
            "To filter the air we breathe"
        ],
        answer: 1
    },
    {
        text: "The respiratory system is responsible for gas exchange, bringing oxygen into the body and removing carbon dioxide. It includes the nose, mouth, throat, windpipe (trachea), bronchi, and lungs. When we breathe in, air travels through these structures to reach the alveoli in the lungs, where oxygen is absorbed into the bloodstream and carbon dioxide is released. What is the primary function of the respiratory system?",
        options: [
            "To pump blood",
            "To exchange gases (oxygen and carbon dioxide)",
            "To digest food",
            "To produce hormones"
        ],
        answer: 1
    },
    // Yangi testlar - har xil javoblar bilan
    {
        text: "The Earth's atmosphere is composed primarily of nitrogen and oxygen, with trace amounts of other gases such as carbon dioxide, argon, and water vapor. The atmosphere plays a crucial role in protecting life on Earth by absorbing harmful ultraviolet radiation from the sun, regulating temperature through the greenhouse effect, and providing the oxygen necessary for respiration. What is the most abundant gas in Earth's atmosphere?",
        options: [
            "Oxygen",
            "Carbon dioxide",
            "Nitrogen",
            "Argon"
        ],
        answer: 2
    },
    {
        text: "The human heart is a muscular organ that pumps blood throughout the circulatory system. It has four chambers: two atria (upper chambers) and two ventricles (lower chambers). The heart beats approximately 60-100 times per minute at rest, pumping about 5 liters of blood per minute. The heart's electrical system controls the rhythm and rate of the heartbeat. How many chambers does the human heart have?",
        options: [
            "Two chambers",
            "Three chambers",
            "Four chambers",
            "Five chambers"
        ],
        answer: 2
    },
    {
        text: "The solar system consists of the Sun and the objects that orbit it, including eight planets, dwarf planets, moons, asteroids, comets, and other celestial bodies. The four inner planets (Mercury, Venus, Earth, and Mars) are terrestrial planets with solid surfaces, while the four outer planets (Jupiter, Saturn, Uranus, and Neptune) are gas giants. Which planet is closest to the Sun?",
        options: [
            "Venus",
            "Mercury",
            "Earth",
            "Mars"
        ],
        answer: 1
    },
    {
        text: "The human skeleton is the internal framework of the body, consisting of 206 bones in adults. The skeleton provides structural support, protects vital organs, enables movement through joints and muscles, produces blood cells in the bone marrow, and stores minerals such as calcium and phosphorus. The skeleton is divided into two main parts: the axial skeleton (skull, spine, and rib cage) and the appendicular skeleton (limbs and their attachments). How many bones are in the adult human skeleton?",
        options: [
            "150 bones",
            "206 bones",
            "250 bones",
            "300 bones"
        ],
        answer: 1
    },
    {
        text: "The process of cellular respiration occurs in the mitochondria of cells and converts glucose and oxygen into carbon dioxide, water, and energy in the form of ATP (adenosine triphosphate). This process is essential for providing energy to cells and is the opposite of photosynthesis. Cellular respiration occurs in three main stages: glycolysis, the Krebs cycle, and the electron transport chain. What is the primary energy molecule produced during cellular respiration?",
        options: [
            "Glucose",
            "ATP",
            "Oxygen",
            "Carbon dioxide"
        ],
        answer: 1
    },
    {
        text: "The human eye is a complex sensory organ that detects light and converts it into electrical signals that are sent to the brain for processing. The eye contains several important structures, including the cornea, iris, pupil, lens, retina, and optic nerve. The retina contains photoreceptor cells called rods and cones that are responsible for detecting light and color. What are the two types of photoreceptor cells in the retina?",
        options: [
            "Rods and cones",
            "Nerves and muscles",
            "Blood vessels and tissues",
            "Bones and cartilage"
        ],
        answer: 0
    },
    {
        text: "The human ear is responsible for hearing and balance. It consists of three main parts: the outer ear, middle ear, and inner ear. The outer ear collects sound waves and directs them to the eardrum. The middle ear contains three small bones that amplify sound vibrations. The inner ear contains the cochlea, which converts sound vibrations into electrical signals, and the vestibular system, which helps maintain balance. What are the three main parts of the human ear?",
        options: [
            "Outer ear, middle ear, and inner ear",
            "Left ear, right ear, and brain",
            "Eardrum, bones, and nerves",
            "Skin, muscle, and bone"
        ],
        answer: 0
    },
    {
        text: "The human liver is the largest internal organ and performs over 500 vital functions. It processes nutrients from food, produces bile to help digest fats, filters toxins from the blood, stores vitamins and minerals, and helps regulate blood sugar levels. The liver is also capable of regenerating itself, which is why it can recover from damage and why liver transplants can involve living donors. What is the largest internal organ in the human body?",
        options: [
            "Heart",
            "Brain",
            "Liver",
            "Lungs"
        ],
        answer: 2
    },
    {
        text: "The human skin is the largest organ of the body and serves as a protective barrier against the external environment. It consists of three main layers: the epidermis (outer layer), dermis (middle layer), and hypodermis (inner layer). The skin helps regulate body temperature, protects against harmful substances, and contains sensory receptors for touch, temperature, and pain. What is the largest organ of the human body?",
        options: [
            "Heart",
            "Brain",
            "Liver",
            "Skin"
        ],
        answer: 3
    },
    {
        text: "The human lungs are the primary organs of respiration, responsible for exchanging oxygen and carbon dioxide between the body and the environment. Each lung is divided into lobes (three in the right lung, two in the left lung) and contains millions of tiny air sacs called alveoli where gas exchange occurs. The lungs work together with the heart and circulatory system to deliver oxygen to all cells in the body. How many lobes does the right lung have?",
        options: [
            "One lobe",
            "Two lobes",
            "Three lobes",
            "Four lobes"
        ],
        answer: 2
    }
];

// Avtomatik test qo'shish funksiyasi
function addAutomaticTests() {
    // Sozlamalarni tekshirish
    const settings = JSON.parse(localStorage.getItem('auto_test_settings') || '{}');
    if (settings.enabled === false) {
        console.log('Avtomatik test qo\'shish o\'chirilgan');
        return;
    }
    
    const usedTests = JSON.parse(localStorage.getItem('used_tests') || '[]');
    const availableTests = TEST_DATABASE.filter(test => 
        !usedTests.some(used => used.text === test.text)
    );
    
    if (availableTests.length === 0) {
        console.log('Barcha testlar ishlatilgan, testlar qayta ishlatiladi');
        localStorage.setItem('used_tests', JSON.stringify([]));
        return addAutomaticTests();
    }
    
    // Sozlamalardan testlar sonini olish
    const testCount = settings.testCount || Math.floor(Math.random() * 6) + 5; // 5-10 ta
    const newTests = [];
    const usedTestTexts = [];
    
    for (let i = 0; i < Math.min(testCount, availableTests.length); i++) {
        const randomIndex = Math.floor(Math.random() * availableTests.length);
        const selectedTest = availableTests[randomIndex];
        
        newTests.push(selectedTest);
        usedTestTexts.push(selectedTest.text);
        
        // Tanlangan testni availableTests dan olib tashlash
        availableTests.splice(randomIndex, 1);
    }
    
    // Yangi testlarni qo'shish
    questions = [...questions, ...newTests];
    localStorage.setItem('reading_questions', JSON.stringify(questions));
    
    // Ishlatilgan testlarni saqlash
    const updatedUsedTests = [...usedTests, ...usedTestTexts];
    localStorage.setItem('used_tests', JSON.stringify(updatedUsedTests));
    
    console.log(`${newTests.length} ta yangi test avtomatik qo'shildi!`);
    
    // Foydalanuvchiga xabar berish
    showAutoTestNotification(newTests.length);
    
    // Notification count yangilash
    updateNotificationCount();
}

// Avtomatik test qo'shish xabarini ko'rsatish
function showAutoTestNotification(testCount) {
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-4 rounded-xl shadow-lg z-50 transform translate-x-full transition-transform duration-500';
    notification.innerHTML = `
        <div class="flex items-center gap-3">
            <div class="text-2xl">🎉</div>
            <div>
                <div class="font-bold">Yangi testlar qo'shildi!</div>
                <div class="text-sm opacity-90">${testCount} ta yangi test mavjud</div>
            </div>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Xabarni ko'rsatish
    setTimeout(() => {
        notification.classList.remove('translate-x-full');
    }, 100);
    
    // Xabarni yashirish
    setTimeout(() => {
        notification.classList.add('translate-x-full');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 500);
    }, 5000);
}

// Test tugagandan keyin avtomatik test qo'shish timerini boshlash
function startAutoTestTimer() {
    // Avvalgi timer-ni to'xtatish
    if (autoTestTimer) {
        clearTimeout(autoTestTimer);
    }
    
    // Sozlamalardan vaqtni olish
    const settings = JSON.parse(localStorage.getItem('auto_test_settings') || '{}');
    const delayMinutes = settings.delay || 2;
    
    // Vaqtni millisekundga o'tkazish
    const delayMs = delayMinutes * 60 * 1000;
    
    // Timer boshlash
    autoTestTimer = setTimeout(() => {
        addAutomaticTests();
        lastTestCompletionTime = new Date().toISOString();
        localStorage.setItem('last_test_completion', lastTestCompletionTime);
    }, delayMs);
    
    console.log(`Avtomatik test qo'shish timer boshladi (${delayMinutes} daqiqa)`);
}

// Sahifa yuklanganda avtomatik test qo'shishni tekshirish
function checkAutoTestAddition() {
    // Sozlamalarni tekshirish
    const settings = JSON.parse(localStorage.getItem('auto_test_settings') || '{}');
    if (settings.enabled === false) {
        console.log('Avtomatik test qo\'shish o\'chirilgan');
        return;
    }
    
    const lastCompletion = localStorage.getItem('last_test_completion');
    if (lastCompletion) {
        const lastTime = new Date(lastCompletion);
        const currentTime = new Date();
        const timeDiff = currentTime - lastTime;
        
        // Sozlamalardan vaqtni olish
        const delayMinutes = settings.delay || 2;
        const delayMs = delayMinutes * 60 * 1000;
        
        // Agar oxirgi test tugatilganidan ko'p vaqt o'tgan bo'lsa
        if (timeDiff > delayMs) {
            console.log(`Oxirgi test tugatilganidan ${delayMinutes} daqiqadan ko'p vaqt o'tgan, yangi testlar qo'shiladi`);
            addAutomaticTests();
            localStorage.setItem('last_test_completion', currentTime.toISOString());
        } else {
            console.log(`Oxirgi test tugatilganidan ${Math.round(timeDiff / 60000)} daqiqa o'tgan, hali vaqt emas`);
        }
    } else {
        console.log('Oxirgi test tugatilgan vaqt topilmadi');
    }
}

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
        <div class="scale-in flex flex-col justify-center min-h-full">
            <div class="text-center mb-4 sm:mb-6">
                <div class="text-4xl sm:text-5xl lg:text-6xl mb-3 sm:mb-4">👋</div>
                <h1 class="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2 sm:mb-3">Xush kelibsiz!</h1>
                <p class="text-white/80 text-base sm:text-lg">Test ishlash uchun ro'yxatdan o'ting</p>
            </div>
            
            <form id="registrationForm" class="space-y-3 sm:space-y-4">
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                        <label class="block text-white font-semibold mb-2 text-base sm:text-lg">Ism:</label>
                        <input type="text" id="studentName" required placeholder="Ismingizni kiriting..." 
                               class="w-full px-4 sm:px-5 py-3 sm:py-4 rounded-xl border-2 border-white/30 bg-white/20 text-white placeholder-white/60 focus:border-white focus:outline-none transition-all duration-300 text-base sm:text-lg">
                    </div>
                    <div>
                        <label class="block text-white font-semibold mb-2 text-base sm:text-lg">Familiya:</label>
                        <input type="text" id="studentSurname" required placeholder="Familiyangizni kiriting..." 
                               class="w-full px-4 sm:px-5 py-3 sm:py-4 rounded-xl border-2 border-white/30 bg-white/20 text-white placeholder-white/60 focus:border-white focus:outline-none transition-all duration-300 text-base sm:text-lg">
                    </div>
                </div>
                
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                        <label class="block text-white font-semibold mb-2 text-base sm:text-lg">Telefon raqam:</label>
                        <input type="tel" id="studentPhone" required placeholder="+998 XX XXX XX XX" 
                               class="w-full px-4 sm:px-5 py-3 sm:py-4 rounded-xl border-2 border-white/30 bg-white/20 text-white placeholder-white/60 focus:border-white focus:outline-none transition-all duration-300 text-base sm:text-lg">
                    </div>
                    <div>
                        <label class="block text-white font-semibold mb-2 text-base sm:text-lg">Email:</label>
                        <input type="email" id="studentEmail" required placeholder="email@example.com" 
                               class="w-full px-4 sm:px-5 py-3 sm:py-4 rounded-xl border-2 border-white/30 bg-white/20 text-white placeholder-white/60 focus:border-white focus:outline-none transition-all duration-300 text-base sm:text-lg">
                    </div>
                </div>
                
                <button type="submit" class="w-full bg-gradient-to-r from-indigo-500 to-pink-500 text-white py-4 sm:py-5 rounded-xl sm:rounded-2xl font-bold text-lg sm:text-xl shadow-lg hover:scale-105 active:scale-95 transition-all duration-300 mt-3">
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
        <div class="scale-in flex flex-col justify-center min-h-full">
            <div class="text-center mb-3 sm:mb-4">
                <div class="text-3xl sm:text-4xl lg:text-5xl mb-2 sm:mb-3">👤</div>
                <h1 class="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-1 sm:mb-2">Profil yaratildi!</h1>
                <p class="text-white/80 text-sm sm:text-base">Xush kelibsiz, ${currentStudent.name} ${currentStudent.surname}!</p>
            </div>
            
            <div class="glass-card rounded-2xl sm:rounded-3xl p-3 sm:p-4 lg:p-6 mb-3 sm:mb-4">
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
                    <div class="text-center">
                        <div class="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-gradient-to-br from-indigo-500 to-pink-500 rounded-full mx-auto mb-2 sm:mb-3 flex items-center justify-center text-lg sm:text-xl lg:text-2xl font-bold text-white">
                            ${currentStudent.name.charAt(0)}${currentStudent.surname.charAt(0)}
                        </div>
                        <h2 class="text-base sm:text-lg lg:text-xl font-bold text-white mb-1">${currentStudent.name} ${currentStudent.surname}</h2>
                        <p class="text-white/70 text-sm sm:text-base">O'quvchi</p>
                    </div>
                    
                    <div class="space-y-2 sm:space-y-3">
                        <div class="bg-white/20 rounded-xl sm:rounded-2xl p-2 sm:p-3">
                            <div class="flex items-center gap-2 sm:gap-3 mb-1">
                                <span class="text-base sm:text-lg lg:text-xl">📱</span>
                                <span class="text-white font-semibold text-sm sm:text-base">Telefon:</span>
                            </div>
                            <p class="text-white/80 ml-5 sm:ml-6 lg:ml-8 text-sm sm:text-base break-all">${currentStudent.phone}</p>
                        </div>
                        
                        <div class="bg-white/20 rounded-xl sm:rounded-2xl p-2 sm:p-3">
                            <div class="flex items-center gap-2 sm:gap-3 mb-1">
                                <span class="text-base sm:text-lg lg:text-xl">📧</span>
                                <span class="text-white font-semibold text-sm sm:text-base">Email:</span>
                            </div>
                            <p class="text-white/80 ml-5 sm:ml-6 lg:ml-8 text-sm sm:text-base break-all">${currentStudent.email}</p>
                        </div>
                        
                        <div class="bg-white/20 rounded-xl sm:rounded-2xl p-2 sm:p-3">
                            <div class="flex items-center gap-2 sm:gap-3 mb-1">
                                <span class="text-base sm:text-lg lg:text-xl">📅</span>
                                <span class="text-white font-semibold text-sm sm:text-base">Ro'yxatdan o'tgan:</span>
                            </div>
                            <p class="text-white/80 ml-5 sm:ml-6 lg:ml-8 text-sm sm:text-base">${currentStudent.registrationDate}</p>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="text-center space-y-2 sm:space-y-3">
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
    
    // Matnni qisqartirish (dastlabki 150 belgi)
    const shortText = question.text.length > 150 ? question.text.substring(0, 150) + '...' : question.text;
    
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
                <div id="questionText-${current}" class="mb-4">
                    <p class="text-lg sm:text-xl font-semibold text-white leading-relaxed">${shortText}</p>
                </div>
                
                ${question.text.length > 150 ? `
                    <button onclick="showFullText(${current})" 
                            class="bg-gradient-to-r from-indigo-500 to-pink-500 text-white px-4 py-2 rounded-lg font-semibold hover:scale-105 transition-all duration-300 text-sm sm:text-base">
                        📖 Reading
                    </button>
                ` : ''}
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

// To'liq matnni ko'rsatish funksiyasi
function showFullText(questionIndex) {
    const question = questions[questionIndex];
    const textContainer = document.getElementById(`questionText-${questionIndex}`);
    
    if (textContainer) {
        textContainer.innerHTML = `
            <p class="text-lg sm:text-xl font-semibold text-white leading-relaxed">${question.text}</p>
        `;
        
        // Reading tugmasini Hide tugmasiga o'zgartirish
        const button = textContainer.nextElementSibling;
        if (button && button.tagName === 'BUTTON') {
            button.innerHTML = '📖 Hide';
            button.onclick = () => hideFullText(questionIndex);
        }
    }
}

// Matnni yashirish funksiyasi
function hideFullText(questionIndex) {
    const question = questions[questionIndex];
    const textContainer = document.getElementById(`questionText-${questionIndex}`);
    
    if (textContainer) {
        // Matnni qisqartirish
        const shortText = question.text.length > 150 ? question.text.substring(0, 150) + '...' : question.text;
        
        textContainer.innerHTML = `
            <p class="text-lg sm:text-xl font-semibold text-white leading-relaxed">${shortText}</p>
        `;
        
        // Hide tugmasini Reading tugmasiga qaytarish
        const button = textContainer.nextElementSibling;
        if (button && button.tagName === 'BUTTON') {
            button.innerHTML = '📖 Reading';
            button.onclick = () => showFullText(questionIndex);
        }
    }
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
    
    // Avtomatik test qo'shish timerini boshlash
    startAutoTestTimer();
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
    
    // Avtomatik test qo'shishni tekshirish
    checkAutoTestAddition();
    
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