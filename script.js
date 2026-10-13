'use strict';

const students = [];
let pickedIndex = null;

const nameInput = document.getElementById('student-name');
const addForm = document.getElementById('add-form');
const rosterList = document.getElementById('roster-list');
const countEl = document.getElementById('count');
const emptyEl = document.getElementById('empty');
const presenterEl = document.getElementById('presenter');
const pickBtn = document.getElementById('pick-btn');
const resetBtn = document.getElementById('reset-btn');

const EMPTY_TEXT = '차례가 정해지면 이곳에 이름이 나타나요';

function render() {
  rosterList.innerHTML = '';

  students.forEach((name, index) => {
    const li = document.createElement('li');
    li.className = 'roster-item';
    if (index === pickedIndex) {
      li.classList.add('is-picked');
    }

    const nameSpan = document.createElement('span');
    nameSpan.className = 'roster-item__name';
    nameSpan.textContent = name;
    li.appendChild(nameSpan);

    const delBtn = document.createElement('button');
    delBtn.type = 'button';
    delBtn.className = 'roster-item__delete';
    delBtn.textContent = '×';
    delBtn.setAttribute('aria-label', name + ' 삭제');
    delBtn.addEventListener('click', () => removeStudent(index));
    li.appendChild(delBtn);

    rosterList.appendChild(li);
  });

  countEl.textContent = students.length + '명';
  emptyEl.classList.toggle('is-hidden', students.length > 0);
}

function addStudent(name) {
  const trimmed = name.trim();
  if (!trimmed) {
    return false;
  }
  students.push(trimmed);
  render();
  return true;
}

function removeStudent(index) {
  // 지운 학생이 현재 발표자면 발표자 표시도 비움
  if (index === pickedIndex) {
    pickedIndex = null;
    clearPresenter();
  } else if (pickedIndex !== null && index < pickedIndex) {
    // 앞쪽 학생을 지우면 발표자 위치가 한 칸 앞으로 당겨짐
    pickedIndex -= 1;
  }
  students.splice(index, 1);
  render();
}

function pickPresenter() {
  // 학생이 없으면 안내만 보여줌 (오류 아님)
  if (students.length === 0) {
    showEmptyMessage('먼저 학생을 추가해 주세요.');
    return;
  }

  // 0부터 학생 수 사이의 무작위 위치를 뽑아 발표자로 정함
  const index = Math.floor(Math.random() * students.length);
  pickedIndex = index;

  presenterEl.textContent = students[index];
  presenterEl.classList.remove('is-empty');

  render();
}

function clearPresenter() {
  presenterEl.textContent = EMPTY_TEXT;
  presenterEl.classList.add('is-empty');
}

function showEmptyMessage(message) {
  presenterEl.textContent = message;
  presenterEl.classList.add('is-empty');
}

function resetAll() {
  const confirmed = window.confirm('학생 목록과 발표자를 모두 지울까요?');
  if (!confirmed) {
    return;
  }
  students.length = 0;
  pickedIndex = null;
  clearPresenter();
  render();
}

addForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const added = addStudent(nameInput.value);
  if (added) {
    nameInput.value = '';
  }
  nameInput.focus();
});

pickBtn.addEventListener('click', pickPresenter);
resetBtn.addEventListener('click', resetAll);

render();
