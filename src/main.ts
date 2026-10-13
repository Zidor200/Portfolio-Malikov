import './style.css'
import cocktailData from './data/signature-cocktails.json' with { type: 'json' }
import galleryData from './data/gallery-cocktails.json' with { type: 'json' }

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
      article.dataset.id = cocktail.id
      article.tabIndex = 0
      article.setAttribute('role', 'button')
      article.setAttribute('aria-label', `Open ${cocktail.name} details`)

      const imageWrap = document.createElement('div')
      imageWrap.className = 'card-image'

      const img = document.createElement('img')
      img.src = `/matrials/${encodeURIComponent(cocktail.image)}`
      img.alt = `${cocktail.name} cocktail`
      imageWrap.append(img)

      const title = document.createElement('h3')
      title.textContent = cocktail.name

      const tags = document.createElement('div')
      tags.className = 'tags'
      cocktail.profile.slice(0, 2).forEach((tag) => {
        const span = document.createElement('span')
        span.textContent = tag
        tags.append(span)
      })

      if (cocktail.ingredients.length) {
        const ingredients = document.createElement('p')
        ingredients.textContent = cocktail.ingredients.slice(0, 3).join(' • ')
        article.append(imageWrap, title, ingredients, tags)
      } else {
        article.append(imageWrap, title, tags)
      }
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

const cocktails = cocktailData.signatureCocktails
const banner = document.querySelector<HTMLElement>('[data-banner]')
const bannerPanel = banner?.querySelector<HTMLElement>('.cocktail-banner__panel')
const bannerImage = banner?.querySelector<HTMLImageElement>('[data-banner-image]')
const bannerTitle = banner?.querySelector<HTMLElement>('[data-banner-title]')
const bannerDescription = banner?.querySelector<HTMLElement>('[data-banner-description]')
const bannerGlass = banner?.querySelector<HTMLElement>('[data-banner-glass]')
const bannerGarnish = banner?.querySelector<HTMLElement>('[data-banner-garnish]')
const bannerServe = banner?.querySelector<HTMLElement>('[data-banner-serve]')
const bannerIngredients = banner?.querySelector<HTMLElement>('[data-banner-ingredients]')
const bannerTags = banner?.querySelector<HTMLElement>('[data-banner-tags]')
const bannerThumbs = banner?.querySelector<HTMLElement>('[data-banner-thumbs]')
let bannerIndex = 0

const cocktailImageSrc = (image: string) => `/matrials/${encodeURIComponent(image)}`

const renderBanner = () => {
  const cocktail = cocktails[bannerIndex]
  if (!cocktail || !bannerImage || !bannerTitle || !bannerDescription) return

  bannerImage.src = cocktailImageSrc(cocktail.image)
  bannerImage.alt = `${cocktail.name} cocktail`
  bannerTitle.textContent = cocktail.name
  bannerDescription.textContent = cocktail.description
  if (bannerGlass) bannerGlass.textContent = cocktail.glass
  if (bannerGarnish) bannerGarnish.textContent = cocktail.garnish
  if (bannerServe) bannerServe.textContent = cocktail.serve

  if (bannerIngredients) {
    bannerIngredients.replaceChildren(
      ...cocktail.ingredients.map((ingredient) => {
        const item = document.createElement('li')
        item.textContent = ingredient
        return item
      }),
    )
  }

  if (bannerTags) {
    bannerTags.replaceChildren(
      ...cocktail.profile.map((tag) => {
        const span = document.createElement('span')
        span.textContent = tag
        return span
      }),
    )
  }

  bannerThumbs?.querySelectorAll('button').forEach((thumb, index) => {
    thumb.classList.toggle('is-active', index === bannerIndex)
  })
}

const renderBannerThumbs = () => {
  if (!bannerThumbs) return

  bannerThumbs.replaceChildren(
    ...cocktails.map((cocktail, index) => {
      const button = document.createElement('button')
      button.type = 'button'
      button.setAttribute('aria-label', cocktail.name)

      const img = document.createElement('img')
      img.src = cocktailImageSrc(cocktail.image)
      img.alt = ''
      button.append(img)
      button.addEventListener('click', () => openBanner(index))
      return button
    }),
  )
}

const openBanner = (index: number) => {
  bannerIndex = (index + cocktails.length) % cocktails.length
  renderBanner()
  if (!banner) return
  banner.hidden = false
  document.body.classList.add('banner-open')
  bannerPanel?.focus()
}

const closeBanner = () => {
  if (!banner) return
  banner.hidden = true
  document.body.classList.remove('banner-open')
}

renderBannerThumbs()

track?.addEventListener('click', (event) => {
  const card = (event.target as HTMLElement).closest<HTMLElement>('.cocktail-card')
  if (!card?.dataset.id) return
  const index = cocktails.findIndex((cocktail) => cocktail.id === card.dataset.id)
  if (index >= 0) openBanner(index)
})

track?.addEventListener('keydown', (event) => {
  if (event.key !== 'Enter' && event.key !== ' ') return
  const card = (event.target as HTMLElement).closest<HTMLElement>('.cocktail-card')
  if (!card?.dataset.id) return
  event.preventDefault()
  const index = cocktails.findIndex((cocktail) => cocktail.id === card.dataset.id)
  if (index >= 0) openBanner(index)
})

document.querySelectorAll<HTMLAnchorElement>('[data-open-banner]').forEach((link) => {
  link.addEventListener('click', (event) => {
    event.preventDefault()
    openBanner(0)
  })
})

banner?.querySelectorAll('[data-banner-close]').forEach((el) => {
  el.addEventListener('click', closeBanner)
})

banner?.querySelector('[data-banner-prev]')?.addEventListener('click', () => openBanner(bannerIndex - 1))
banner?.querySelector('[data-banner-next]')?.addEventListener('click', () => openBanner(bannerIndex + 1))

window.addEventListener('keydown', (event) => {
  if (banner?.hidden) return
  if (event.key === 'Escape') closeBanner()
  if (event.key === 'ArrowLeft') openBanner(bannerIndex - 1)
  if (event.key === 'ArrowRight') openBanner(bannerIndex + 1)
})

const gallery = document.querySelector<HTMLElement>('[data-gallery]')

const renderGallery = () => {
  if (!gallery) return

  gallery.replaceChildren(
    ...galleryData.cocktails.map((cocktail) => {
      const figure = document.createElement('figure')

      const img = document.createElement('img')
      img.src = `/matrials/${encodeURIComponent(cocktail.image)}`
      img.alt = `${cocktail.name} cocktail`

      const caption = document.createElement('figcaption')
      caption.textContent = cocktail.name

      figure.append(img, caption)
      return figure
    }),
  )
}

renderGallery()
