const url = 'https://api.github.com/users/dec4nini'
const searchInput = document.querySelector("[data-search]")
var blocos = document.getElementById('posts')
function getApi() {
  fetch(url)
    .then(response => console.log(response.json))
    .catch(error => console.error(error))
}

function changeText(field, text) {
  document.getElementById(field).firstChild.data = text;
}

function get_GitHub_Profil_Info() {
  fetch(url)
    .then(response => response.json())
    .then(data => {
      user_name.textContent = data.name
      user_link.href = data.html_url
      user_avatar.src = data.avatar_url
      user_login.textContent = data.login
      user_comp.textContent = data.company
      user_followers.textContent = data.followers
      user_bio.textContent = data.bio
      posts_counter.textContent = data.public_repos + ' publicações'
      user_followers.textContent = data.followers+ ' seguidores'
    })
}

function getNumberOfDays(start, end) {
  const date1 = new Date(start);
  const date2 = new Date(end);

  // One day in milliseconds
  const oneDay = 1000 * 60 * 60 * 24;

  // Calculating the time difference between two dates
  const diffInTime = date2.getTime() - date1.getTime();

  // Calculating the no. of days between two dates
  const diffInDays = Math.round(diffInTime / oneDay);

  return diffInDays;
}
let cards = []
function createCards() {
  const repos = `https://api.github.com/users/dec4nini/repos`
  fetch(repos)
    .then(async res => {
      if (!res.ok) {
        throw new Error(res.status)
      }
      
      var data = await res.json()
        cards = data.map(card => {
        let start = Intl.DateTimeFormat('en-US').format(new Date(card.created_at))
        let end = Intl.DateTimeFormat('en-US').format(new Date())
        let created_at = getNumberOfDays(start, end )

        let block = document.createElement('div')

        let desc = (card.description != null) ? card.description:" ";
        block.innerHTML =       
        `
        <div class="post">
                        
            <div class="post_header">
                <h1><a href='${card.html_url}'>${card.name}</a></h1>
                <div class="time">Há ${created_at} dias</div>
            </div>
            
            <p>${desc}</p>
        </div>`
        
        blocos.appendChild(block)
        return {name: card.name, description: desc, element: block}
      })
    })
    .catch(e => console.log(e))

}

searchInput.addEventListener("input", e => {
  const value = e.target.value.toLowerCase();
  cards.forEach(card => {
    const cardText = card.name.toLowerCase() + card.description.toLowerCase();
    const isVisible = cardText.includes(value);
    card.element.classList.toggle("hide", !isVisible);
  });
});
get_GitHub_Profil_Info()
createCards()

searchInput.addEventListener('input', () => {
  const searchTerm = searchInput.value.toLowerCase();
  const cards = document.querySelectorAll('.post');

  cards.forEach((card) => {
    const title = card.querySelector('h1').textContent.toLowerCase();
    const body = card.querySelector('p').textContent.toLowerCase();

    if (title.includes(searchTerm) || body.includes(searchTerm)) {
      card.style.display = 'block';      
    } else {
      card.style.display = 'none';
    }
  });
});



