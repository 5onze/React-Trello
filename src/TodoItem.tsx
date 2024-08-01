import React from 'react';
import { useRecoilState } from 'recoil';
import { todoListState } from './atoms';
import { TodoProps } from './atoms';
import { Draggable } from 'react-beautiful-dnd';
import styled from 'styled-components';

const Card = styled.div`
  border-radius: 5px;
  margin-bottom: 5px;
  padding: 10px 10px;
  background-color: lightblue;
`;

interface TodoItemProps {
  item: TodoProps;
  index: number;
}

function TodoItem({ item }: TodoItemProps) {
  const [todoList, setTodoList] = useRecoilState(todoListState);
  const index = todoList.findIndex((listItem) => listItem === item);

  const editItemText = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {
      currentTarget: { value },
    } = event;
    const newList = replaceItemAtIndex(todoList, index, {
      ...item,
      text: value,
    });
    setTodoList(newList);
  };

  const toggleItemCompletion = () => {
    const newList = replaceItemAtIndex(todoList, index, {
      ...item,
      isComplete: !item.isComplete,
    });
    setTodoList(newList);
  };

  const deleteItem = () => {
    const newList = removeItemAtIndex(todoList, index);
    setTodoList(newList);
  };
  return (
    <Draggable
      key={item.id}
      draggableId={JSON.stringify(item.id)}
      index={index}
    >
      {(provided, index) => (
        <Card
          ref={provided.innerRef}
          {...provided.dragHandleProps}
          {...provided.draggableProps}
        >
          <input type="text" value={item.text} onChange={editItemText} />
          <input
            type="checkbox"
            checked={item.isComplete}
            onChange={toggleItemCompletion}
          />
          <button onClick={deleteItem}>X</button> Drag me!
        </Card>
      )}
    </Draggable>
  );
}

function replaceItemAtIndex(
  arr: TodoProps[],
  index: number,
  newValue: TodoProps,
) {
  return [...arr.slice(0, index), newValue, ...arr.slice(index + 1)];
}

function removeItemAtIndex(arr: TodoProps[], index: number) {
  return [...arr.slice(0, index), ...arr.slice(index + 1)];
}

export default TodoItem;
