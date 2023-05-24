'use strict';

let habits = [];
const HABBIT_KEY = 'HABBIT_KEY';

const page = {
  menu: document.querySelector('.menu__list'),
  header: {
    main: document.querySelector('.header'),
    title: document.querySelector('.header__title'),
    progress: {
      percentText: document.querySelector('.progress__percent'),
      bar: document.querySelector('.progress__bar'),
    }
  },
  content: {
    main: document.querySelector('.main'),
    habitWrapper: document.querySelector('.habit__wrapper'),
  },
};

const loadData = () => {
  const habitString = localStorage.getItem(HABBIT_KEY);
  const habitArray = JSON.parse(habitString);

  if (Array.isArray(habitArray)) {
    habits = habitArray;
  }
};

const saveData = () => localStorage.setItem(HABBIT_KEY, JSON.stringify(habits));

const renderMenu = (activeHabit) => {
  for (const habit of habits) {
    const existed = document.querySelector(`[data-habit-id="${habit.id}"]`);

    if (!existed) {
      // create
      const element = document.createElement('button');
      element.classList.add('btn');

      if (activeHabit.id === habit.id) {
        element.classList.add('btn_active');
      }

      element.dataset.habitId = habit.id;
      element.innerHTML = `<img src="./images/${habit.icon}.svg" alt="${habit.name}">`;
      page.menu.append(element);

      continue;
    }

    if (activeHabit.id === habit.id) {
      existed.classList.add('btn_active');
    } else {
      existed.classList.remove('btn_active');
    }
  }
};

const renderHead = (activeHabit) => {
  const progress = activeHabit.days.length / activeHabit.target > 1
    ? 1
    : activeHabit.days.length / activeHabit.target;

  const progressInPercent =
    Math.round(progress * 100);

  page.header.title.textContent = activeHabit.name;
  page.header.progress.percentText.textContent = `${progressInPercent}%`;
  page.header.progress.bar.value = progressInPercent;
};

const renderContent = (activeHabit) => {
  page.content.habitWrapper.innerHTML = '';

  activeHabit.days.forEach((day, idx) => {
    const element = document.createElement('div');
    element.classList.add('habit');
    element.innerHTML = `<div class="habit__day">День ${idx + 1}</div>
    <div class="habit__comment">${day.comment}</div>
    <button class="delete"><img src="./images/delete.svg" alt="Удалить день ${idx + 1}"></button>`;

    page.content.habitWrapper.append(element);
  });

  const commentForm = `<div class="habit">
  <div class="habit__day">День ${activeHabit.days.length + 1}</div>
    <form class="habit__comment" action="#!">
      <input class="input__comment" type="text" placeholder="Комментарий...">
    </form>
  <button class="btn__submit" type="submit">Готово</button>
  </div>`;

  page.content.habitWrapper.insertAdjacentHTML('beforeend', commentForm);
};

const rerender = (activeHabitId) => {
  const activeHabit = habits
    .find(habit => +habit.id === +activeHabitId);

  if (!activeHabit) {
    return;
  }

  renderMenu(activeHabit);
  renderHead(activeHabit);
  renderContent(activeHabit);
};

(() => {
  loadData();
  rerender(habits[0].id);
})();

page.menu.addEventListener('click', (e) => {
  const menuItem = e.target.closest('.btn');

  if (!menuItem) {
    return;
  }

  rerender(menuItem.dataset.habitId);
});
