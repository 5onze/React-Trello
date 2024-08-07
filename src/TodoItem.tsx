import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import styled from 'styled-components';

const Card = styled.div`
  border-radius: 5px;
  margin-bottom: 5px;
  padding: 10px 10px;
  background-color: lightyellow;
`;

interface TodoItemProps {
  item: string;
  index: number;
}

function TodoItem({ item, index }: TodoItemProps) {
  console.log(item);
  return (
    <Draggable key={item} draggableId={item} index={index}>
      {(provided) => (
        <Card
          ref={provided.innerRef}
          {...provided.dragHandleProps}
          {...provided.draggableProps}
        >
          {item}
        </Card>
      )}
    </Draggable>
  );
}

export default React.memo(TodoItem);
