import React from 'react';
import { useDrag } from 'react-dnd'

function BuildingBlock({ blockType, onAddBlock }) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'BLOCK',
    item: { blockType: blockType.type, isNew: true },
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })

  }));

  return (
    <div ref={drag} className={`
        flex items-center gap-3 p-3 mb-2 rounded-lg border-2 transition-all cursor-grab
        ${isDragging
        ? "opacity-40 border-dashed border-blue-400 bg-blue-50"
        : "bg-white border-gray-200 hover:border-blue-500 hover:shadow-md active:cursor-grabbing"}
      `} onClick={() => onAddBlock(blockType.type)}>
      <span className='text-sm font-medium'>{blockType.label}</span>
    </div>
  )
}

export default BuildingBlock
