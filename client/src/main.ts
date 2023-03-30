import bot from '../assets/bot.svg'
import user from '../assets/user.svg'


const form: any = document.querySelector('form');
const chatContainer: any = document.querySelector('#chat_container');

let loadInterval: number | undefined;

function loader(element: { textContent: string; }) {
  element.textContent = "Hum laisse moi reflechir";
  loadInterval = setInterval(() => {
    element.textContent += '.';

    if (element.textContent === "Hum laisse moi reflechir....") {
      element.textContent = "Hum laisse moi reflechir"
    }
  }, 300)
}

function typeText(element: any, text: any) {
  let index = 0;

  let interval = setInterval(() => {
    if (index < text.length) {
      element.innerHTML += text.charAt(index);
      index++;
    } else {
      clearInterval(interval);
    }
  }, 20)
}

function generateUniqueId() {
  const timestamp = Date.now();
  const randomNumber = Math.random();
  const hexadecimalString = randomNumber.toString(16);

  return `id-${timestamp}-${hexadecimalString}`
}


function chatStripe(isAi: boolean, value?: string, uniqueId?: string) {
  return `
  <div class = 'wrapper ${isAi && "ai"}'>
  <div class = 'chat'>
  <div class = 'profile'>
    <img src ="${isAi ? bot : user}" alt="${isAi ? "bot" : "user"}" />
  </div>
  <div class = "message" id= ${uniqueId}>
  ${value}
  
  </div>
  </div>
  </div>
  
`;
}


const handleSubmit = async (e: any) => {
  e.preventDefault();
  const data: any = new FormData(form);


  chatContainer.innerHTML += chatStripe(false, data.get('prompt'));

  form?.reset();

  const uniqueId = generateUniqueId();
  chatContainer.innerHTML += chatStripe(true, " ", uniqueId);

  chatContainer.scrollTop = chatContainer.scrollHeight;

  const messageDiv: any = document.getElementById(uniqueId);

  loader(messageDiv);



  const response  = await fetch('http://localhost:5000', {
    method:'POST',
    headers:{
      'Content-Type': 'application/json'
    },
    body:JSON.stringify({
      prompt:data.get('prompt'),
    })
  })

  clearInterval(loadInterval);
  messageDiv.innerHTML ='';
  if(response.ok){
    const data = await response.json();
    console.log('data');
    console.log(data);
    const parsedData = data.bot.trim();
  
    typeText(messageDiv, parsedData);
  }else{
    const err = await response.text();
    messageDiv.innerHTML = "err.message;"

    alert(err)
  }

}


form.addEventListener('submit', handleSubmit);
form.addEventListener('keyup', (e: { keyCode: number; })=>{
  if(e.keyCode ===13){
handleSubmit(e);
  }
});