let currentPage = 1
let currentName = ''
let currentStatus = 'alive'

const searchInput = document.getElementById('searchInput')
const radioButtons = document.querySelectorAll('input[name="status"]')
const prevButton = document.getElementById('prevButton')
const nextButton = document.getElementById('nextButton')

async function fetchCharacters(page, name, status) {
	try {
		const statusMap = { alive: 'Alive', dead: 'Dead', unknown: 'unknown' }
		const lowerCaseStatus = statusMap[status.toLowerCase()]
		const result = await fetch(
			`http://localhost:3000/results?_page=${page}&_limit=5&name_like=${name}&status=${lowerCaseStatus}`,
		)
		const data = await result.json()
		return data
	} catch (error) {
		console.error('Wystąpił błąd podczas pobierania postaci:', error)
	}
}

function createImgCard(character) {
	const card = document.createElement('div')
	card.classList.add('character-card')

	const img = document.createElement('img')
	img.classList.add('character-image')
	img.src = character.image
	img.alt = character.name

	const name = document.createElement('h3')
	name.classList.add('character-name')
	name.textContent = character.name

	const status = document.createElement('p')
	status.classList.add('character-status')
	status.textContent = `Status: ${character.status}`

	const species = document.createElement('p')
	species.classList.add('character-species')
	species.textContent = `Gatunek: ${character.species}`

	const deleteBtn = document.createElement('button')
	deleteBtn.classList.add('delete-btn')
	deleteBtn.textContent = 'Usuń postać'

	card.append(img, name, status, species, deleteBtn)

	deleteBtn.addEventListener('click', () => {
		deleteCard(character.id)
	})
	return card
}

function addPersonForm() {
	const personContainer = document.createElement('div')
	const title = document.createElement('h2')
	const inputName = document.createElement('input')
	const selectStatus = document.createElement('select')
	const inputSpecies = document.createElement('input')
	const createBtn = document.createElement('button')
	const options = ['Alive', 'Dead', 'unknown']
	const optionsName = ['Żywy', 'Martwy', 'Nieznany']

	personContainer.classList.add('person-container')

	title.classList.add('title')
	title.textContent = 'Stwórz postać'

	inputName.placeholder = 'Nazwa postaci'
	inputName.value = ''
	inputName.type = 'text'
	inputName.classList.add('inputs-form')

	options.forEach((el, index) => {
		const option = document.createElement('option')
		option.value = el
		option.textContent = optionsName[index]
		selectStatus.append(option)
	})
	selectStatus.classList.add('inputs-form')

	inputSpecies.classList.add('inputs-form')
	inputSpecies.placeholder = 'Rasa'
	inputSpecies.value = ''
	inputSpecies.type = 'text'

	createBtn.textContent = 'Stwórz'
	createBtn.classList.add('btn-form')

	document.body.append(personContainer)
	personContainer.append(title, inputName, selectStatus, inputSpecies, createBtn)

	createBtn.addEventListener('click', () => {
		addCard(inputName.value, selectStatus.value, inputSpecies.value)
	})
}

addPersonForm()

async function deleteCard(id) {
	try {
		await fetch(`http://localhost:3000/results/${id}`, { method: 'DELETE' })
		loadCharacters()
	} catch (error) {
		console.log('Error', error)
	}
}

async function addCard(name, status, species, img = 'https://rickandmortyapi.com/api/character/avatar/3.jpeg') {
	try {
		const character = { name, status, species, image: img }
		const response = await fetch('http://localhost:3000/results', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(character),
		})
		const newCharacter = await response.json()
		loadCharacters()
	} catch (error) {
		console.log('Error', error)
	}
}

function renderCharacters(data) {
	const charactersContainer = document.querySelector('.container')
	if (data && data.length > 0) {
		charactersContainer.innerHTML = ''
		data.forEach(element => {
			charactersContainer.appendChild(createImgCard(element))
		})
	} else {
		charactersContainer.innerHTML = '<p>Nie znaleziono postaci spełniających kryteria wyszukiwania.</p>'
	}
}

async function loadCharacters() {
	const data = await fetchCharacters(currentPage, currentName, currentStatus)
	renderCharacters(data)
}

loadCharacters()

searchInput.addEventListener('input', event => {
	currentName = event.target.value
	currentPage = 1
	loadCharacters()
})

radioButtons.forEach(radio => {
	radio.addEventListener('change', event => {
		currentStatus = event.target.value
		currentPage = 1
		loadCharacters()
	})
})

prevButton.addEventListener('click', () => {
	currentPage--
	loadCharacters()
})

nextButton.addEventListener('click', () => {
	currentPage++
	loadCharacters()
})
