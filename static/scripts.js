document.addEventListener('DOMContentLoaded', function(){
  addFAQRecentes();
  messageInitial();

 var meuCheckbox = document.getElementById('check');
  meuCheckbox.addEventListener('change', function() {
    if (meuCheckbox.checked) {
      inserirChat();
    } else {
      removerChat();
    }
  });
});

function messageInitial(){
      
  $(function() {
    var staticBackdrop = document.getElementById('staticBackdrop');
    var myModal = new bootstrap.Modal(staticBackdrop);
    myModal.show();
  });
};


const items = document.querySelectorAll('.accordion button');

function toggleAccordion() {
  const itemToggle = this.getAttribute('aria-expanded');

  for (i = 0; i < items.length; i++) {
    items[i].setAttribute('aria-expanded', 'false');
  }

  if (itemToggle == 'false') {
    this.setAttribute('aria-expanded', 'true');
  };
};

items.forEach(item => item.addEventListener('click', toggleAccordion));

$('.btn').on('click', function() {
  var $this = $(this);
  $this.button('loading');
  setTimeout(function() {
    $this.button('reset');
  }, 1000);
});


function addFAQRecentes(){
  const form = document.getElementById('accordionExample');
  
  fetch('/faq')
  .then(response => response.json())
  .then(data => {
    if (data.error) {
      console.error('Erro ao obter as perguntas e respostas:', data.error);
    } else {
      const results = data.results;
      let counter = 1;

      results.forEach(result => {
        const number        = counter;
        const idData        = result[0];
        const question      = result[1];
        const answer        = result[2];
        const department    = result[3];
        const created_at    = result[4];
        counter++;

        var idDB            = idData;
        var numerodelinhas  = number;
        var pergunta        = question;
        var resposta        = answer;
        var departamento    = department;
        var dataCriada      = new Date(created_at).toLocaleDateString("pt-BR");
        var dateAgora       = new Date().toLocaleDateString('pt-BR');

        if(numerodelinhas <= 15){
          var carimboRecentes = 'recentes';
        } else {
          var carimboRecentes = 'antigos';
        }

        console.log(carimboRecentes)



        var liAccordionItem, h2Accordion, buttonAccordion, divAccordionCollapse, divAccordionBody, pcontent;

        liAccordionItem = document.createElement('li');
        liAccordionItem.id='cabecalho';
        liAccordionItem.classList.add('accordion-item', 'mb-2', 'shadow-sm', 'filterDiv', `${departamento}`, `${carimboRecentes}`);

        h2Accordion = document.createElement('h2');
        h2Accordion.classList.add('accordion-header');
        h2Accordion.id='heading'+idDB;

        buttonAccordion = document.createElement('button');
        buttonAccordion.classList.add('accordion-button', 'collapsed', 'bg-transparent', 'fw-bold');
        buttonAccordion.type='button';
        buttonAccordion.setAttribute('data-bs-toggle', 'collapse');
        buttonAccordion.setAttribute('data-bs-target', '#collapse'+idDB);
        buttonAccordion.setAttribute('aria-expanded', 'false');
        buttonAccordion.setAttribute('aria-controls', 'collapse'+idDB);
        buttonAccordion.innerHTML = pergunta;

        divAccordionCollapse = document.createElement('div');
        divAccordionCollapse.id='collapse'+idDB;
        divAccordionCollapse.classList.add('accordion-collapse','collapse');
        divAccordionCollapse.setAttribute('aria-labelledby','heading'+idDB);

        divAccordionBody = document.createElement('div');
        divAccordionBody.classList.add('accordion-body');
        
        pcontent = document.createElement('p');
        pcontent.innerHTML= resposta;

        form.appendChild(liAccordionItem);
        liAccordionItem.appendChild(h2Accordion);
        h2Accordion.appendChild(buttonAccordion);

        liAccordionItem.appendChild(divAccordionCollapse);
        divAccordionCollapse.appendChild(divAccordionBody);
        divAccordionBody.appendChild(pcontent);
      });
      filterSelection("recentes");
    }
  })
  .catch(error => {
    console.error('Erro na requisição:', error);
  });
}

function searchFunction() {
  var input, filter, ul, li, s, p, i, txtValue;

  input = document.getElementById('pesquisa-faq');
  filter = input.value.toUpperCase();
  ul = document.getElementById("myUL");
  li = ul.getElementsByClassName('accordion-item');

  for (i = 0; i < li.length; i++) {
    p = li[i].getElementsByClassName("accordion-header")[0];
    s = li[i].getElementsByClassName("accordion-body")[0];
    txtValue = (s.innerText) + " " + (p.innerText).toUpperCase();
    if (txtValue.toUpperCase().indexOf(filter) > -1) {
      li[i].style.display = "";
    } else {
      li[i].style.display = "none";
    };
  };
};

function limparSelecao() {
  var input, ul, li, s, p, i;

  input = document.getElementById('pesquisa-faq');
  ul = document.getElementById("myUL");
  li = ul.getElementsByClassName('accordion-item');

  for (i = 0; i < li.length; i++) {
    filterSelection("todos")
    p = li[i].getElementsByClassName("accordion-header")[0];
    s = li[i].getElementsByClassName("accordion-body")[0];
    li[i].style.display = "none";
    }
  }

filterSelection("todos")
function filterSelection(c) {
  var x, i;
  x = document.getElementsByClassName("filterDiv");
  if (c == "todos") c = "";
  for (i = 0; i < x.length; i++) {
    faqRemoveClass(x[i], "show");
    if (x[i].className.indexOf(c) > -1) faqAddClass(x[i], "show");
  };
};

filterSelection("recentes")
function filterSelection(r) {
  var y, i;
  y = document.getElementsByClassName("filterDiv");
  if (r == "todos") r = "";
  for (i = 0; i < y.length; i++) {
    faqRemoveClass(y[i], "show");
    if (y[i].className.indexOf(r) > -1) faqAddClass(y[i], "show");
  };
};

function faqAddClass(element, name) {
  var i, arr1, arr2;
  arr1 = element.className.split(" ");
  arr2 = name.split(" ");
  for (i = 0; i < arr2.length; i++) {
    if (arr1.indexOf(arr2[i]) == -1) {
      element.className += " " + arr2[i];
    };
  };
};

function faqRemoveClass(element, name) {
  var i, arr1, arr2;
  arr1 = element.className.split(" ");
  arr2 = name.split(" ");
  for (i = 0; i < arr2.length; i++) {
    while (arr1.indexOf(arr2[i]) > -1) {
      arr1.splice(arr1.indexOf(arr2[i]), 1); 
    }
  }
  element.className = arr1.join(" ");
};

var btns = document.querySelectorAll('.btn-departamentos')
for (var j = 0; j < btns.length; j++) {
  btns[j].addEventListener("click", function() {
    var current = document.getElementsByClassName("active");
    current[0].className = current[0].className.replace(" active", "");
    this.className += " active";
    console.log('button active: '+btns)
  });
};


function inserirChat() {
  var wrapper = document.getElementById('wrapper-chat-invisible');
  var codigoHTML = `
    <div class="wrapper-chat" id="wrapper-chat">
      <div class="header-chat">
        <img class="outgoing-bot-image" src="static/avatarBot.jpg" alt="avatarRobo">
        <h6 class="nameBot">IASK</h6>
      </div>

      <div class="card-body-chat">
        <div id="chatbox">
        </div>
        <!-- Input de "Digitando..." -->
        <div class="message-bubble-left outgoing-bot-dig" id="status" style="display: none;">
          <span class="text-bubble-left-textDigitando typing-animation" id="textDigitando" style="display: none;">
          </span>
        </div>


        <div class="container row">
          <form id="chat-form">
            <div>
              <input type="text" id="question-input" placeholder="Escreva aqui a sua Dúvida..." onkeyup="searchFunction()">
            </div>
            <div>
              <button class="btn-enviar" id="btn-enviar" type="submit">
                <img class="img-btn_enviar" src="/static/btn_enviar_branco.png">
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `;

  wrapper.insertAdjacentHTML('beforeend', codigoHTML);

    const chatbox = document.getElementById('chatbox');
    const form = document.getElementById('chat-form');
    const questionInput = document.getElementById('question-input');
    const buttonEnviar = document.getElementById('btn-enviar');

  function messageInitialChat(){
    const botName = document.createElement('span');
    botName.classList.add('bot-name');
    botName.innerText = 'Bot IASK';
    chatbox.appendChild(botName);
    
    const botMessageBubble = document.createElement('div');
    botMessageBubble.classList.add('message-bubble-left');
    botMessageBubble.classList.add('outgoing-bot');
    
    const botMessage = document.createElement('span');
    botMessage.classList.add('text-bubble-left');
    botMessage.innerText = "Olá, sou o Bot IASK, como posso lhe ajudar?";
    botMessageBubble.appendChild(botMessage);
    
    chatbox.appendChild(botMessageBubble);
    };

  messageInitialChat();

  form.addEventListener('submit', function(event) {
    event.preventDefault();
    const question = questionInput.value.trim();
  
    if (question === '') {
      alert('Por favor, digite uma pergunta.');
      return;
    };
  
    questionInput.disabled = true;
    buttonEnviar.disabled = true;
    buttonEnviar.style.backgroundColor='grey';
  
    const userMessageBubble = document.createElement('div');
  
    const userName = document.createElement('span');
    userName.classList.add('user-name');
    userName.innerText = 'Você';
    chatbox.appendChild(userName);
  
    userMessageBubble.classList.add('message-bubble-right');
    userMessageBubble.classList.add('outgoing');
    const userMessage = document.createElement('span');
    userMessage.innerText = question;
    userMessageBubble.appendChild(userMessage);
    chatbox.appendChild(userMessageBubble);
  
    chatbox.scrollTop = chatbox.scrollHeight;

    var status = document.getElementById('status');
    var spanText = document.getElementById('textDigitando');
    status.style.display = 'flex';
    spanText.style.display = 'flex';
    spanText.innerHTML = '...';
    chatbox.appendChild(status);
    chatbox.scrollTop = chatbox.scrollHeight;
  
    fetch('/chat', {
        method: 'POST',
        body: new URLSearchParams({
            question: question
        })
      })
      .then(response => response.json())
      .then(data => 
        {
        const answer = data.answer;
        const answerDetails = data.answerDetails;
        console.log('answer:'+answer+'/n'+'answerDetails:'+answerDetails);
        status.style.display = 'none';
  
        const botName = document.createElement('span');
        botName.classList.add('bot-name');
        botName.innerText = 'Bot IASK';
        chatbox.appendChild(botName);
  
        const botMessageBubble = document.createElement('div');
        botMessageBubble.classList.add('message-bubble-left');
        botMessageBubble.classList.add('outgoing-bot');
  
        const botMessage = document.createElement('span');
        botMessage.classList.add('text-bubble-left');
        botMessage.innerHTML = answer;
        botMessageBubble.appendChild(botMessage);
  
        chatbox.appendChild(botMessageBubble);
  
        questionInput.value = '';
  
        chatbox.scrollTop = chatbox.scrollHeight;
  
        questionInput.disabled = false;
        buttonEnviar.disabled = false;
        buttonEnviar.style.backgroundColor='';

        const campoExpansivel = document.getElementById('chatbox');

        campoExpansivel.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = `${Math.min(this.scrollHeight, 250)}px`;
        });
      })
      .catch(error => {
        console.error('Erro:', error);
        questionInput.disabled = false;
      });
  });
};


function removerChat() {
  var wrapper = document.getElementById('wrapper-chat-invisible');
  var wrapperchat = document.getElementById('wrapper-chat');
  wrapper.removeChild(wrapperchat);
};








document.addEventListener('click', function(e){ console.log(e.target); });
