const html = document.querySelector('html')
const focuBtn = document.querySelector('.app__card-button--foco')
const curtoBtn = document.querySelector('.app__card-button--curto')
const longoBtn = document.querySelector('.app__card-button--longo')
const banner = document.querySelector('.app__image')
const text = document.querySelector('.app__title')
const buttons = document.querySelectorAll('.app__card-button')
const changeMusic = document.querySelector('#alternar-musica')
const music = new Audio ('/sons/luna-rise-part-one.mp3')
const startAudio = new Audio ('/sons/play.wav')
const startBtn = document.querySelector('#start-pause')
const finishAudio = new Audio  ('/sons/beep.mp3')
const pauseAudio = new Audio  ('/sons/pause.mp3')
const iniciateBtn = document.querySelector('#start-pause span') 
const imgIniciateBtn = document.querySelector('#start-pause img')
const printTimer = document.querySelector('#timer')
const showForm = document.querySelector('.app__button--add-task')
const hiddeForm = document.querySelector('.app__form-footer__button--cancel')
const deletForm = document.querySelector('.app__form-footer__button--delete')
const form = document.querySelector('.app__form-add-task')
const formTextArea = document.querySelector('.app__form-textarea')
const ulTasks = document.querySelector('.app__section-task-list')
const paragDescTask = document.querySelector('.app__section-active-task-description ')
const btnRemoveComplete = document.querySelector('#btn-remover-concluidas')
const btnRemoveAll = document.querySelector('#btn-remover-todas')

let tasks = JSON.parse(localStorage.getItem('tasks')) || []

let timer = null
let intervalId = null
let selectedTask = null
let liSelectedTask = null



music.loop = true   

changeMusic.addEventListener('change', () => {
    if(music.paused){
        music.play()
    }else{
        music.pause()
    }
})

function createTask(task) {
    const list = document.createElement('li')
    list.classList.add('app__section-task-list-item')

    const svg = document.createElement('svg')
    svg.innerHTML = ` 
    <svg class="app__section-task-icon-status" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="12" fill="#FFF"></circle>
        <path d="M9 16.1719L19.5938 5.57812L21 6.98438L9 18.9844L3.42188 13.4062L4.82812 12L9 16.1719Z" fill="#01080E"></path>
    </svg>
    `

    const parag = document.createElement('p')
    parag.classList.add('app__section-task-list-item-description')
    parag.textContent = task.desc

    const button = document.createElement('button')
    button.classList.add('app_button-edit')
    const btnImg = document.createElement('img')
    btnImg.setAttribute('src', '/imagens/edit.png')

    btnImg.onclick = () => {
       const newDesc = prompt("Qual é o novo nome da tarefa?   ")
       if (newDesc){
        parag.textContent = newDesc
        task.desc = newDesc
        attTasks()
    }
    }

    button.append(btnImg)
    list.append(svg)
    list.append(parag)
    list.append(button)

    if(task.complete) {
        list.classList.add('app__section-task-list-item-complete')
        button.setAttribute('disabled', 'disabled') 
    }else {
        list.onclick = () => {
            document.querySelectorAll('.app__section-task-list-item-active')
                .forEach(element => {
                    element.classList.remove('app__section-task-list-item-active')
                })
            if(selectedTask == task ) {
                paragDescTask.textContent = ''
                selectedTask == null
                return selectedTask = null
            }
            selectedTask = task
            liSelectedTask = list
            paragDescTask.textContent = task.desc
            list.classList.add('app__section-task-list-item-active')
           }
    }

    

    return list
}




focuBtn.addEventListener('click', () => {
    timer = 1500
    changeContext('foco')
    focuBtn.classList.add('active')
})

curtoBtn.addEventListener('click', () => {
    timer = 300
    changeContext('descanso-curto')
    curtoBtn.classList.add('active')
})

longoBtn.addEventListener('click', () => {
    timer = 900
    changeContext('descanso-longo')
    longoBtn.classList.add('active')
})

function changeContext (contexto) {
    showTimer()
    buttons.forEach(function (contexto){
        contexto.classList.remove('active')
    }) 
    html.setAttribute('data-contexto' , contexto);
    banner.setAttribute('src', `/imagens/${contexto}.png`);
    switch (contexto) {
        case 'foco':
            text.innerHTML =`Otimize sua produtividade,<br>
            <strong class="app__title-strong">mergulhe no que importa.</strong>`

            break;
        case "descanso-curto":
            text.innerHTML =
            `Que tal dar um respirada?<br>
            <strong class="app__title-strong">Faça uma pausa curta.</strong>`

            break;
        case "descanso-longo":
            text.innerHTML =`Hora de voltar a superficie<br>
            <strong class="app__title-strong">Faça uma pausa longa.</strong>`
        default:
            break;
    }
}



function zero() {
    clearInterval(intervalId)
    intervalId = null
    iniciateBtn.textContent = "Começar"
    imgIniciateBtn.setAttribute('src', '/imagens/play_arrow.png')
}



const regressiveTime = () => {
    if(timer <= 0) {
        finishAudio.play()
        alert('Tempo finalizado');
        const ActiveFoco = html.getAttribute('data-contexto') == 'foco'
        if (ActiveFoco) {
            const evento = new CustomEvent('finishFoco')
            document.dispatchEvent(evento)

        }
        zero();
    }
    timer --
    showTimer()
}

startBtn.addEventListener('click', start)

function start () {
    if(intervalId){
        zero();
        return;
    }
    startAudio.play()
    intervalId = setInterval(regressiveTime, 1000)
    iniciateBtn.textContent = "Pausar"
    imgIniciateBtn.setAttribute('src', '/imagens/pause.png')
}

function showTimer () {
    const time = new Date(timer * 1000)
    const formTime = time.toLocaleTimeString('pt-Br', {minute: '2-digit', second: '2-digit'})
    printTimer.innerHTML =`${formTime}`
}

showTimer()

showForm.addEventListener('click', () => {
    form.classList.toggle('hidden')
})

const clearForm = () => {
    formTextArea.value = ''
}

deletForm.addEventListener('click', () => {
    clearForm()
})

hiddeForm.addEventListener('click', () => {
    form.classList.add('hidden')
    clearForm()
} )

function attTasks () {
    localStorage.setItem('tasks', JSON.stringify(tasks))
}

form.addEventListener('submit', (evento) => {
    evento.preventDefault();
    const task = {
        desc: formTextArea.value
    }
    tasks.push(task)
    const elementTask = createTask(task)
    ulTasks.append(elementTask)
    attTasks()
    formTextArea.value = ''
    form.classList.add('hidden')
});



tasks.forEach(task => {
    const taskElement = createTask(task)
    ulTasks.append(taskElement)
});

document.addEventListener('finishFoco', () => {
    if (selectedTask && liSelectedTask) {
        liSelectedTask.classList.remove('app__section-task-list-item-active')
        liSelectedTask.classList.add('app__section-task-list-item-complete')
        liSelectedTask.querySelector('button').setAttribute('disabled', 'disabled')
        selectedTask.complete = true
        attTasks()
    }
})

const removeTasks = (justComplete) => {
    const selector = justComplete ? ".app__section-task-list-item-complete" : ".app__section-task-list-item"
    document.querySelectorAll(selector).forEach(element => {
        element.remove()
    })
    tasks = justComplete ? tasks.filter(task => !task.complete) : []
    attTasks()
}

btnRemoveComplete.onclick = () => removeTasks(true)

btnRemoveAll.onclick = () => removeTasks(false)