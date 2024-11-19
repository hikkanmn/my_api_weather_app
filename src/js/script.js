const addCityBtn = document.getElementById('addCityBtn'); // кнопка для добавления города
const cityInput = document.getElementById('cityInput'); // поле ввода названия города
const weatherCardsContainer = document.getElementById('weatherCardsContainer'); // контейнер для карточек погоды

// добавляем обработчик события для клика по кнопке
addCityBtn.addEventListener('click', addCityWeather);
// добавляем обработчик события для ввода текста, чтобы добавить город при нажатии клавиши Enter
cityInput.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        addCityWeather();
    }
});

// функция для получения и добавления информации о погоде для указанного города
function addCityWeather() {
    const city = cityInput.value; // получаем введенное название города
    if (!city) return; // проверяем, что поле не пустое
    const token = '72c4b810b7d4ebbdd378a4a6cfa0668b'; // токен для API openweathermap
    const api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${token}&lang=ru&units=metric`; // URL для запроса данных

    // запрашиваем данные с помощью fetch
    fetch(api)
        .then(response => response.json()) //преобразуем ответ в JSON
        .then(data => {
            const weatherCard = createWeatherCard(data); // создаем карточку с данными о погоде
            weatherCardsContainer.appendChild(weatherCard); // добавляем карточку в контейнер
            cityInput.value = ''; // очищаем поле ввода
        })
        .catch(() => {
            // алерт раздражает, потому временно скрыла его, сообщение об ошибке выводится в консоль
            // alert('Не удалось получить данные о погоде.'); // показываем сообщение об ошибке при неудачном запросе
            console.log('Не удалось получить данные о погоде.')
        });
}

// функция для создания карточки с информацией о погоде
function createWeatherCard(data) {
    const card = document.createElement('div'); // создаем новый элемент (div) под карточку
    card.className = 'weather-card'; // добавляем класс для стилизации
    card.draggable = true; // делаем карточку перетаскиваемой

    // внутреннее содержимое карточки на HTML
    card.innerHTML = `
        <button class="delete-btn">Удалить</button> <!-- Кнопка удаления -->
        <h3>${data.name}</h3>
        <p>Погода: ${data.weather[0].description}</p>
        <p>Температура: ${data.main.temp}°C</p>
        <p>Ощущается как: ${data.main.feels_like}°C</p>
        <p>Ветер: ${data.wind.speed} м/с</p>
        <img src="http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="weather icon"> <!-- Иконка погоды с сайта -->
    `;

    // обработчик начала перетаскивания
    card.addEventListener('dragstart', () => {
        card.classList.add('dragging');
    });

    // обработчик окончания перетаскивания
    card.addEventListener('dragend', () => {
        card.classList.remove('dragging');
    });

    // обработчик для кнопки удаления
    card.querySelector('.delete-btn').addEventListener('click', () => {
        card.remove(); // Удаляем карточку
    });

    return card; // возвращаем созданную карточку
}

// обработчик для перетаскивания карточек в контейнере
weatherCardsContainer.addEventListener('dragover', (e) => {
    e.preventDefault(); // предотвращаем стандартное поведение браузера
    const afterElement = getDragAfterElement(weatherCardsContainer, e.clientY); // находим ближайший элемент после текущего
    const draggingCard = document.querySelector('.dragging'); // текущая перетаскиваемая карточка
    if (afterElement == null) {
        weatherCardsContainer.appendChild(draggingCard); // добавляем карточку в конец, если нет ближайшего элемента
    } else {
        weatherCardsContainer.insertBefore(draggingCard, afterElement); // вставляем карточку перед ближайшим элементом
    }
});

// функция для определения ближайшего элемента при перетаскивании
function getDragAfterElement(container, y) {
    // список всех элементов, кроме текущего перетаскиваемого
    const draggableElements = [...container.querySelectorAll('.weather-card:not(.dragging)')];
    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect(); // получаем размеры элемента
        const offset = y - box.top - box.height / 2; // определяем расстояние от центра элемента
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child }; // сохраняем ближайший элемент
        } else {
            return closest; // возвращаем текущий ближайший
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element; // начальное значение для поиска ближайшего
}
