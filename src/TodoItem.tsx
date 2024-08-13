import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import styled from 'styled-components';

const Card = styled.div<{ isDragging: boolean }>`
  border-radius: 5px;
  margin-bottom: 5px;
  padding: 10px;
  background-color: ${(props) => (props.isDragging ? '#fbfd90' : '#ffffff')};
  box-shadow: ${(props) =>
    props.isDragging ? '0px 2px 5px rgba(0, 0, 0, 0.05)' : 'none'};
`;

interface TodoItemProps {
  todoText: string;
  todoId: number;
  index: number;
}

function TodoItem({ todoText, todoId, index }: TodoItemProps) {
  return (
    <Draggable key={todoId} draggableId={todoId + ''} index={index}>
      {(provided, snapshot) => (
        <Card
          ref={provided.innerRef}
          isDragging={snapshot.isDragging}
          {...provided.dragHandleProps}
          {...provided.draggableProps}
        >
          {todoText}
        </Card>
      )}
    </Draggable>
  );
}

export default React.memo(TodoItem);
