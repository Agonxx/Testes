// Tópicos centralizados — edite aqui para adicionar novos tópicos ao site inteiro
const topics = [
  { title: "Present Simple",     desc: "Rotinas, hábitos e fatos gerais",           file: "present-simple.html",     category: "present" },
  { title: "Present Continuous", desc: "Ações acontecendo agora ou temporárias",     file: "present-continuous.html",  category: "present" },
  { title: "Present Perfect",    desc: "Conexão entre passado e presente",           file: "present-perfect.html",     category: "present" },
  { title: "Present Perfect Continuous", desc: "Ações que começaram no passado e continuam agora", file: "present-perfect-continuous.html", category: "present" },
  { title: "Past Simple",        desc: "Ações concluídas no passado",               file: "past-simple.html",         category: "past" },
  { title: "Past Continuous",    desc: "Ações em andamento no passado",             file: "past-continuous.html",      category: "past" },
  { title: "Past Perfect",       desc: "Uma ação antes de outra no passado",        file: "past-perfect.html",         category: "past" },
  { title: "Past Perfect Continuous", desc: "Ação contínua antes de outra no passado", file: "past-perfect-continuous.html", category: "past" },
  { title: "Future Simple",      desc: "Previsões, promessas e decisões com will",  file: "future-simple.html",        category: "future" },
  { title: "Future: Going To",   desc: "Planos decididos e previsões com evidência", file: "future-going-to.html",     category: "future" },
  { title: "Future Continuous",  desc: "Ações que estarão em andamento no futuro",  file: "future-continuous.html",    category: "future" },
  { title: "Future Perfect",     desc: "Ações concluídas antes de um ponto no futuro", file: "future-perfect.html",   category: "future" },
];

// Nomes dos grupos para exibir no menu
const categoryNames = {
  present: "Present",
  past: "Past",
  future: "Future",
};

// Monta o menu com dropdowns por grupo
(function buildMenu() {
  const menu = document.getElementById('menu');
  if (!menu) return;

  // Home link
  const homeLink = document.createElement('a');
  homeLink.href = 'english.html';
  homeLink.textContent = 'Home';
  homeLink.className = 'menu-home';
  menu.appendChild(homeLink);

  // Agrupa tópicos por categoria
  const groups = {};
  topics.forEach(topic => {
    const cat = topic.category || 'other';
    if (!groups[cat]) groups[cat] = [];
    groups[cat].push(topic);
  });

  // Cria um dropdown para cada grupo
  Object.keys(groups).forEach(cat => {
    const dropdown = document.createElement('div');
    dropdown.className = 'menu-dropdown';

    const btn = document.createElement('button');
    btn.className = 'menu-dropdown-btn';
    btn.textContent = categoryNames[cat] || cat;
    btn.innerHTML += ' <span class="arrow">&#9662;</span>';
    dropdown.appendChild(btn);

    const list = document.createElement('div');
    list.className = 'menu-dropdown-list';

    groups[cat].forEach(topic => {
      const link = document.createElement('a');
      link.href = topic.file;
      link.textContent = topic.title;
      list.appendChild(link);
    });

    dropdown.appendChild(list);
    menu.appendChild(dropdown);

    // Toggle no click (funciona bem em mobile)
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      // Fecha outros dropdowns abertos
      document.querySelectorAll('.menu-dropdown.open').forEach(d => {
        if (d !== dropdown) d.classList.remove('open');
      });
      dropdown.classList.toggle('open');
    });
  });

  // Fecha dropdowns ao clicar fora
  document.addEventListener('click', () => {
    document.querySelectorAll('.menu-dropdown.open').forEach(d => {
      d.classList.remove('open');
    });
  });
})();
