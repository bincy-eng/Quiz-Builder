import React,{useState,useEffect} from 'react'
import { getQuizById } from '../data/localstorage';
import { useParams,useNavigate } from 'react-router-dom';

function QuizRender() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [error, setError] = useState('');

   useEffect(() => {
    const loadedQuiz = getQuizById(id);
    if (loadedQuiz) {
      setQuiz(loadedQuiz);
    } else {
      setError('Quiz not found');
    }
  }, [id]);
  const handleSingleChoice = (blockId, value) =>{
    setAnswers({...answers, [blockId] : value})
  }
    const handleTextInput = (blockId, value) => {
    setAnswers({ ...answers, [blockId]: value });
  };
  const handleMultiChoice = (blockId, value )=>{
    const current = answers[blockId] || [];
    const updated = current.includes(value)
      ? current.filter(v => v !== value)
      : [...current, value];
    setAnswers({ ...answers, [blockId]: updated });
  }


  const renderBlock = (block) => {
  if (!block) return null;

  switch (block.type) {
    case 'heading':
      return (
        <div key={block.id} className="my-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 leading-tight">
            {block.content}
          </h2>
        </div>
      );

    case 'question':
      return (
        <div key={block.id} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm mb-6 transition-all hover:shadow-md">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            {block.content}
          </h3>

          <div className="space-y-3">
            {/* Single Choice (Radio) */}
            {block.questionType === 'single' && block.options?.map((option, index) => (
              <label key={index} className="flex items-center p-3 border rounded-lg hover:bg-indigo-50 cursor-pointer transition-colors group">
                <input
                  type="radio"
                  name={block.id}
                  value={option}
                  checked={answers[block.id] === option}
                  onChange={(e) => handleSingleChoice(block.id, e.target.value)}
                  className="w-4 h-4 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="ml-3 text-gray-700 group-hover:text-indigo-900 font-medium">
                  {option}
                </span>
              </label>
            ))}

            {/* Multiple Choice (Checkbox) */}
            {block.questionType === 'multi' && block.options?.map((option, index) => (
              <label key={index} className="flex items-center p-3 border rounded-lg hover:bg-blue-50 cursor-pointer transition-colors group">
                <input
                  type="checkbox"
                  value={option}
                  checked={(answers[block.id] || []).includes(option)}
                  onChange={(e) => handleMultiChoice(block.id, e.target.value)}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="ml-3 text-gray-700 group-hover:text-blue-900 font-medium">
                  {option}
                </span>
              </label>
            ))}

            {/* Text Input */}
            {block.questionType === 'text' && (
              <textarea
                className="w-full p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-gray-50 hover:bg-white"
                value={answers[block.id] || ''}
                onChange={(e) => handleTextInput(block.id, e.target.value)}
                placeholder="Type your answer here..."
                rows={4}
              />
            )}
          </div>
        </div>
      );

    case 'button':
      return (
        <div key={block.id} className="flex justify-center my-6">
          <button className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all active:scale-95">
            {block.content}
          </button>
        </div>
      );

    case 'footer':
      return (
        <div key={block.id} className="mt-12 mb-8 pt-6 border-t border-gray-100 text-center">
          <p className="text-gray-400 text-sm italic italic tracking-wide">
            {block.content}
          </p>
        </div>
      );

    default:
      return null;
  }
};

if (error) {
    return (
      <div className="flex items-center justify-center bg-gray-50 p-6">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center border border-red-100 ">
          <h2>{error}</h2>
          <button onClick={() => navigate('/')}>Back to Home</button>
        </div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="quiz-render-container">
        <div className="loading-state">Loading...</div>
      </div>
    );
  }

  if (!quiz.published) {
    return (
      <div className="quiz-render-container">
        <div className="not-published-state">
          <h2 className='text-2xl font-extrabold text-gray-900 mb-3"'>  Not Published Yet</h2>
          <p className='font-bold text-amber-600'>This quiz is still in draft mode .</p>
          <button className='w-72 py-3 bg-indigo-600 text-white rounded-xl font-bold ' onClick={() => navigate('/')}>Back to Home</button>
        </div>
      </div>
    );
  }
  return (
    <div className="bg-gray-50 flex flex-col">
     <div className="max-w-4xl mx-auto flex items-center gap-4">
      <button 
        className="flex  w-24 items-center justify-center hover:text-blue-600 text-gray-600 bg-gray-200 font-medium " 
        onClick={() => navigate('/')}
      >
        <span className="text-blue-700 font-bold ">←</span> 
        Back
      </button>
      <h2 className="text-xl font-bold text-gray-900 truncate">
        {quiz?.title}
      </h2>
      </div>
      <div>
        {quiz?.blocks?.map(block=>renderBlock(block))}
      </div>
    </div>
  )
}

export default QuizRender
