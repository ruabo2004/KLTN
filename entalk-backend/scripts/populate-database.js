/**
 * Script để populate Firestore với sample data
 * Chạy: node scripts/populate-database.js
 */

require('dotenv').config();
const { db } = require('../src/config/firebase');

// Sample Lessons Data
const lessonsData = [
  {
    id: 'lesson-001',
    title: 'Phát âm nguyên âm cơ bản',
    description: 'Học cách phát âm các nguyên âm /i:/, /ɪ/, /e/, /æ/ trong tiếng Anh',
    level: 'beginner',
    category: 'pronunciation',
    order: 1,
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'lesson-002',
    title: 'Chào hỏi và giới thiệu',
    description: 'Các câu chào hỏi và giới thiệu bản thân thông dụng',
    level: 'beginner',
    category: 'sentence',
    order: 2,
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'lesson-003',
    title: 'Đặt câu hỏi với "Wh-"',
    description: 'Thực hành phát âm câu hỏi với What, Where, When, Why, How',
    level: 'beginner',
    category: 'sentence',
    order: 3,
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'lesson-004',
    title: 'Phụ âm khó /θ/ và /ð/',
    description: 'Cách phát âm "th" trong think và this',
    level: 'intermediate',
    category: 'pronunciation',
    order: 4,
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'lesson-005',
    title: 'Giao tiếp công sở',
    description: 'Các câu giao tiếp thông dụng trong môi trường công sở',
    level: 'intermediate',
    category: 'sentence',
    order: 5,
    isActive: true,
    createdAt: new Date().toISOString(),
  },
];

// Sample Exercises Data (cho mỗi lesson)
const exercisesData = {
  'lesson-001': [
    {
      text: 'I eat three meals a day.',
      phonetic: '/aɪ iːt θriː miːlz ə deɪ/',
      audioUrl: 'https://example.com/audio/lesson1-ex1.mp3',
      order: 1,
      difficulty: 'easy',
      tips: 'Chú ý phát âm dài ở "eat" (/iːt/) và "three" (/θriː/)',
    },
    {
      text: 'She needs to sleep early.',
      phonetic: '/ʃiː niːdz tuː sliːp ˈɜːli/',
      audioUrl: 'https://example.com/audio/lesson1-ex2.mp3',
      order: 2,
      difficulty: 'easy',
      tips: 'Phát âm "she" với âm /ʃ/, không phải /s/',
    },
    {
      text: 'We see the green trees.',
      phonetic: '/wiː siː ðə ɡriːn triːz/',
      audioUrl: 'https://example.com/audio/lesson1-ex3.mp3',
      order: 3,
      difficulty: 'medium',
      tips: 'Nhiều âm /iː/ dài trong câu này',
    },
  ],
  'lesson-002': [
    {
      text: 'Hello, my name is John.',
      phonetic: '/həˈloʊ maɪ neɪm ɪz dʒɑːn/',
      audioUrl: 'https://example.com/audio/lesson2-ex1.mp3',
      order: 1,
      difficulty: 'easy',
      tips: 'Câu chào hỏi cơ bản nhất',
    },
    {
      text: 'Nice to meet you.',
      phonetic: '/naɪs tuː miːt juː/',
      audioUrl: 'https://example.com/audio/lesson2-ex2.mp3',
      order: 2,
      difficulty: 'easy',
      tips: 'Phát âm "meet" dài (/miːt/), khác với "mit"',
    },
    {
      text: 'How are you doing today?',
      phonetic: '/haʊ ɑːr juː ˈduːɪŋ təˈdeɪ/',
      audioUrl: 'https://example.com/audio/lesson2-ex3.mp3',
      order: 3,
      difficulty: 'medium',
      tips: 'Chú ý ngữ điệu lên ở cuối câu hỏi',
    },
  ],
  'lesson-003': [
    {
      text: 'What is your name?',
      phonetic: '/wɑːt ɪz jɔːr neɪm/',
      audioUrl: 'https://example.com/audio/lesson3-ex1.mp3',
      order: 1,
      difficulty: 'easy',
      tips: 'Giọng lên ở cuối câu hỏi',
    },
    {
      text: 'Where do you live?',
      phonetic: '/wer duː juː lɪv/',
      audioUrl: 'https://example.com/audio/lesson3-ex2.mp3',
      order: 2,
      difficulty: 'easy',
      tips: 'Nhấn mạnh vào "where" và "live"',
    },
    {
      text: 'Why are you learning English?',
      phonetic: '/waɪ ɑːr juː ˈlɜːrnɪŋ ˈɪŋɡlɪʃ/',
      audioUrl: 'https://example.com/audio/lesson3-ex3.mp3',
      order: 3,
      difficulty: 'medium',
      tips: 'Câu hỏi dài, tập ngắt nghỉ đúng chỗ',
    },
  ],
  'lesson-004': [
    {
      text: 'I think this is the right path.',
      phonetic: '/aɪ θɪŋk ðɪs ɪz ðə raɪt pæθ/',
      audioUrl: 'https://example.com/audio/lesson4-ex1.mp3',
      order: 1,
      difficulty: 'hard',
      tips: 'Lưỡi chạm răng trên khi phát âm "th" trong "think" và "path"',
    },
    {
      text: 'The weather is getting better.',
      phonetic: '/ðə ˈweðər ɪz ˈɡetɪŋ ˈbetər/',
      audioUrl: 'https://example.com/audio/lesson4-ex2.mp3',
      order: 2,
      difficulty: 'hard',
      tips: '"The" và "weather" có âm /ð/ (có rung giây thanh)',
    },
    {
      text: 'Those three things are theirs.',
      phonetic: '/ðoʊz θriː θɪŋz ɑːr ðerz/',
      audioUrl: 'https://example.com/audio/lesson4-ex3.mp3',
      order: 3,
      difficulty: 'hard',
      tips: 'Câu khó với nhiều âm "th" khác nhau',
    },
  ],
  'lesson-005': [
    {
      text: 'Could you please send me the report?',
      phonetic: '/kʊd juː pliːz send miː ðə rɪˈpɔːrt/',
      audioUrl: 'https://example.com/audio/lesson5-ex1.mp3',
      order: 1,
      difficulty: 'medium',
      tips: 'Câu lịch sự trong email công việc',
    },
    {
      text: 'Let me schedule a meeting with you.',
      phonetic: '/let miː ˈskedʒuːl ə ˈmiːtɪŋ wɪð juː/',
      audioUrl: 'https://example.com/audio/lesson5-ex2.mp3',
      order: 2,
      difficulty: 'medium',
      tips: '"Schedule" có thể đọc /ˈskedʒuːl/ (Mỹ) hoặc /ˈʃedjuːl/ (Anh)',
    },
    {
      text: 'I will follow up with the client tomorrow.',
      phonetic: '/aɪ wɪl ˈfɑːloʊ ʌp wɪð ðə ˈklaɪənt təˈmɑːroʊ/',
      audioUrl: 'https://example.com/audio/lesson5-ex3.mp3',
      order: 3,
      difficulty: 'medium',
      tips: 'Nhấn mạnh vào "follow up" và "tomorrow"',
    },
  ],
};

// Sample Scenarios Data (cho Role-Play)
const scenariosData = [
  {
    id: 'scenario-001',
    title: 'Đặt đồ ăn tại nhà hàng',
    description: 'Bạn là khách hàng đang đặt món ăn. AI sẽ đóng vai nhân viên phục vụ.',
    level: 'beginner',
    category: 'restaurant',
    systemPrompt: 'You are a friendly waiter at a restaurant. Help the customer order food. Speak naturally and ask follow-up questions.',
    aiOpeningLine: 'Hi, welcome to our restaurant! What can I get for you today?',
    suggestedResponses: [
      'I would like to order a pizza, please.',
      'Can I see the menu?',
      'What do you recommend?',
    ],
    order: 1,
    isActive: true,
    estimatedTurns: 5,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'scenario-002',
    title: 'Hỏi đường',
    description: 'Bạn bị lạc và cần hỏi đường. AI sẽ đóng vai người dân địa phương.',
    level: 'beginner',
    category: 'directions',
    systemPrompt: 'You are a helpful local person. Give clear directions to the tourist.',
    aiOpeningLine: 'Hello! You look lost. Can I help you find something?',
    suggestedResponses: [
      'Yes, how do I get to the train station?',
      'I am looking for the museum.',
      'Where is the nearest bus stop?',
    ],
    order: 2,
    isActive: true,
    estimatedTurns: 4,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'scenario-003',
    title: 'Phỏng vấn xin việc',
    description: 'Bạn đang phỏng vấn cho vị trí công việc. AI sẽ đóng vai nhà tuyển dụng.',
    level: 'intermediate',
    category: 'job_interview',
    systemPrompt: 'You are a professional interviewer for a software company. Ask about experience, skills, and motivation.',
    aiOpeningLine: 'Good morning! Thank you for coming. Can you tell me a bit about yourself?',
    suggestedResponses: [
      'Hello, my name is... I have 3 years of experience in...',
      'I graduated from... and I specialize in...',
      'I am very interested in this position because...',
    ],
    order: 3,
    isActive: true,
    estimatedTurns: 6,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'scenario-004',
    title: 'Mua sắm quần áo',
    description: 'Bạn đang mua sắm tại cửa hàng quần áo. AI sẽ đóng vai nhân viên bán hàng.',
    level: 'beginner',
    category: 'shopping',
    systemPrompt: 'You are a friendly sales assistant at a clothing store. Help customers find what they need.',
    aiOpeningLine: 'Hi there! Are you looking for something specific today?',
    suggestedResponses: [
      'Yes, I need a new shirt.',
      'Do you have this in a different size?',
      'How much is this jacket?',
    ],
    order: 4,
    isActive: true,
    estimatedTurns: 5,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'scenario-005',
    title: 'Gọi điện khiếu nại dịch vụ',
    description: 'Bạn gọi điện để khiếu nại về dịch vụ không tốt. AI là nhân viên chăm sóc khách hàng.',
    level: 'advanced',
    category: 'customer_service',
    systemPrompt: 'You are a customer service representative. Listen to complaints and offer solutions professionally.',
    aiOpeningLine: 'Good afternoon, customer service. How can I help you today?',
    suggestedResponses: [
      'I have a problem with my order.',
      'The product I received is damaged.',
      'I would like to request a refund.',
    ],
    order: 5,
    isActive: true,
    estimatedTurns: 7,
    createdAt: new Date().toISOString(),
  },
];

// Main populate function
async function populateDatabase() {
  console.log('🚀 Bắt đầu populate database...\n');

  try {
    // 1. Populate Lessons
    console.log('📚 Đang thêm lessons...');
    for (const lesson of lessonsData) {
      await db.collection('lessons').doc(lesson.id).set(lesson);
      console.log(`   ✅ Added lesson: ${lesson.title}`);

      // Add exercises for this lesson
      if (exercisesData[lesson.id]) {
        console.log(`   📝 Đang thêm exercises cho ${lesson.id}...`);
        for (const exercise of exercisesData[lesson.id]) {
          await db
            .collection('lessons')
            .doc(lesson.id)
            .collection('exercises')
            .add(exercise);
        }
        console.log(`   ✅ Added ${exercisesData[lesson.id].length} exercises`);
      }
    }

    // 2. Populate Scenarios
    console.log('\n🎭 Đang thêm scenarios...');
    for (const scenario of scenariosData) {
      await db.collection('scenarios').doc(scenario.id).set(scenario);
      console.log(`   ✅ Added scenario: ${scenario.title}`);
    }

    console.log('\n✅ ===================================');
    console.log('✅ HOÀN THÀNH POPULATE DATABASE!');
    console.log('✅ ===================================');
    console.log(`📊 Tổng kết:`);
    console.log(`   - ${lessonsData.length} lessons`);
    console.log(`   - ${Object.values(exercisesData).flat().length} exercises`);
    console.log(`   - ${scenariosData.length} scenarios`);
    console.log('\n🎉 Database đã sẵn sàng để sử dụng!');

    process.exit(0);
  } catch (error) {
    console.error('❌ Lỗi khi populate database:', error);
    process.exit(1);
  }
}

// Run the script
populateDatabase();


