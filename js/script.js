'use strict';

class ToDoList {
    #selector = null;
    #form = null;
    #containerSelector = null;
    #container = null;
    #currentId = 0;

    init(selector, container) {
        if (typeof selector === "string" || selector.trim() !== '') this.#selector = selector;
        if (typeof container === 'string' || container.trim() !== '') this.#containerSelector = container;
        this.#getForm();
        this.#getHTMLElement();
        this.#removeItem()
    }

    #getForm() {
        const formElement = document.querySelector(this.#selector);
        this.#form = formElement;
        formElement.addEventListener('submit', event => {
            event.preventDefault();
            event.stopPropagation();
            const data = {};
            formElement
                .querySelectorAll('input, textarea')
                .forEach((item) => {
                    data[item.name] = item.value;
                })
            data.id = this.#currentId += 1
            const savedData = this.#saveData(data);
            this.#renderItem(savedData);
        })
    }

    #getHTMLElement() {
        this.#container = document.querySelector(this.#containerSelector);
        const data = localStorage.getItem(this.#selector)
        if (data && JSON.parse(data).length) {
            this.#currentId = JSON.parse(data)[JSON.parse(data).length - 1].id
        }
        document.addEventListener('DOMContentLoaded', event => {
            event.preventDefault();
            event.stopPropagation();
            const toDo = JSON.parse(localStorage.getItem(this.#selector));
            if (!toDo) return 'localStorage is empty';
            toDo.map(todoItem => {
                this.#renderItem(todoItem);
            })
        })
    }

    #saveData(data) {
        let dataFromStore = localStorage.getItem(this.#selector);
        if (!dataFromStore) {
            const array = [];
            array.push(data);
            localStorage.setItem(this.#selector, JSON.stringify(array));
        }
        if (dataFromStore) {
            dataFromStore = JSON.parse(dataFromStore);
            dataFromStore.push(data);
            localStorage.setItem(this.#selector, JSON.stringify(dataFromStore));
        }

        return data;
    }

    #renderItem(data) {
        const title = data.title;
        const description = data.description;

        const wrapper = document.createElement('div');
        wrapper.classList.add('col-4');
        wrapper.dataset.id = data.id
        wrapper.innerHTML = `<div class="taskWrapper">
                            <div class="taskHeading">${title}</div>
                            <div class="taskDescription">${description}</div>
                         </div>`;
        this.#container.appendChild(wrapper);
    }

    #removeItem() {
        this.#container.addEventListener('click', e => {
            e.stopPropagation();
            const currentItem = e.target.closest('[data-id]');
            const currentItemId = Number(currentItem.getAttribute('data-id'));
            const filteredData = JSON.parse(localStorage.getItem(this.#selector))
                .filter(item => item.id !== currentItemId)
            localStorage.setItem(this.#selector, JSON.stringify(filteredData));
            currentItem.remove()
        })
    }

}

const example = new ToDoList();
example.init('#todoForm', '#todoItems');


