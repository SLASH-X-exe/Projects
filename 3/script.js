const button = document.getElementById('tasbeeh')
const num = document.getElementById('count')
const reset = document.getElementById('reset')
const message = document.getElementById('message')
const daily = document.getElementById('daily')
const total = document.getElementById('total')

const today = new Date().toDateString()
const lastDate = localStorage.getItem('lastDay')

let count = 0
num.innerText = count

const messages = [
    { text: 'ما شاء الله! استمر، ربنا يبارك فيك!' },
    { text: 'غُفرت ذنوبك بإذن الله، كمل طريقك!' },
    { text: 'استغفر الله، اللهم اجعل هذا العداد نورًا لقلبي!' },
    { text: 'سبحان الله، الحمد لله، الله أكبر!' },
]

const last = 'الله أكبر! وصلت لـ 100 استغفار، جزاك الله خيرًا'

let dailyCount = Number(localStorage.getItem('dailyCount')) || 0
let totalCount = Number(localStorage.getItem('totalCount')) || 0

if (!lastDate || lastDate !== today) {
    dailyCount = 0
    localStorage.setItem('dailyCount', 0)
    localStorage.setItem('lastDay', today)
}

daily.innerText = `${dailyCount}: عدد الإستغفارات اليوم`
total.innerText = `${totalCount}: عدد الإستغفارات الكلي`

const tasbeeh = document.getElementById('tasbeeh')

tasbeeh.addEventListener('touchstart', () => {
    tasbeeh.style.transform = 'scale(0.93)'
})
tasbeeh.addEventListener('touchend', () => {
    tasbeeh.style.transform = 'scale(1)'
})

reset.addEventListener('touchstart', () => {
    reset.style.transform = 'scale(0.93)'
})
reset.addEventListener('touchend', () => {
    reset.style.transform = 'scale(1)'
})

button.onclick = function () {
    count += 1
    num.innerText = count

    dailyCount += 1
    totalCount += 1

    localStorage.setItem('dailyCount', dailyCount)
    localStorage.setItem('totalCount', totalCount)
    daily.innerText = `${dailyCount}: عدد الإستغفارات اليوم`
    total.innerText = `${totalCount}: عدد الإستغفارات الكلي`

    if (count === 100) {
        message.innerText = last
        message.style.opacity = 1
        setTimeout(() => { message.style.opacity = 0 }, 5500)
    } else if (count % 20 === 0 && count !== 0) {
        let randomIndex = Math.floor(Math.random() * messages.length)
        let selected = messages[randomIndex]
        message.innerText = selected.text
        message.style.opacity = 1
        setTimeout(() => { message.style.opacity = 0 }, 5500)
    }
}

reset.onclick = function () {
    num.innerText = 0
    count = 0
    message.style.opacity = 0
}