import './style.css'

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

const rotate = (direction: number) => {
  if (!track) return
  if (direction > 0 && track.firstElementChild) {
    track.append(track.firstElementChild)
    return
  }
  if (track.lastElementChild) track.prepend(track.lastElementChild)
}

prev?.addEventListener('click', () => rotate(-1))
next?.addEventListener('click', () => rotate(1))
