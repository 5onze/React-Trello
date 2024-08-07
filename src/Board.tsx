import React from 'react';
import TodoItem from './TodoItem';
import { Droppable } from 'react-beautiful-dnd';
import styled from 'styled-components';

const Wrapper = styled.div`
  padding: 20px 10px;
  padding-top: 30px;
  background-color: lightgreen;
  border-radius: 5px;
  min-height: 200px;
`;

interface BoardProps {
  boardId: string;
  boardList: string[];
}

function Board({ boardId, boardList }: BoardProps) {
  return (
    <div>
      <title>{boardId}</title>
      <Droppable droppableId={boardId}>
        {(provided) => (
          <Wrapper ref={provided.innerRef} {...provided.droppableProps}>
            {boardList.map((todoItem, index) => (
              <TodoItem key={todoItem} index={index} item={todoItem} />
            ))}
            {provided.placeholder}
          </Wrapper>
        )}
      </Droppable>
    </div>
  );
}

export default Board;
