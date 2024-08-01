import React, { useState } from 'react';
import { useSetRecoilState } from 'recoil';
import { todoListState } from './atoms';

function TodoItemCreator() {
  const [inputValue, setInputValue] = useState('');
  const setTodoList = useSetRecoilState(todoListState);

  const addItem = () => {
    if (inputValue.length === 0) {
      alert(`내용을 작성하세요`);
    } else {
      setTodoList((oldTodoList) => [
        ...oldTodoList,
        {
          id: Date.now(),
          text: inputValue,
          isComplete: false,
        },
      ]);
    }
    setInputValue('');
  };

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {
      currentTarget: { value },
    } = event;
    setInputValue(value);
  };

  const AddKey = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      addItem();
    }
  };

  return (
    <div>
      <input
        type="text"
        value={inputValue}
        onChange={onChange}
        placeholder="Write a to do"
        onKeyDown={AddKey}
      />
      <button onClick={addItem}>Add</button>
    </div>
  );
}

export default TodoItemCreator;
