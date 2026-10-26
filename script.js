
const perfis = [
  {
    id: 1,
    nome: "Engenheiro de Sistemas",
    categoria: "CONSTRUÇÃO",
    especialidade: "Tecnologia e resolução de problemas",
    missao: "Manutenção da nave e construção da base",
    descricao: "Você gosta de entender como as coisas funcionam e encontrar soluções para os problemas. Na equipe, sua habilidade para lidar com equipamentos pode fazer muita diferença.",
    recomendacao: "Sua missão será manter os sistemas da nave funcionando, reparar equipamentos e ajudar a construir uma base segura para a equipe. Quando surgir um problema técnico, todos poderão contar com sua capacidade de encontrar soluções.",
    imagem: "imagem/perfil-1.jpg"
  },
  {
    id: 2,
    nome: "Cientista Explorador",
    categoria: "INVESTIGAÇÃO",
    especialidade: "Pesquisa e análise de descobertas",
    missao: "Estudo do ambiente e coleta de amostras",
    descricao: "Você é curioso e gosta de descobrir como as coisas funcionam. Antes de tirar conclusões, prefere observar, pesquisar e reunir informações.",
    recomendacao: "Sua missão será estudar as características de Aura, analisar amostras e registrar as descobertas da equipe. Seu trabalho ajudará a entender melhor o planeta e a preparar futuras expedições.",
    imagem: "imagem/perfil-2.jpg"
  },
  {
    id: 3,
    nome: "Explorador de Campo",
    categoria: "EXPLORAÇÃO",
    especialidade: "Orientação e reconhecimento de terreno",
    missao: "Mapeamento de regiões desconhecidas",
    descricao: "Você gosta de conhecer lugares novos e aprender com experiências. Quando surge um desafio, procura se adaptar e encontrar outras maneiras de seguir em frente.",
    recomendacao: "Sua missão será explorar regiões desconhecidas, mapear o terreno e identificar caminhos para a equipe. Você ajudará a descobrir quais áreas podem ser exploradas e quais exigem mais cuidado.",
    imagem: "imagem/perfil-3.jpg"
  },
  {
    id: 4,
    nome: "Estrategista da Missão",
    categoria: "PLANEJAMENTO",
    especialidade: "Organização e tomada de decisões",
    missao: "Coordenação das operações da expedição",
    descricao: "Você gosta de organizar as coisas, pensar nas possibilidades e ajudar o grupo a tomar decisões. Consegue considerar diferentes pontos de vista antes de escolher um caminho.",
    recomendacao: "Sua missão será organizar as tarefas, definir prioridades e preparar planos para os imprevistos. Você ajudará a equipe a trabalhar em conjunto e a tomar decisões importantes durante a expedição.",
    imagem: "imagem/perfil-4.jpg"
  }
];

const formulario = document.getElementById("formulario");
const campoNome = document.getElementById("nome");
const campoNascimento = document.getElementById("nascimento");

const etapaDados = document.getElementById("etapa-dados");
const painelPerguntas = document.getElementById("painel-perguntas");
const etapasPerguntas = Array.from(
  document.querySelectorAll(".etapa-pergunta")
);

const mensagemDados = document.getElementById("mensagem-dados");
const mensagemPergunta = document.getElementById("mensagem-pergunta");

const botaoIniciar = document.getElementById("iniciar-teste");
const botaoVoltar = document.getElementById("voltar");
const botaoAvancar = document.getElementById("avancar");
const botaoFinalizar = document.getElementById("finalizar");

const barraProgresso = document.getElementById("barra-progresso");
const preenchimento = document.getElementById("preenchimento");
const etapaAtual = document.getElementById("etapa-atual");
const progressoPorcentagem = document.getElementById("progresso-porcentagem");
const marcadores = Array.from(
  document.querySelectorAll(".marcador")
);

const questionario = document.getElementById("questionario");
const resultado = document.getElementById("resultado");
const botaoRefazer = document.getElementById("refazer");
const botaoCopiar = document.getElementById("copiar-resultado");
const textoCopiar = document.getElementById("texto-copiar");
const mensagemCopia = document.getElementById("mensagem-copia");

let perguntaAtual = 0;
let nomeParticipante = "";
let idadeParticipante = 0;
let perfilEscolhido = null;

const hoje = new Date();

function formatarData(data) {
  const ano = data.getFullYear();
  const mes = String(data.getMonth() + 1).padStart(2, "0");
  const dia = String(data.getDate()).padStart(2, "0");

  return `${ano}-${mes}-${dia}`;
}

campoNascimento.max = formatarData(hoje);

function calcularIdade(data) {
  const nascimento = new Date(`${data}T00:00:00`);
  const dataAtual = new Date();

  let idade = dataAtual.getFullYear() - nascimento.getFullYear();

  const mesAtual = dataAtual.getMonth();
  const mesNascimento = nascimento.getMonth();

  if (
    mesAtual < mesNascimento ||
    (
      mesAtual === mesNascimento &&
      dataAtual.getDate() < nascimento.getDate()
    )
  ) {
    idade--;
  }

  return idade;
}

function dadosValidos() {
  mensagemDados.textContent = "";

  const nome = campoNome.value.trim();
  const nascimento = campoNascimento.value;

  if (nome === "") {
    mensagemDados.textContent = "Digite seu nome antes de continuar.";
    campoNome.focus();
    return false;
  }

  if (nascimento === "") {
    mensagemDados.textContent = "Informe sua data de nascimento.";
    campoNascimento.focus();
    return false;
  }

  const dataInformada = new Date(`${nascimento}T00:00:00`);
  const dataAtual = new Date(`${formatarData(new Date())}T00:00:00`);

  if (
    Number.isNaN(dataInformada.getTime()) ||
    dataInformada > dataAtual
  ) {
    mensagemDados.textContent =
      "Informe uma data de nascimento válida, que não seja futura.";
    campoNascimento.focus();
    return false;
  }

  const idade = calcularIdade(nascimento);

  if (idade < 0) {
    mensagemDados.textContent = "Confira sua data de nascimento.";
    campoNascimento.focus();
    return false;
  }

  nomeParticipante = nome;
  idadeParticipante = idade;

  return true;
}

function animarEntrada(elemento) {
  elemento.classList.remove("animar-entrada");

  // Reinicia a animação para que funcione a cada troca de etapa.
  void elemento.offsetWidth;

  elemento.classList.add("animar-entrada");
}

function iniciarTeste() {
  if (!dadosValidos()) {
    return;
  }

  etapaDados.hidden = true;
  painelPerguntas.hidden = false;
  perguntaAtual = 0;

  mostrarPergunta();
  questionario.scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
}

function atualizarProgresso() {
  const numeroEtapa = perguntaAtual + 1;
  const porcentagem = numeroEtapa * 25;

  preenchimento.style.width = `${porcentagem}%`;
  etapaAtual.textContent = `ETAPA ${String(numeroEtapa).padStart(2, "0")}`;
  progressoPorcentagem.textContent = `${porcentagem}% concluído`;

  barraProgresso.setAttribute("aria-valuenow", numeroEtapa);

  marcadores.forEach(function (marcador, indice) {
    marcador.classList.toggle("ativo", indice === perguntaAtual);
    marcador.classList.toggle("concluido", indice < perguntaAtual);
  });

  botaoVoltar.disabled = false;
  botaoVoltar.style.visibility =
    perguntaAtual === 0 ? "hidden" : "visible";

  botaoAvancar.hidden = perguntaAtual === etapasPerguntas.length - 1;
  botaoFinalizar.hidden = perguntaAtual !== etapasPerguntas.length - 1;
}

function mostrarPergunta() {
  mensagemPergunta.textContent = "";

  etapasPerguntas.forEach(function (etapa, indice) {
    etapa.hidden = indice !== perguntaAtual;
  });

  atualizarProgresso();

  const pergunta = etapasPerguntas[perguntaAtual];
  animarEntrada(pergunta);

  // Leva a pergunta para a área visível sem perder a posição da página.
  pergunta.scrollIntoView({
    behavior: "smooth",
    block: "nearest"
  });
}

function respostaAtualValida() {
  const numero = perguntaAtual + 1;
  const resposta = document.querySelector(
    `input[name="q${numero}"]:checked`
  );

  if (resposta === null) {
    mensagemPergunta.textContent =
      "Escolha uma alternativa antes de continuar.";

    const pergunta = etapasPerguntas[perguntaAtual];
    pergunta.classList.remove("animar-entrada");

    return false;
  }

  mensagemPergunta.textContent = "";
  return true;
}

function avancarPergunta() {
  if (!respostaAtualValida()) {
    return;
  }

  if (perguntaAtual < etapasPerguntas.length - 1) {
    perguntaAtual++;
    mostrarPergunta();
  }
}

function voltarPergunta() {
  mensagemPergunta.textContent = "";

  if (perguntaAtual > 0) {
    perguntaAtual--;
    mostrarPergunta();
  } else {
    painelPerguntas.hidden = true;
    etapaDados.hidden = false;

    animarEntrada(etapaDados);

    questionario.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  }
}

function pegarRespostas() {
  const respostas = [];

  for (let numero = 1; numero <= 4; numero++) {
    const resposta = document.querySelector(
      `input[name="q${numero}"]:checked`
    );

    if (resposta === null) {
      return null;
    }

    respostas.push(Number(resposta.value));
  }

  return respostas;
}

function descobrirPerfil(respostas) {
  const pontos = [0, 0, 0, 0];

  respostas.forEach(function (resposta) {
    pontos[resposta - 1]++;
  });

  const maiorPontuacao = Math.max(...pontos);
  const ultimoPerfil = respostas[respostas.length - 1] - 1;

  // Em caso de empate, a última resposta decide entre os perfis empatados.
  if (pontos[ultimoPerfil] === maiorPontuacao) {
    return perfis[ultimoPerfil];
  }

  const indicePerfil = pontos.indexOf(maiorPontuacao);
  return perfis[indicePerfil];
}

function criarCodigoArquivo(perfil) {
  const numero = String(perfil.id).padStart(2, "0");
  return `AURA // TRIPULANTE-${numero}`;
}

function mostrarResultado(perfil) {
  perfilEscolhido = perfil;

  document.getElementById("saudacao").textContent =
    `Olá, ${nomeParticipante}!`;

  document.getElementById("idade-perfil").textContent =
    `${idadeParticipante} ${idadeParticipante === 1 ? "ano" : "anos"} • Registro confirmado`;

  document.getElementById("categoria").textContent =
    perfil.categoria;

  document.getElementById("nome-perfil").textContent =
    perfil.nome;

  document.getElementById("descricao-perfil").textContent =
    perfil.descricao;

  document.getElementById("especialidade-perfil").textContent =
    perfil.especialidade;

  document.getElementById("missao-perfil").textContent =
    perfil.missao;

  document.getElementById("recomendacao-perfil").textContent =
    perfil.recomendacao;

  document.getElementById("texto-final").textContent =
    `${nomeParticipante}, seu perfil foi registrado. Sua jornada em Aura está pronta para começar!`;

  document.getElementById("codigo-arquivo").textContent =
    criarCodigoArquivo(perfil);

  const imagem = document.getElementById("imagem-perfil");

  imagem.onerror = function () {
    this.onerror = null;
    this.alt =
      "Imagem não encontrada. Confira o nome e a extensão do arquivo na pasta imagem.";
  };

  imagem.src = perfil.imagem;
  imagem.alt = `Imagem do perfil ${perfil.nome}`;

  textoCopiar.textContent = "Copiar meu resultado";
  mensagemCopia.textContent = "";

  questionario.hidden = true;
  resultado.hidden = false;

  animarEntrada(resultado);

  resultado.scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
}

function finalizarTeste() {
  if (!respostaAtualValida()) {
    return;
  }

  const respostas = pegarRespostas();

  if (respostas === null) {
    mensagemPergunta.textContent =
      "Responda a todas as perguntas antes de finalizar.";
    return;
  }

  const perfil = descobrirPerfil(respostas);
  mostrarResultado(perfil);
}

function obterTextoResultado() {
  if (!perfilEscolhido) {
    return "";
  }

  return [
    "MISSÃO AURA — ARQUIVO DA EXPEDIÇÃO",
    "",
    `Tripulante: ${nomeParticipante}`,
    `Idade: ${idadeParticipante} ${idadeParticipante === 1 ? "ano" : "anos"}`,
    `Perfil: ${perfilEscolhido.nome}`,
    `Categoria: ${perfilEscolhido.categoria}`,
    `Especialidade: ${perfilEscolhido.especialidade}`,
    `Missão recomendada: ${perfilEscolhido.missao}`,
    "",
    perfilEscolhido.descricao,
    "",
    `Diretriz da missão: ${perfilEscolhido.recomendacao}`,
    "",
    criarCodigoArquivo(perfilEscolhido)
  ].join("\n");
}

async function copiarResultado() {
  const texto = obterTextoResultado();

  if (!texto) {
    mensagemCopia.textContent =
      "Não foi possível preparar seu resultado. Tente novamente.";
    return;
  }

  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(texto);
    } else {
      // Alternativa para páginas abertas diretamente no computador.
      const areaTexto = document.createElement("textarea");

      areaTexto.value = texto;
      areaTexto.setAttribute("readonly", "");
      areaTexto.style.position = "fixed";
      areaTexto.style.left = "-9999px";
      areaTexto.style.opacity = "0";

      document.body.appendChild(areaTexto);
      areaTexto.select();

      const copiou = document.execCommand("copy");
      areaTexto.remove();

      if (!copiou) {
        throw new Error("A cópia não foi concluída.");
      }
    }

    textoCopiar.textContent = "Resultado copiado!";
    mensagemCopia.textContent =
      "Pronto! Seu arquivo foi copiado para a área de transferência.";
  } catch (erro) {
    mensagemCopia.textContent =
      "Não foi possível copiar automaticamente. Você pode selecionar e copiar o texto do resultado.";
  }
}

function refazerTeste() {
  formulario.reset();

  perguntaAtual = 0;
  nomeParticipante = "";
  idadeParticipante = 0;
  perfilEscolhido = null;

  mensagemDados.textContent = "";
  mensagemPergunta.textContent = "";
  mensagemCopia.textContent = "";

  etapaDados.hidden = false;
  painelPerguntas.hidden = true;
  resultado.hidden = true;
  questionario.hidden = false;

  campoNascimento.max = formatarData(new Date());

  etapasPerguntas.forEach(function (etapa) {
    etapa.hidden = true;
  });

  preenchimento.style.width = "25%";
  etapaAtual.textContent = "ETAPA 01";
  progressoPorcentagem.textContent = "25% concluído";
  barraProgresso.setAttribute("aria-valuenow", "1");

  marcadores.forEach(function (marcador, indice) {
    marcador.classList.toggle("ativo", indice === 0);
    marcador.classList.remove("concluido");
  });

  botaoVoltar.style.visibility = "hidden";
  botaoAvancar.hidden = false;
  botaoFinalizar.hidden = true;
  textoCopiar.textContent = "Copiar meu resultado";

  questionario.scrollIntoView({
    behavior: "smooth",
    block: "start"
  });

  window.setTimeout(function () {
    campoNome.focus({ preventScroll: true });
  }, 350);
}

botaoIniciar.addEventListener("click", iniciarTeste);
botaoVoltar.addEventListener("click", voltarPergunta);
botaoAvancar.addEventListener("click", avancarPergunta);
botaoFinalizar.addEventListener("click", finalizarTeste);
botaoCopiar.addEventListener("click", copiarResultado);
botaoRefazer.addEventListener("click", refazerTeste);

// Impede que Enter envie o formulário e pule as etapas.
formulario.addEventListener("submit", function (evento) {
  evento.preventDefault();
});
