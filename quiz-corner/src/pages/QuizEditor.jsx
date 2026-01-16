import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import BuildingBlock from '../components/BuildingBlock';
import PropertiesPanel from '../components/PropertiesPanel';
import Canvas from '../components/Canvas';
import { getQuizById, saveQuiz, publishQuiz } from '../data/localstorage'

const BLOCK_TYPES = [
    { type: 'heading', label: 'Heading' },
    { type: 'question', label: 'Question' },
    { type: 'button', label: 'Button' },
    { type: 'footer', label: 'footer' }
]


function QuizEditor() {
    const { id } = useParams();
    const [quiz, setQuiz] = useState({ title: 'Untitled Quiz', blocks: [], published:false });
    const [selectedBlockId, setSelectedBlockId] = useState(null);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        if (id) {
            const loadQuiz = getQuizById(id)
           // console.log("Quiz Loaded:", loadQuiz);
            if (loadQuiz) {
                setQuiz(loadQuiz);
            }
            else {
                setError('Quiz not found');
            }
        }

    }, [id])

    const handleTitleChange = (e) => {
        setQuiz({ ...quiz, title: e.target.value })
    }

    const createNewBlock = (type) => {
        const defaultData = {
            heading: 'New Heading',
            question: 'Your question here?',
            button: 'Click Me',
            footer: 'Footer text'
        }
        return {
            id: `block_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            type,
            content: defaultData[type],
            ...(type === 'question' && {
                questionType: 'single',
                options: ['Option 1', 'Option 2']
            })
        }
    }
    const handleAddBlock = (blockType, insertBeforeIndex = null) => {
        const newBlock = createNewBlock(blockType);
        const newBlocks = [...quiz.blocks]
        if (insertBeforeIndex != null) {
            newBlocks.splice(insertBeforeIndex, 0, newBlock)
        } else {
            newBlocks.push(newBlock);
        }
        setQuiz({ ...quiz, blocks: newBlocks });
        setSelectedBlockId(newBlock.id);

    }
    const handleSelectBlock = (blockId) => {
        setSelectedBlockId(blockId)
    }
    const handleReOrderBlock = (dragIndex, hoverIndex) => {
        const newBlocks = [...quiz.blocks];
        const [removedBlock] = newBlocks.splice(dragIndex, 1);
        newBlocks.splice(hoverIndex, 0, removedBlock);
        setQuiz({ ...quiz, blocks: newBlocks })
    }
    const handleUpdateBlock = (blockId, updates) => {
        const newBlocks = quiz.blocks.map(block =>
            block.id === blockId ? { ...block, ...updates } : block
        );
        setQuiz({ ...quiz, blocks: newBlocks });
    }

    const selectedBlock = quiz.blocks.find(b => b.id === selectedBlockId);

    const handleDeleteBlock = (blockId) => {
        const blockSelected = quiz.blocks.filter(b => b.id != blockId);
        setQuiz({ ...quiz, blocks: blockSelected });
        if (blockSelected == blockId) {
            setSelectedBlockId(null);
        }
    }
    const handleSaveData = () => {
        try {
            const savedId = saveQuiz(quiz);
            setSuccessMessage("Saved successfully");
            setError('');
            setTimeout(() => setSuccessMessage(''), 3000);
            if (!id && savedId) {
                navigate(`/quiz/edit/${savedId}`, { replace: true })
            }

        } catch (err) {
            setError(err.message || 'Failed to save quiz');
            setSuccessMessage('');
        }

    }
    const handlePublishData = () => {
        try {
            if (!quiz.id) {
                const savedId = saveQuiz(quiz);
                quiz.id = savedId;
            }
            publishQuiz(quiz.id);
            setQuiz({ ...quiz, published: true });
            setSuccessMessage('Published successfully!');
            setError('');
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (err) {
            setError(err.message || 'Failed to publish quiz');
            setSuccessMessage('');
        }
    }

    return (
        <DndProvider backend={HTML5Backend}>
            <div className='h-screen flex flex-col'>
                <header className=' px-6 py-4 flex justify-between items-center border-b border-gray-800 '>
                    <button className='bg-gray-100 px-3 py-2 hover:text-blue-600' onClick={() => navigate('/')}>Go Back</button>
                    <input type='text' placeholder='Title of the Quiz' value={quiz.title} onChange={handleTitleChange} className='w-100 px-5 py-3 border border-b-gray-500' />
                    <div className='flex gap-3 float-right'>
                        <button className='px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500'
                            onClick={handleSaveData}>Save for draft</button>
                        <button className='px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500'
                            onClick={handlePublishData}>Publish</button>
                    </div>
                    {(successMessage || error) && (
                        <div className="absolute top-20 left-1/2 transform -translate-x-1/2 z-50">
                            {successMessage && (
                                <div className="bg-green-100 border border-green-400 text-green-700 px-6 py-2 ">
                                    {successMessage}
                                </div>
                            )}
                            {error && (
                                <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-2 ">
                                    {error}
                                </div>
                            )}
                        </div>
                    )}


                </header>
                {/* Editor Body */}
                <div className='flex flex-1 overflow-hidden'>
                    {/* left side  */}
                    <aside className='w-64 bg-gray-50 border-r border-gray-200 p-4 overflow-y-auto'>
                        <h3>Building Blocks</h3>
                        <div>{BLOCK_TYPES.map((blockType) => (
                            <BuildingBlock key={blockType.type} blockType={blockType} onAddBlock={handleAddBlock} />
                        ))}</div>
                    </aside>
                    {/* center canvas */}
                    <main className='flex-1 bg-white p-10 overflow-y-auto'>
                        <div className='max-w-4xl mx-auto min-h-150 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-6'>
                            <Canvas blocks={quiz.blocks}
                                selectedBlockId={selectedBlockId}
                                onAddBlock={handleAddBlock}
                                onSelectBlock={handleSelectBlock}
                                onReoderBlocks={handleReOrderBlock}
                                onDeleteBlock={handleDeleteBlock}
                            />
                        </div>
                    </main>
                    {/* right side */}
                    <aside className='w-80 bg-gray-50 border-l border-gray-200 p-4 overflow-y-auto'>
                        <PropertiesPanel
                            block={selectedBlock}
                            onUpdateBlock={handleUpdateBlock}
                        />
                    </aside>
                </div>

            </div >
        </DndProvider >
    );
}

export default QuizEditor;
