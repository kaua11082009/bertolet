/* ===== Menu mobile ===== */
const menuToggle = document.getElementById("menuToggle");
const nav = document.getElementById("nav");

menuToggle.addEventListener("click", () => {
  nav.classList.toggle("open");
  menuToggle.classList.toggle("active");
});

nav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    nav.classList.remove("open");
    menuToggle.classList.remove("active");
  });
});

/* ===== Reflexão (localStorage) ===== */
const reflexaoInput = document.getElementById("reflexaoInput");
const salvarBtn = document.getElementById("salvarReflexao");
const limparBtn = document.getElementById("limparReflexao");
const statusEl = document.getElementById("reflexaoStatus");

const STORAGE_KEY = "ia-escola-reflexao";

const salva = localStorage.getItem(STORAGE_KEY);
if (salva) {
  reflexaoInput.value = salva;
}

salvarBtn.addEventListener("click", () => {
  const texto = reflexaoInput.value.trim();
  if (!texto) {
    statusEl.textContent = "Escreva algo antes de salvar.";
    statusEl.style.color = "var(--danger)";
    return;
  }
  localStorage.setItem(STORAGE_KEY, texto);
  statusEl.textContent = "Reflexão salva neste dispositivo ✓";
  statusEl.style.color = "var(--success)";
});

limparBtn.addEventListener("click", () => {
  reflexaoInput.value = "";
  localStorage.removeItem(STORAGE_KEY);
  statusEl.textContent = "Reflexão limpa.";
  statusEl.style.color = "var(--text-muted)";
});

/* ===== Quiz ===== */
const perguntas = [
  {
    pergunta: "O que é Aprendizado de Máquina?",
    opcoes: [
      "Um tipo de robô físico que anda sozinho",
      "Sistemas que melhoram com dados, sem programação explícita para cada tarefa",
      "Um aplicativo de edição de fotos",
      "Um sistema operacional para escolas",
    ],
    correta: 1,
    explicacao: "Aprendizado de Máquina (Machine Learning) permite que algoritmos aprendam padrões a partir de dados.",
  },
  {
    pergunta: "Qual é um uso comum de IA em plataformas educacionais?",
    opcoes: [
      "Substituir completamente os professores",
      "Ajustar o nível de dificuldade dos exercícios ao desempenho do aluno",
      "Controlar a temperatura da sala de aula",
      "Imprimir provas automaticamente",
    ],
    correta: 1,
    explicacao: "Plataformas adaptativas usam IA para personalizar o ritmo e o desafio de cada estudante.",
  },
  {
    pergunta: "Por que o viés algorítmico é um risco na educação?",
    opcoes: [
      "Porque a IA consome muita energia",
      "Porque sistemas treinados com dados enviesados podem reforçar desigualdades",
      "Porque os computadores ficam lentos",
      "Porque os alunos não gostam de tecnologia",
    ],
    correta: 1,
    explicacao: "Dados históricos enviesados podem fazer a IA tratar grupos de alunos de forma injusta.",
  },
  {
    pergunta: "Sobre privacidade de dados dos alunos, o que é mais importante?",
    opcoes: [
      "Compartilhar todos os dados publicamente para transparência",
      "Não se preocupar, pois dados educacionais não são sensíveis",
      "Saber quem acessa os dados, como são armazenados e protegidos",
      "Deixar a IA decidir sozinha o que fazer com os dados",
    ],
    correta: 2,
    explicacao: "Transparência e proteção dos dados dos estudantes são fundamentais para um uso ético.",
  },
  {
    pergunta: "Qual atitude melhor descreve o uso responsável da IA na escola?",
    opcoes: [
      "Usar a IA para evitar qualquer esforço de pensar",
      "Ignorar completamente a tecnologia",
      "Usar a IA como apoio, mantendo autonomia e pensamento crítico",
      "Deixar a IA avaliar e classificar os alunos sem intervenção humana",
    ],
    correta: 2,
    explicacao: "A IA deve ser ferramenta de apoio, nunca substituta do pensamento crítico e da autonomia.",
  },
];

let indiceAtual = 0;
let acertos = 0;

const quizCounter = document.getElementById("quizCounter");
const quizQuestion = document.getElementById("quizQuestion");
const quizOptions = document.getElementById("quizOptions");
const quizFeedback = document.getElementById("quizFeedback");
const quizNext = document.getElementById("quizNext");
const quizProgressBar = document.getElementById("quizProgressBar");
const quizResult = document.getElementById("quizResult");
const quizResultTitle = document.getElementById("quizResultTitle");
const quizResultText = document.getElementById("quizResultText");
const quizRestart = document.getElementById("quizRestart");

function atualizarProgresso() {
  const pct = (indiceAtual / perguntas.length) * 100;
  quizProgressBar.style.width = `${pct}%`;
}

function mostrarPergunta() {
  const q = perguntas[indiceAtual];
  quizCounter.textContent = `Pergunta ${indiceAtual + 1} de ${perguntas.length}`;
  quizQuestion.textContent = q.pergunta;
  quizOptions.innerHTML = "";
  quizFeedback.hidden = true;
  quizNext.hidden = true;
  quizResult.hidden = true;

  q.opcoes.forEach((texto, i) => {
    const btn = document.createElement("button");
    btn.className = "quiz-option";
    btn.textContent = texto;
    btn.addEventListener("click", () => responder(i));
    quizOptions.appendChild(btn);
  });

  atualizarProgresso();
}

function responder(escolha) {
  const q = perguntas[indiceAtual];
  const botoes = quizOptions.querySelectorAll(".quiz-option");

  botoes.forEach((btn, i) => {
    btn.disabled = true;
    if (i === q.correta) btn.classList.add("correct");
    if (i === escolha && escolha !== q.correta) btn.classList.add("wrong");
  });

  if (escolha === q.correta) {
    acertos++;
    quizFeedback.textContent = "Correto! " + q.explicacao;
    quizFeedback.className = "quiz-feedback correct";
  } else {
    quizFeedback.textContent = "Não foi dessa vez. " + q.explicacao;
    quizFeedback.className = "quiz-feedback wrong";
  }

  quizFeedback.hidden = false;
  quizNext.hidden = false;
  quizNext.textContent = indiceAtual === perguntas.length - 1 ? "Ver resultado" : "Próxima";
}

quizNext.addEventListener("click", () => {
  indiceAtual++;
  if (indiceAtual < perguntas.length) {
    mostrarPergunta();
  } else {
    mostrarResultado();
  }
});

function mostrarResultado() {
  quizOptions.innerHTML = "";
  quizQuestion.textContent = "";
  quizCounter.textContent = "";
  quizFeedback.hidden = true;
  quizNext.hidden = true;
  quizProgressBar.style.width = "100%";

  quizResult.hidden = false;

  const pct = Math.round((acertos / perguntas.length) * 100);
  let mensagem;

  if (pct === 100) {
    quizResultTitle.textContent = "Excelente! 🎉";
    mensagem = "Você acertou todas as perguntas. Continua refletindo criticamente sobre o uso da IA!";
  } else if (pct >= 60) {
    quizResultTitle.textContent = "Muito bem!";
    mensagem = `Você acertou ${acertos} de ${perguntas.length}. Bom domínio do tema — continue explorando.`;
  } else {
    quizResultTitle.textContent = "Continue estudando";
    mensagem = `Você acertou ${acertos} de ${perguntas.length}. Releia as seções do site e tente de novo!`;
  }

  quizResultText.textContent = mensagem;
}

quizRestart.addEventListener("click", () => {
  indiceAtual = 0;
  acertos = 0;
  mostrarPergunta();
});

mostrarPergunta();