import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import QuizList from './pages/QuizList';
import QuizEditor from './pages/QuizEditor';
import QuizRender from './pages/QuizRender';
import { initializeStorage } from './data/localstorage';

// Initialize storage on app load
initializeStorage();

function App() {
  return (
    <DndProvider backend={HTML5Backend}>
      <Router>
        <Routes>
          <Route path="/" element={<QuizList />} />
          <Route path="/quiz/edit" element={<QuizEditor />} />
          <Route path="/quiz/edit/:id" element={<QuizEditor />} />
          <Route path="/quiz/:id" element={<QuizRender />} />
        </Routes>
      </Router>
    </DndProvider>
  );
}

export default App;
