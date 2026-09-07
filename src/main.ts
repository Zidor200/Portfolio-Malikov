import './style.css'
import cocktailData from './data/signature-cocktails.json' with { type: 'json' }

const nav = document.querySelector<HTMLElement>('.nav')
const toggle = document.querySelector<HTMLButtonElement>('.menu-toggle')
const links = Array.from(document.querySelectorAll<HTMLAnchorElement>('[data-nav]'))
const sections = links
  .map((link) => document.querySelector<HTMLElement>(link.getAttribute('href') ?? ''))
  .filter((section): section is HTMLElement => Boolean(section))

const setMenu = (open: boolean) => {
  nav?.classList.toggle('is-open', open)
  toggle?.classList.toggle('is-open', open)
  toggle?.setAttribute('aria-expanded', String(open))
  toggle?.setAttribute('aria-label', open ? 'Close menu' : 'Open menu')
  document.body.classList.toggle('menu-open', open)
}

toggle?.addEventListener('click', () => {
  setMenu(!nav?.classList.contains('is-open'))
})

document.querySelectorAll<HTMLAnchorElement>('.nav a').forEach((link) => {
  link.addEventListener('click', () => setMenu(false))
})

window.addEventListener('resize', () => {
  if (window.innerWidth > 980) setMenu(false)
})

const setActive = () => {
  const y = window.scrollY + 120
  let current = links[0]

  sections.forEach((section, index) => {
    if (section.offsetTop <= y) current = links[index]
  })

  links.forEach((link) => link.classList.toggle('is-active', link === current))
}

window.addEventListener('scroll', setActive, { passive: true })
setActive()

const track = document.querySelector<HTMLElement>('[data-track]')
const prev = document.querySelector<HTMLButtonElement>('.carousel-btn.prev')
const next = document.querySelector<HTMLButtonElement>('.carousel-btn.next')

const renderCocktails = () => {
  if (!track) return

  track.replaceChildren(
    ...cocktailData.signatureCocktails.map((cocktail) => {
      const article = document.createElement('article')
      article.className = 'cocktail-card'

      const imageWrap = document.createElement('div')
      imageWrap.className = 'card-image'

      const img = document.createElement('img')
      img.src = `/matrials/${encodeURIComponent(cocktail.image)}`
      img.alt = `${cocktail.name} cocktail`
      imageWrap.append(img)

      const title = document.createElement('h3')
      title.textContent = cocktail.name

      const ingredients = document.createElement('p')
      ingredients.textContent = cocktail.ingredients.slice(0, 3).join(' • ')

      const tags = document.createElement('div')
      tags.className = 'tags'
      cocktail.profile.slice(0, 2).forEach((tag) => {
        const span = document.createElement('span')
        span.textContent = tag
        tags.append(span)
      })

      article.append(imageWrap, title, ingredients, tags)
      return article
    }),
  )
}

const rotate = (direction: number) => {
  if (!track) return
  if (direction > 0 && track.firstElementChild) {
    track.append(track.firstElementChild)
    return
  }
  if (track.lastElementChild) track.prepend(track.lastElementChild)
}

renderCocktails()
prev?.addEventListener('click', () => rotate(-1))
next?.addEventListener('click', () => rotate(1))
