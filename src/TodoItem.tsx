import React from 'react';
import { useRecoilState } from 'recoil';
import { todoListState } from './atoms';
import { TodoProps } from './atoms';

interface TodoItemProps {
  item: TodoProps;
}

function TodoItem({ item }: TodoItemProps) {
  const { id, text, isComplete } = item;
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

  return (
    <div>
      <input type="text" value={item.text} onChange={editItemText} />
      {/* {<input type="checkbox" value={} onChange={} />
    <button onClick={}>X</button>} */}
    </div>
  );
}

function replaceItemAtIndex(
  arr: TodoProps[],
  index: number,
  newValue: TodoProps,
) {
  return [...arr.slice(0, index), newValue, ...arr.slice(index + 1)];
}

export default TodoItem;
