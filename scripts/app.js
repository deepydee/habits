'use strict';

let habbits = [];
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
};

const loadData = () => {
  const habbitString = localStorage.getItem(HABBIT_KEY);
  const habbitArray = JSON.parse(habbitString);

  if (Array.isArray(habbitArray)) {
    habbits = habbitArray;
  }
};

const saveData = () => localStorage.setItem(HABBIT_KEY, JSON.stringify(habbits));

const renderMenu = (activeHabit) => {
  if (!activeHabit) {
    return;
  }

  for (const habit of habbits) {
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
  if (!activeHabit) {
    return;
  }

  const progress = activeHabit.days.length / activeHabit.target > 1
    ? 1
    : activeHabit.days.length / activeHabit.target;

  const progressInPercent =
    Math.round(progress * 100);

  page.header.title.textContent = activeHabit.name;
  page.header.progress.percentText.textContent = `${progressInPercent}%`;
  page.header.progress.bar.value = progressInPercent;
};

const rerender = (activeHabitId) => {
  const activeHabit = habbits
    .find(habit => +habit.id === +activeHabitId);

  renderMenu(activeHabit);
  renderHead(activeHabit);
};




(() => {
  loadData();
  rerender(habbits[0].id);
})();

page.menu.addEventListener('click', (e) => {
  const menuItem = e.target.closest('.btn');

  if (!menuItem) {
    return;
  }

  rerender(menuItem.dataset.habitId);
});
