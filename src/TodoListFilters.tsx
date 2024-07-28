import React from 'react';
import { useRecoilState } from 'recoil';
import { todoListFilterState } from './atoms';

function TodoListFilters() {
  const [filter, setFilter] = useRecoilState(todoListFilterState);
  const updateFilter = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const {
      currentTarget: { value },
    } = event;
    setFilter(value);
  };
  return (
    <>
      Filter:
      <select value={filter} onChange={updateFilter}>
        <option value="Show All">All</option>
        <option value="Show Completed">Completed</option>
        <option value="Show Uncompleted">Uncompleted</option>
      </select>
    </>
  );
}

export default TodoListFilters;
