// Tópicos centralizados — edite aqui para adicionar novos tópicos ao site inteiro
const topics = [

  // ── Beginner ──────────────────────────────────────────────────────────────
  { title: "To Be",                   desc: "am, is, are — o verbo mais fundamental do inglês",     file: "to-be.html",                   level: "beginner" },
  { title: "Articles",                desc: "a, an e the — quando e como usar cada um",             file: "articles.html",                level: "beginner" },
  { title: "Possessives",             desc: "my, your, his, her, its, our, their",                  file: "possessives.html",             level: "beginner" },
  { title: "There is / There are",    desc: "indicar existência de coisas e pessoas",               file: "there-is-there-are.html",      level: "beginner" },
  { title: "Can / Can't",             desc: "habilidade, possibilidade e permissão",                file: "can-cant.html",                level: "beginner" },
  { title: "Imperatives",             desc: "comandos, instruções e sugestões",                     file: "imperatives.html",             level: "beginner" },
  { title: "WH Questions",            desc: "who, what, where, when, why, how e suas variações",    file: "wh-questions.html",            level: "beginner" },
  { title: "Present Simple",          desc: "rotinas, hábitos e fatos gerais",                      file: "present-simple.html",          level: "beginner" },

  // ── Intermediate ──────────────────────────────────────────────────────────
  { title: "Present Continuous",      desc: "ações acontecendo agora ou temporárias",               file: "present-continuous.html",      level: "intermediate" },
  { title: "Past Simple",             desc: "ações concluídas no passado",                          file: "past-simple.html",             level: "intermediate" },
  { title: "Past Continuous",         desc: "ações em andamento no passado",                        file: "past-continuous.html",         level: "intermediate" },
  { title: "Present Perfect",         desc: "conexão entre passado e presente",                     file: "present-perfect.html",         level: "intermediate" },
  { title: "Future Simple",           desc: "previsões, promessas e decisões com will",             file: "future-simple.html",           level: "intermediate" },
  { title: "Future: Going To",        desc: "planos decididos e previsões com evidência",           file: "future-going-to.html",         level: "intermediate" },
  { title: "Modal Verbs",             desc: "should, must, might, could, would e mais",             file: "modal-verbs.html",             level: "intermediate" },
  { title: "Comparatives & Superlatives", desc: "bigger, the biggest — como comparar coisas",      file: "comparatives.html",            level: "intermediate" },
  { title: "1st Conditional",         desc: "situações reais e possíveis no futuro",                file: "first-conditional.html",       level: "intermediate" },
  { title: "Gerunds & Infinitives",   desc: "I like swimming vs I want to swim",                   file: "gerunds-infinitives.html",     level: "intermediate" },

  // ── Advanced ──────────────────────────────────────────────────────────────
  { title: "Present Perfect Continuous", desc: "ações que começaram no passado e continuam agora", file: "present-perfect-continuous.html", level: "advanced" },
  { title: "Past Perfect",            desc: "uma ação antes de outra no passado",                   file: "past-perfect.html",            level: "advanced" },
  { title: "Past Perfect Continuous", desc: "ação contínua antes de outra no passado",             file: "past-perfect-continuous.html", level: "advanced" },
  { title: "Future Continuous",       desc: "ações que estarão em andamento no futuro",             file: "future-continuous.html",       level: "advanced" },
  { title: "Future Perfect",          desc: "ações concluídas antes de um ponto no futuro",        file: "future-perfect.html",          level: "advanced" },
  { title: "Passive Voice",           desc: "foco na ação, não em quem a pratica",                 file: "passive-voice.html",           level: "advanced" },
  { title: "Reported Speech",         desc: "relatar o que alguém disse sem usar aspas",           file: "reported-speech.html",         level: "advanced" },
  { title: "2nd & 3rd Conditional",   desc: "situações hipotéticas, imaginárias e no passado",     file: "conditionals-2-3.html",        level: "advanced" },

];

// Nomes dos níveis exibidos no menu
const levelNames = {
  beginner:     "Beginner",
  intermediate: "Intermediate",
  advanced:     "Advanced",
};

// Monta o menu com dropdowns por nível
(function buildMenu() {
  const menu = document.getElementById('menu');
  if (!menu) return;

  // Home link
  const homeLink = document.createElement('a');
  homeLink.href = 'english.html';
  homeLink.textContent = 'Home';
  homeLink.className = 'menu-home';
  menu.appendChild(homeLink);

  // Agrupa tópicos por nível (ordem fixa)
  const groups = { beginner: [], intermediate: [], advanced: [] };
  topics.forEach(topic => {
    const lvl = topic.level || 'beginner';
    if (groups[lvl]) groups[lvl].push(topic);
  });

  // Cria um dropdown para cada nível
  ['beginner', 'intermediate', 'advanced'].forEach(lvl => {
    const dropdown = document.createElement('div');
    dropdown.className = 'menu-dropdown';

    const btn = document.createElement('button');
    btn.className = 'menu-dropdown-btn';
    btn.textContent = levelNames[lvl];
    btn.innerHTML += ' <span class="arrow">&#9662;</span>';
    dropdown.appendChild(btn);

    const list = document.createElement('div');
    list.className = 'menu-dropdown-list';

    groups[lvl].forEach(topic => {
      const link = document.createElement('a');
      link.href = topic.file;
      link.textContent = topic.title;
      list.appendChild(link);
    });

    dropdown.appendChild(list);
    menu.appendChild(dropdown);

    // Toggle no click
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      document.querySelectorAll('.menu-dropdown.open').forEach(d => {
        if (d !== dropdown) d.classList.remove('open');
      });
      dropdown.classList.toggle('open');
    });
  });

  // Fecha dropdowns ao clicar fora
  document.addEventListener('click', () => {
    document.querySelectorAll('.menu-dropdown.open').forEach(d => d.classList.remove('open'));
  });
})();
