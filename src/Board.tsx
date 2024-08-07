import React from 'react';
import TodoItem from './TodoItem';
import { Droppable } from 'react-beautiful-dnd';
import styled from 'styled-components';

const Wrapper = styled.div`
  width: 300px;
  padding: 20px 10px;
  padding-top: 10px;
  background-color: lightblue;
  border-radius: 5px;
  min-height: 300px;
`;

const Title = styled.h2`
  text-align: center;
  font-weight: 600;
  margin-bottom: 10px;
  font-size: 18px;
`;

interface BoardProps {
  boardId: string;
  boardList: string[];
}

function Board({ boardId, boardList }: BoardProps) {
  return (
    <div>
      <Title>{boardId}</Title>
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
