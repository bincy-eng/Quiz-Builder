// localStorage service for quiz persistence
const STORAGE_KEYS = {
  QUIZZES: 'quizbuilder.quizzes',
  INITIALIZED: 'quizbuilder.initialized'
};

// Safe JSON parse with fallback
const safeParse = (jsonString, fallback = null) => {
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    console.error('Failed to parse JSON:', error);
    return fallback;
  }
};

// Safe JSON stringify
const safeStringify = (data) => {
  try {
    return JSON.stringify(data);
  } catch (error) {
    console.error('Failed to stringify data:', error);
    throw new Error('Failed to save data');
  }
};

// Generate unique ID
const generateId = () => {
  return crypto.randomUUID ? crypto.randomUUID() : `quiz_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Get all quizzes
export const getAllQuizzes = () => {
  try {
    const quizzesJson = localStorage.getItem(STORAGE_KEYS.QUIZZES);
    return safeParse(quizzesJson, []);
  } catch (error) {
    console.error('Failed to get quizzes:', error);
    return [];
  }
};

// Get quiz by ID
export const getQuizById = (id) => {
  try {
    const quizzes = getAllQuizzes();
    return quizzes.find(quiz => quiz.id === id) || null;
  } catch (error) {
    console.error('Failed to get quiz:', error);
    return null;
  }
};

// Save quiz (create or update)
export const saveQuiz = (quizData) => {
  try {
    const quizzes = getAllQuizzes();
    const now = new Date().toISOString();
    
    if (quizData.id) {
      // Update existing quiz
      const index = quizzes.findIndex(q => q.id === quizData.id);
      if (index !== -1) {
        quizzes[index] = {
          ...quizzes[index],
          ...quizData,
          updatedAt: now
        };
      }
    } else {
      // Create new quiz
      const newQuiz = {
        id: generateId(),
        title: quizData.title || 'Untitled Quiz',
        blocks: quizData.blocks || [],
        published: false,
        createdAt: now,
        updatedAt: now
      };
      quizzes.push(newQuiz);
      quizData.id = newQuiz.id; // Set the ID for return
    }
    
    localStorage.setItem(STORAGE_KEYS.QUIZZES, safeStringify(quizzes));
    return quizData.id;
  } catch (error) {
    console.error('Failed to save quiz:', error);
    if (error.name === 'QuotaExceededError') {
      throw new Error('Storage quota exceeded. Please delete some quizzes.');
    }
    throw new Error('Failed to save quiz');
  }
};

// Delete quiz
export const deleteQuiz = (id) => {
  try {
    const quizzes = getAllQuizzes();
    const filtered = quizzes.filter(quiz => quiz.id !== id);
    localStorage.setItem(STORAGE_KEYS.QUIZZES, safeStringify(filtered));
    return true;
  } catch (error) {
    console.error('Failed to delete quiz:', error);
    throw new Error('Failed to delete quiz');
  }
};

// Publish quiz
export const publishQuiz = (id) => {
  try {
    const quizzes = getAllQuizzes();
    const index = quizzes.findIndex(q => q.id === id);
    
    if (index !== -1) {
      quizzes[index].published = true;
      quizzes[index].updatedAt = new Date().toISOString();
      localStorage.setItem(STORAGE_KEYS.QUIZZES, safeStringify(quizzes));
      return true;
    }
    return false;
  } catch (error) {
    console.error('Failed to publish quiz:', error);
    throw new Error('Failed to publish quiz');
  }
};

// Initialize storage with existing data
export const initializeStorage = () => {
  try {
    const isInitialized = localStorage.getItem(STORAGE_KEYS.INITIALIZED);
    
    if (!isInitialized) {
      const now = new Date().toISOString();
      const seedQuizzes = [
        {
          id: generateId(),
          title: 'JavaScript Basics',
          blocks: [
            {
              id: generateId(),
              type: 'heading',
              content: 'JavaScript Fundamentals Quiz'
            },
            {
              id: generateId(),
              type: 'question',
              content: 'What is JavaScript?',
              questionType: 'single',
              options: ['A programming language', 'Brand', 'A framework']
            },
            {
              id: generateId(),
              type: 'question',
              content: 'Select all valid data types:',
              questionType: 'multi',
              options: ['String', 'Number', 'Boolean', 'Color']
            },
            {
              id: generateId(),
              type: 'button',
              content: 'Submit'
            },
            {
              id: generateId(),
              type: 'footer',
              content: 'Thank you for taking this quiz!'
            }
          ],
          published: true,
          createdAt: now,
          updatedAt: now
        },
        {
          id: generateId(),
          title: 'React Basics',
          blocks: [
            {
              id: generateId(),
              type: 'heading',
              content: 'React Quiz'
            },
            {
              id: generateId(),
              type: 'question',
              content: 'What is React?',
              questionType: 'text',
              options: []
            },
            {
              id: generateId(),
              type: 'footer',
              content: 'Thank you for taking this quiz!'
            }
          ],
          published: false,
          createdAt: now,
          updatedAt: now
        }
      ];
      
      localStorage.setItem(STORAGE_KEYS.QUIZZES, safeStringify(seedQuizzes));
      localStorage.setItem(STORAGE_KEYS.INITIALIZED, 'true');
    }
  } catch (error) {
    console.error('Failed to initialize storage:', error);
  }
};
