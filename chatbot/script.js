// JavaScript
const chatInput = document.querySelector('.chat-input textarea');
const sendChatbtn = document.querySelector('.chat-input span');
const chatbox = document.querySelector('.chatbox');
const chattoggler = document.querySelector('.chatbot-toggler');
const chatbotClosebtn = document.querySelector('.close-btn');

let userMessage;

const createChatLi = (message, className) => {
    const chatLi = document.createElement('li');
    chatLi.classList.add('chat', className);
    let chatContent = className === 'outgoing'
      ? `<p></p>`
      : `<span class="material-symbols-outlined"><i class="fa-solid fa-robot"></i></span><p class="error"></p>`;
    chatLi.innerHTML = chatContent;
    
    chatLi.querySelector("p").textContent = message; // Set the textContent of the <p> element
    return chatLi;
  };
  

const API_URL = 'https://open-ai21.p.rapidapi.com/conversationllama';
const inputInitHeight=chatInput.scrollHeight;

const handleChat = async () => {
  userMessage = chatInput.value.trim();
  if (!userMessage) return;
  chatInput.value="";
  chatInput.style.height=`${inputInitHeight}px`

  chatbox.appendChild(createChatLi(userMessage, 'outgoing'));
  chatbox.scrollTo(0, chatbox.scrollHeight);

  try {
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-RapidAPI-Key': 'b8e1310320msh6072450927d32ffp11f6aajsn12ffc3630552',
        'X-RapidAPI-Host': 'open-ai21.p.rapidapi.com',
      },
      body: JSON.stringify({
        messages: [
          {
            role: 'user',
            content: userMessage,
          },
        ],
        web_access: false,
      }),
    };

    const response = await fetch(API_URL, requestOptions);
    const data = await response.json();

    const incomingChatLi = createChatLi(data.choices[0].message.content, 'incoming');
    chatbox.appendChild(incomingChatLi);
    chatbox.scrollTo(0, chatbox.scrollHeight);
  } catch (error) {
    console.error(error);
    const errorMessageLi = createChatLi('Oops! Something went wrong. Please try again.', 'incoming');
    
    chatbox.appendChild(errorMessageLi);
    chatbox.scrollTo(0, chatbox.scrollHeight);
  }
};

chatInput.addEventListener("input",()=>{
    chatInput.style.height=`${inputInitHeight}px`
    chatInput.style.height=`${chatInput.scrollHeight}px`
})

chatInput.addEventListener("keydown",(e)=>{
    if(e.key==="Enter" && !e.shiftKey && window.innerWidth>400){
        e.preventDefault();
        handleChat();
    }
})

sendChatbtn.addEventListener('click', handleChat);
chatbotClosebtn.addEventListener("click",()=>document.body.classList.remove("show-chatbot"));
chattoggler.addEventListener("click",()=>document.body.classList.toggle("show-chatbot"));

