import React from 'react'

function PropertiesPanel({ block, onUpdateBlock }) {
  if (!block) {
    return (
      <div className="properties-panel">
        <h3>Properties</h3>
        <p className="no-selection">Select a block to edit its properties</p>
      </div>
    );
  }
  const update = (changes) => onUpdateBlock(block.id, changes);
  const handleContentChange = (e) => update({ content: e.target.value });
  const handleQuestionChange = (e) => update({ questionType: e.target.value });

  const handleAddOption = () => {
    const newOptions = [...(block.options || []), `Option ${(block.options?.length || 0) + 1}`];
    onUpdateBlock(block.id, { options: newOptions });
  };
  const handleOptionChange = (index, value) => {
    const newOptions = [...block.options];
    newOptions[index] = value;
    onUpdateBlock(block.id, { options: newOptions });
  };
  const handleRemoveOption = (index) => {
    const newOptions = block.options.filter((_, i) => i !== index);
    onUpdateBlock(block.id, { options: newOptions });
  };


  return (
    <div className='p-6 flex flex-col'>
      <h3 className='text-lg font-bold text-gray-900 border-b pb-2'>Properties</h3>
      <div className='p-6 border-b border-gray-100 bg-gray-50/50'>
        <label className='text-xl font-black text-gray-800'>Block Type</label>
        <div className='text-gray-800 font-semibold uppercase'> {block.type}</div>
      </div>

      <div className="block text-xs font-bold uppercase text-gray-400 mb-1">
        <label className="px-3 py-1 mb-1 bg-blue-50 text-gray-600 rounded-md text-sm inline-block capitalize">Content</label>
        {block.type === 'heading' ? (
          <input
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
            type="text"
            value={block.content}
            onChange={handleContentChange}
            placeholder="Heading text"

          />
        ) : block.type === 'footer' ? (
          <textarea
            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm outline-none transition-all resize-none'
            value={block.content}
            onChange={handleContentChange}
            placeholder="Footer text"
            rows={3}
          />
        ) : block.type === 'button' ? (
          <input
            type="text"
            className='"w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm outline-none transition-all'
            value={block.content}
            onChange={handleContentChange}
            placeholder="Button text"
          />
        ) : (
          <textarea
            value={block.content}
            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm outline-none transition-all resize-none'
            onChange={handleContentChange}
            placeholder="Question text"
            rows={3}
          />
        )}
      </div>
      {block.type === 'question' && (
        <div className="space-y-6 pt-4 border-t border-gray-100">
          <div className=''>
            <label className='text-xs font-black uppercase text-black'>Question Type</label>
            <select value={block.questionType} onChange={handleQuestionChange} className='w-full px-4 py-3 bg-white border-2 border-gray-100 rounded-xl focus:border-indigo-500'>
              <option value="single">Single Value (Radio button)</option>
              <option value="multi">Multiple choice (Check box)</option>
              <option value="text">Text Input</option>
            </select>
          </div>
          {(block.questionType === 'single' || block.questionType === 'multi') &&
            <div>
              <label>Options</label>
              {block.options?.map((option, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    className='flex-1 mb-1 px-3 py-1.5 text-sm border border-gray-200 rounded-md focus:border-indigo-100 outline-none'
                  />

                  {block.options.length > 1 && (
                    <button
                      className=" text-gray-400 hover:text-red-500 transition-colors p-1"
                      onClick={() => handleRemoveOption(index)}
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}

              <button className="mt-2 w-full py-2 border-2 border-dashed border-gray-200 uppercase" onClick={handleAddOption}>
                + Add Option
              </button>
            </div>}

        </div>
      )}

    </div>
  )
}

export default PropertiesPanel
