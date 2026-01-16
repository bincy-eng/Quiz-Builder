import React from 'react';
import { useDrop } from 'react-dnd';
import QuizBlock from './QuizBlock';

function Canvas({blocks,selectedBlockId,onAddBlock , onSelectBlock, onReoderBlocks, onDeleteBlock}) {
  const [{isOver}, drop] = useDrop (() =>({
    accept : 'BLOCK',
    drop : (item,monitor) =>{
      const didDrop = monitor.didDrop();
      if(!didDrop && item.isNew){
        onAddBlock(item.blockType);
      }
    },
     collect: (monitor) => ({
      isOver: monitor.isOver({ shallow: true })
    })
  }))
  return (
    <div ref={drop} className={`        
        ${isOver 
          ? "border-dashed border-blue-400 bg-blue-50" 
          : "bg-white border-gray-200"}
      `}>
        {blocks.length === 0 ? 
        (<div>
          <p>Drag blocks from the left panel to start building your quiz</p>
          <p className="canvas-hint">or click on a block to add it here</p>
        </div>):(
          blocks.map((block , index)=>
            (<QuizBlock
            key={block.id}
            block={block}
            index= {index}
            isSelected={block.id === selectedBlockId}
            onAddBlock={onAddBlock}
            onSelectBlock ={onSelectBlock}
            onReoderBlocks = {onReoderBlocks}
            onDeleteBlock ={onDeleteBlock}
            />)
          )
        ) }
      
    </div>
  )
}

export default Canvas
