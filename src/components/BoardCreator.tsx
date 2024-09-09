import React, { useEffect, useRef, useState } from 'react';
import { FieldErrors, useForm } from 'react-hook-form';
import { useRecoilState, useSetRecoilState } from 'recoil';
import styled from 'styled-components';
import { boardState } from '../atoms';

const Wrapper = styled.div<{ isCreatingMod: boolean }>`
  margin-left: 10px;
`;

const Form = styled.form`
  font-size: 14px;
  line-height: 30px;
  input {
    border-radius: 4px;
    padding: 6px 12px;
    color: #b6c2cf;
  }
  span {
    padding: 4px;
    color: #fff;
  }
`;

const AddBtn = styled.button`
  background-color: #579dff;
  border-radius: 3px;
  cursor: pointer;
  padding: 6px 12px;
  font-weight: 500;
  color: #000;
`;

const CancelBtn = styled.button`
  padding: 6px;
`;

const ViewBtn = styled.button`
  display: flex;
  justify-content: flex-start;
  width: 272px;
  padding: 12px;
  border-radius: 12px;
  background-color: #ffffff3d;
  color: #ffffff;
  font-size: 14px;
  line-height: 20px;
`;

interface propsType {
  AddBoard: string;
  test: string;
}

/** NOTE useForm 과 input ref (포커스)를 함께 쓸때 onSubmit 안되는 문제 해결방법
 * 방법 : useRef 를 useform의 register와 연결한다
 * useform 공식사이트 https://react-hook-form.com/faqs#Howtosharerefusage useform과 ref 함께 사용하는 방법
 * useRef 연결하여 사용하기 https://velog.io/@rkd028/React-Hook-Form-useRef-%EC%97%B0%EA%B2%B0%ED%95%98%EC%97%AC-%EC%82%AC%EC%9A%A9%ED%95%98%EA%B8%B0
 */

function BoardCreator() {
  const [boards, setBoards] = useRecoilState(boardState);

  // form
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<propsType>();

  const formrRef = useRef<HTMLFormElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  // 보드 생성
  const onValid = ({ AddBoard }: propsType) => {
    setBoards((allboards) => {
      const newBoard = {
        id: Date.now(),
        boardName: AddBoard,
        items: [],
      };

      return [...allboards, newBoard];
    });
    setValue('AddBoard', '');
    setIsCreating(false);
  };

  // 에러 찾기
  const onInValid = (errors: FieldErrors) => {
    console.log('errors', errors);
  };

  // ref
  const { ref, ...rest } = register('AddBoard', {
    required: true,
  });

  useEffect(() => {
    // Add board input focus
    if (isCreating) inputRef.current?.focus();

    // mousedown event
    const clickOutside = (e: Event) => {
      const target = e.target as HTMLFormElement;
      if (isCreating && !formrRef.current?.contains(target)) {
        setIsCreating(false);
      }
    };

    document.addEventListener('mousedown', clickOutside);

    return () => {
      document.removeEventListener('mousedown', clickOutside);
    };
  }, [isCreating, inputRef]);

  // 템플릿
  const creatingTemplate = (
    <Form onSubmit={handleSubmit(onValid)} ref={formrRef}>
      <input
        type="text"
        {...rest}
        ref={(e) => {
          ref(e);
          inputRef.current = e;
        }}
        placeholder="Enter card name..."
      />
      <AddBtn type="submit">Add</AddBtn>
      <CancelBtn type="button" onClick={() => setIsCreating((prev) => !prev)}>
        <span>X</span>
      </CancelBtn>
    </Form>
  );

  const viewTemplate = (
    <div onClick={() => setIsCreating((prev) => !prev)}>
      <ViewBtn type="button">+ Add another board</ViewBtn>
    </div>
  );

  return (
    <Wrapper isCreatingMod={isCreating}>
      <div>{isCreating ? creatingTemplate : viewTemplate}</div>
    </Wrapper>
  );
}

export default BoardCreator;
