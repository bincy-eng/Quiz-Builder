import React, { useRef } from 'react'
import { useDrop, useDrag } from 'react-dnd';

function QuizBlock({ block, index, isSelected, onAddBlock, onSelectBlock, onReoderBlocks, onDeleteBlock }) {
    const ref = useRef(null);
    const [{ isDragging }, drag] = useDrag({
        type: 'CANVAS_BLOCK',
        item: { index, blockId: block.id, isNew: false },
        collect: (monitor) => ({
            isDragging: monitor.isDragging()
        })
    });

    const [{ isOver, canDrop }, drop] = useDrop({
        accept: ['CANVAS_BLOCK', 'BLOCK'],
        hover: (item, monitor) => {
            if (monitor.getItemType() === 'CANVAS_BLOCK' && !item.isNew) {
                if (!ref.current) return;
                const dragIndex = item.index;
                const hoverIndex = index;
                if (dragIndex === hoverIndex) return;

                const hoverBoundingRect = ref.current?.getBoundingClientRect();
                const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
                const clientOffset = monitor.getClientOffset();
                const hoverClientY = clientOffset.y - hoverBoundingRect.top;

                if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return;
                if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return;

                onReoderBlocks(dragIndex, hoverIndex);
                item.index = hoverIndex;
            }
        },
        drop: (item) => {
            if (item.isNew) {
                onAddBlock(item.blockType, index);
            }
        },
        collect: (monitor) => ({
            isOver: monitor.isOver(),
            canDrop: monitor.canDrop()
        })
    });

    const blockPreview= () =>{
        switch (block.type){            
            case 'heading': return <h3>{block.content}</h3>;
            case 'question': return (
          <div>
            <p className="font-semibold">{block.content}</p>
            <p className="bg-blue-100 w-15 text-center">{block.questionType}</p>
          </div>
        );
        case 'button': return <button className="font-semibold">{block.content}</button>;
        case 'footer' : return <p className="font-semibold">{block.content}</p>;
            default:
        return <p>{block.content}</p>;
        }
        
    }

    drag(drop(ref));
    return (
        <div ref={ref}
            onClick={()=> onSelectBlock(block.id)}
            className={`relative group mb-4 p-5 rounded-xl border-2 transition-all duration-200 cursor-default ${isSelected ? 'border-indigo-500 bg-indigo-50/30 ring-2 ring-indigo-200' : 'border-gray-200 bg-white hover:border-gray-300'}
        ${isDragging ? 'opacity-0' : 'opacity-100'}
        ${isOver && canDrop ? 'border-t-4 border-t-indigo-500 pt-8' : ''}`
            }>
            <div className='flex justify-between items-center mb-3'>
                
                <span className="text-xs font-bold uppercase text-blue-400 tracking-widest">{block.type}</span>
                <button onClick={(e) => {
                    e.stopPropagation();
                    onDeleteBlock(block.id);
                }}>Delete</button>

            </div>
            <div>
                {blockPreview()}
            </div>
        </div>
    )
}

export default QuizBlock
