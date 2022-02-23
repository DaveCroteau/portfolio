function activateNav() {
	const sections = document.querySelectorAll('section')
	const menu = document.querySelectorAll('nav li')

	if (window.scrollY > document.querySelector('#about').offsetTop - 50) {
		document.querySelector('nav ul').classList.add('nav-dark')
	} else {
		document.querySelector('nav ul').classList.remove('nav-dark')
	}

	sections.forEach(i => {
		const top = window.scrollY
		const offset = i.offsetTop - 75
		const height = i.offsetHeight
		const id = i.getAttribute('id')

		if (top >= offset && top < offset + height) {
			menu.forEach(link => {
				link.classList.remove('active')
				if (document.querySelector('nav li a[href*=' + id + ']')) {
					document.querySelector('nav li a[href*=' + id + ']').parentElement.classList.add('active')
				}
			})
		}
	})
}

function reveal() {
	const reveals = document.querySelectorAll('.reveal')
	for (i = 0; i < reveals.length; i++) {
		const windowHeight = window.innerHeight
		const elementTop = reveals[i].getBoundingClientRect().top

		if (elementTop < windowHeight) {
			reveals[i].classList.add('active')
		} else {
			reveals[i].classList.remove('active')
		}
	}
}

function validateEmail(email) {
	return email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/) ? true : false
}

window.addEventListener('scroll', () => {
	reveal()
	activateNav()
})

document.querySelector('nav').addEventListener('click', e => {
	if (window.matchMedia('(max-width: 940px)').matches) {
		document.querySelector('.toggler').checked = false
	}
})

document.querySelector('#submit').addEventListener('click', e => {
	e.preventDefault()

	const form = document.querySelector('#contact-form')
	const elements = [...form.elements].filter(el => el.type != 'button')
	const data = elements.reduce((acc, el) => {
		el.name === 'email' ? (acc[el.name] = el.value.toLowerCase().trim()) : (acc[el.name] = el.value.trim())
		return acc
	}, {})

	const confirm = document.querySelector('.form-confirmation')

	// set red borders
	elements.forEach(el => {
		if (!el.value.trim()) {
			document.querySelector(`#${el.id}`).classList.add('field-error')
		}
	})

	// return if missing fields
	if (elements.filter(el => el.value === '').length > 0) {
		confirm.classList.add('form-error', 'active')
		confirm.textContent = 'Veuillez remplir tous les champs'
		setTimeout(() => {
			confirm.classList.remove('form-error', 'active')
			confirm.textContent = ''
		}, 5000)
		return
	}

	// return if email not valid
	if (!validateEmail(data.email)) {
		document.querySelector('#email').classList.add('field-error')
		confirm.classList.add('form-error', 'active')
		confirm.textContent = 'Veuillez entrer un courriel valide'
		setTimeout(() => {
			confirm.classList.remove('form-error', 'active')
			confirm.textContent = ''
		}, 5000)
		return
	}

	const formData = new FormData(form)
	fetch('/', {
		method: 'POST',
		headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
		body: new URLSearchParams(formData).toString(),
	})
		.then(() => {
			form.reset()
			confirm.classList.add('form-success', 'active')
			confirm.textContent = 'Message envoyé'
			setTimeout(() => {
				confirm.classList.remove('form-success', 'active')
				confirm.textContent = ''
			}, 5000)
		})
		.catch(err => console.log(err))
})

document.querySelector('#contact-form').addEventListener('change', e => {
	if ([...e.target.classList].includes('field-error')) {
		e.target.classList.remove('field-error')
	}
	if (e.target.value === '') {
		e.target.classList.add('field-error')
	}
})

document.querySelector('#email').addEventListener('blur', e => {
	if (!validateEmail(e.target.value)) {
		e.target.classList.add('field-error')
	}
})
