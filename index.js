var channels = []
var filteredChannels = []
var allCategories = []

const showChannels = category => {
  const $channelList = document.querySelector('.channel-list')
  $channelList.innerHTML = ''
  const channels = filteredChannels.filter(p => p.categories.find(c => c.name === category || category === 'All'))
  channels.sort((a, b) => a.name - b.name)
  
  for(const channel of channels) {
    const $newChannel = document.createElement('div')
    $newChannel.classList.add('channel')
    const picture = document.createElement('img')
    picture.setAttribute('loading', 'lazy')
    picture.onerror = function () {this.src='https://www.chanel.com/_ui/responsive/theme-onechanel/assets/media/favicon/192x192.png'}
    picture.src = channel.logo
    $newChannel.appendChild(picture)
    const content = document.createTextNode(channel.name)
    $newChannel.appendChild(content)
    $channelList.appendChild($newChannel)

    $newChannel.addEventListener('click', () => {
      const playerWrapper = document.querySelector('.player-wrapper')
      playerWrapper.classList.remove('hidden')
      const player = document.querySelector('#player')
      player.classList.remove('hidden')
      player.innerHTML = ''
      new Clappr.Player({
        source: channel.url,
        parentId: "#player"
      })
      const $allChannels = document.querySelectorAll('.channel')
      $allChannels.forEach(c => c.classList.remove('selected'))
      $newChannel.classList.add('selected')
    })
  }

}

const showCategories = () => {
  const $allCat = document.querySelector('.category.all')
  $allCat.addEventListener('click', () => {
    const allCategories = document.querySelectorAll('.category')
    allCategories.forEach(c => c.classList.remove('selected'))
    $allCat.classList.add('selected')
    showChannels('All')
  })

  const $categories = document.querySelector('.categories')
  
  for (const category of allCategories) {
    const $newCategory = document.createElement('div')
    $newCategory.classList.add('category')
    const content = document.createTextNode(category)
    $newCategory.appendChild(content)
    $categories.appendChild($newCategory)

    $newCategory.addEventListener('click', () => {
      const allCategories = document.querySelectorAll('.category')
      allCategories.forEach(c => c.classList.remove('selected'))
      $newCategory.classList.add('selected')
      showChannels(category)
    })
  }
}

const fetchChannels = async () => {
  const channelsData = await fetch('https://iptv-org.github.io/iptv/channels.json')
  channels = await channelsData.json()

  const urlSearchParams = new URLSearchParams(window.location.search);
  const {lang, country} = Object.fromEntries(urlSearchParams.entries());

  channels = channels.filter(c => (!c.categories.find(x => x.name === 'XXX')))

  filteredChannels = channels.filter(c => 
    (!c.categories.find(x => x.name === 'XXX')) &&
    (
      (lang && c.languages.find(x => x.code === lang)) ||
      (country && c.countries.find(x => x.code === country))
    )
  )

  if (!lang && !country) {
    filteredChannels = channels
  }

  allCategories = filteredChannels.map(c => {
    if (c.categories[0]) {
      return c.categories[0].name
    }
    return null;
  }).filter((value, index, self) => {
    if (!value) {
      return false
    }

    return self.indexOf(value) === index;
  }).sort()

  showCategories()
  showChannels('All')
}

fetchChannels()