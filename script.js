const messageInput = document.querySelector('.message-input');
const sendButton = document.querySelector('.send-button');
const clearButton = document.querySelector('.clear-button');
const chatContainer = document.querySelector('.chat-container');

const STORAGE_KEY = 'chatMessages';

// 페이지 로드 시 저장된 메시지 불러오기
window.addEventListener('DOMContentLoaded', function() {
    loadMessages();
});

// 엔터 키 눌렀을 때
messageInput.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        sendMessage();
    }
});

// 전송 버튼 클릭했을 때
sendButton.addEventListener('click', sendMessage);

// 클리어 버튼 클릭했을 때
clearButton.addEventListener('click', clearChat);

function clearChat() {
    if (confirm('정말로 삭제? 당신은 모든 저장을 잃음')) {
        chatContainer.innerHTML = '<button class="clear-button">삭제</button>';
        localStorage.removeItem(STORAGE_KEY);
        // 새로운 버튼에 이벤트 리스너 추가
        document.querySelector('.clear-button').addEventListener('click', clearChat);
    }
}

// 메시지 전송 함수
function sendMessage() {
    const message = messageInput.value.trim();
    if (message !== '') {
        messageInput.value = '';

        // 사용자 메시지를 오른쪽에 추가
        const messageElement = document.createElement('div');
        messageElement.className = 'message-user';
        messageElement.textContent = message;
        chatContainer.appendChild(messageElement);

        // 봇 메시지 생성
        createBotMessage(message);
        
        // 유저 메시지만 저장 (봇 메시지는 나중에 재생성)
        saveMessage(message);
        
        // 스크롤을 아래로
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }
}

// 봇 메시지 생성 함수
function createBotMessage(message, loading=false) {
    decoded = base64Decode(message);
    if (decoded != false) {
        // 링크를 왼쪽에 추가
        if (decoded.startsWith('http://') || decoded.startsWith('https://')) {
            const botElement = document.createElement('div');
            botElement.className = 'message-bot';
            botElement.innerHTML = `<a href="${decoded}" target="_blank">${decoded}</a>`;
            chatContainer.appendChild(botElement);
            
            
            if(!loading) {
                window.open(decoded, '_blank');
            }
        }
        else {    
            const botElement = document.createElement('div');
            botElement.className = 'message-bot';
            botElement.textContent = decoded;
            chatContainer.appendChild(botElement);
        }
    }
    if (/(?:rj|RJ|거)(\d+)/i.test(message)) {
        const rjMatch = message.match(/(?:rj|RJ|거)(\d+)/i);
        if (rjMatch) {
            const rjNumber = rjMatch[1];

            const botElement = document.createElement('div');
            botElement.className = 'message-bot';
            botElement.innerHTML = `<a href="https://www.dlsite.com/maniax/work/=/product_id/RJ${rjNumber}.html" target="_blank">|___DL___|</a>
            <a href="https://asmr.one/works?keyword=rj${rjNumber}" target="_blank">|___ASMR___|</a>
            <a href="https://kone.gg/s/all?q=rj${rjNumber}" target="_blank">|___Kone___|</a>`;
            chatContainer.appendChild(botElement);

            const numberWithoutLastThree = rjNumber.slice(0, -3);
            const incrementedNumber = (parseInt(numberWithoutLastThree, 10) + 1).toString().padStart(numberWithoutLastThree.length, '0');
            const rjPrefix = incrementedNumber + '000';
            const thumbnailUrl = `https://img.dlsite.jp/modpub/images2/work/doujin/RJ${rjPrefix}/RJ${rjNumber}_img_main.webp`;

            // 이미지 썸네일 표시
            const img = document.createElement('img');
            img.src = thumbnailUrl;
            img.alt = '없는듯?들어가보셈?있을수도?';
            img.className = 'thumbnail-image';
            chatContainer.appendChild(img);

        }
    }
    if (/^\d{7}$/.test(message)) {
        const botElement = document.createElement('div');
        botElement.className = 'message-bot';
        botElement.innerHTML = `<a href="https://hitomi.la/galleries/${message}.html" target="_blank">|___hitomi.la___|</a>
        | <a href="https://litomi.in/manga/${message}" target="_blank">|___litomi.in___|</a>`;
        chatContainer.appendChild(botElement);

        const thumbnailUrl = `https://soujpa.in/start/${message}/${message}_0.avif`;
        const img = document.createElement('img');
        img.src = thumbnailUrl;
        img.alt = '없는듯?들어가보셈?있을수도?';
        img.className = 'first-page';
        chatContainer.appendChild(img);
    }
}

function base64Decode(str) {
    try {
        // 길이가 4의 배수가 아니면 = 추가
        while (str.length % 4 !== 0) {
            str += '=';
        }
        // base64 정규식 확인
        if (!/^[A-Za-z0-9+/]*={0,2}$/.test(str)) return false;
        // 디코드 시도
        decoded = atob(str);
        //한글 영어, 숫자, 특수문자 외 문자 필터링
        if (!/^[\u0000-\u007F\uAC00-\uD7A3\s!"#$%&'()*+,-./:;<=>?@[\\\]^_`{|}~]*$/.test(decoded)) return false;
        return decoded;
    } catch (e) {
        return false;
    }
}

// 유저 메시지만 저장
function saveMessage(userMessage) {
    const messages = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    messages.push(userMessage);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
}

// localStorage에서 메시지 불러오고 봇 메시지 재생성
function loadMessages() {
    const messages = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    messages.forEach(msg => {
        // 사용자 메시지
        const messageElement = document.createElement('div');
        messageElement.className = 'message-user';
        messageElement.textContent = msg;
        chatContainer.appendChild(messageElement);
        
        // 봇 메시지 생성 (새로 만드는 것)
        createBotMessage(msg, loading=true);
    });
}