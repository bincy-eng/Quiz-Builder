import React, { useState, useEffect } from 'react'
import { getAllQuizzes, deleteQuiz } from '../data/localstorage';
import { useNavigate } from 'react-router-dom';

function QuizList() {
  const [quizzes, setQuizzes] = useState([]);
  const navigate = useNavigate();
  const [error , setError]=useState('');

  useEffect(() => {
    loadQuizzes();

  }, [])

  const loadQuizzes = () => {
    const getData = getAllQuizzes();
    setQuizzes(getData);
    try{
      setError('');
    }catch(err){
    setError('error');
    }
  }

  const handleCreate = () => {
    navigate('/quiz/edit');
  };
  const handleEdit = (id) => {
    navigate(`/quiz/edit/${id}`);
  };
  const handleView = (id) => {
    navigate(`/quiz/${id}`);
  };
  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this quiz?')) {
      try {
        deleteQuiz(id);
        loadQuizzes();
        setError('');
      } catch (err) {
        setError('Failed to delete quiz');
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };


  return (

    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className='text-3xl font-bold text-gray-900'>Quiz Builder</h1>
        <button className="bg-green-600 text-white px-4 py-2 rounded" onClick={handleCreate}>
          + Create Quiz
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <ul className='divide-y divide-gray-200'>
        {quizzes.map((quiz) => (
          <li className='border-b border-gray-200 hover:bg-gray-50 transition-colors' key={quiz.id}><div>
            <div className='px-6 py-4 flex items-center justify-between gap-4'>
              <div className='flex-1 min-w-0 flex item-center justify-between'>
                <h3 className='text-lg font-semibold text-blue-950 truncate'>{quiz.title}</h3>
                <div className='flex items-center gap-6 text-sm shrink-0'>
                  <span className='text-gray-500 w-48 hidden md:inline'>Updated :{formatDate(quiz.updatedAt)}</span>
                  <span>{quiz.published ? (<>
                    <span className='text-green-800'>Published</span>
                  </>) : (
                    <>
                      <span className='text-amber-700'>Draft</span>
                    </>
                  )} </span>
                </div>
                <div>
                  <button className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors" 
                  onClick={() => handleView(quiz.id)}>View</button>
                  <button className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors" 
                  onClick={() => handleEdit(quiz.id)}>Edit</button>
                  <button onClick={() => handleDelete(quiz.id)}>Delete</button>
                </div>
              </div>
            </div>
          </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default QuizList
