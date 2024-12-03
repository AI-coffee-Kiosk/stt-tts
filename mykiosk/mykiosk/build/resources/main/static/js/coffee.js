var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList;
var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent;
var diagnosticPara = document.querySelector('.output');
const tts = new SpeechSynthesisUtterance();

//tts
function populateVoiceList() {
	if (typeof speechSynthesis === 'undefined') {
		return;
	}

	const voices = speechSynthesis.getVoices();
	const voiceList = voices
		.filter((voice) => voice.lang.includes('ko'))
		.map((voice) => `${voice.name} (${voice.lang})`);
	console.log(voices);
}

populateVoiceList();

if (typeof speechSynthesis !== 'undefined' && speechSynthesis.onvoiceschanged !== undefined) {
	speechSynthesis.onvoiceschanged = populateVoiceList;
}

function coffeeGetPrice(coffee, options = {}, size) {
	var price = 0;
	switch (coffee.trim()) {
		case "에스프레소":
			price = 3800;
			break;
		case "아메리카노":
			price = 4300;
			break;
		case "카푸치노":
		case "카페라떼":
			price = 4500;
			break;
		case "바닐라라떼":
		case "카라멜마끼야또":
		case "카페모카":
			price = 4800;
			break;
		case "아포카토":
		case "복숭아아이스티":
		case "허브티":
			price = 5000;
			break;
		case "토마토주스":
		case "키위주스":
		case "레몬에이드":
			price = 5500;
			break;
		case "망고스무디":
		case "딸기스무디":
		case "쿠키앤크림":
		case "말차라떼":
		case "초콜릿라떼":
			price = 5800;
			break;
		default:
			break;
	}
	//휘핑크림 or 샷추가
	if (options && typeof options === "object"){
		Object.entries(options).forEach(([key, num]) => {
			price += 500*num;
		});
	}

	if(size === "라지"){
		price += 1000;
	}
	else if(size === "엑스라지"){
		price += 2000;
	}

	return price;
}

function getImage(menuName){
	switch(menuName){
		case "에스프레소":
			return '/img/Espresso.png'
		case "아메리카노":
			return '/img/Americano.png'
		case "카푸치노":
			return '/img/Cappuccino.png'
		case "카페라떼":
			return '/img/CaffèLatte.png'
		case "바닐라라떼":
			return '/img/VanillaLatte.png'
		case "카라멜마끼야또":
			return '/img/CaramelMacchiato.png'
		case "카페모카":
			return '/img/CaffeMocha.png'
		case "아포카토":
			return '/img/Affokato.jpg'
		case "복숭아아이스티":
			return '/img/PeachIcedTea.png'
		case "허브티":
			return '/img/HerbalTea.png'
		case "토마토주스":
			return '/img/TomatoJuice.png'
		case "키위주스":
			return '/img/KiwiJuice.png'
		case "레몬에이드":
			return '/img/Lemonade.png'
		case "망고스무디":
			return '/img/MangoSmoothie.png'
		case "딸기스무디":
			return '/img/StrawberrySmoothie.png'
		case "쿠키앤크림":
			return '/img/CookiesandCream.png'
		case "말차라떼":
			return '/img/MatchaLatte.png'
		case "초콜릿라떼":
			return '/img/ChocolateLatte.png'
		default:
			return '/img/menu_1.png'
	}
}

function getSize(size){
	if(size === "라지") return 'L';
	else if(size === "엑스라지") return 'XL';
	else return 'M'
}

$(document).ready(function () {
	let wait = false
	//stt
	var recognition = new SpeechRecognition();
	var speechRecognitionList = new SpeechGrammarList();
	recognition.grammars = speechRecognitionList;
	recognition.lang = 'ko-KR';
	recognition.interimResults = false;
	recognition.continious = false;
	recognition.maxAlternatives = 1;
	recognition.start();

	//음성 결과 분석
	recognition.onresult = function (event) {
		var speechResult = event.results[0][0].transcript.toLowerCase();
		console.log('Confidence: ' + event.results[0][0].confidence);
		console.log('Speech Result: ' + speechResult);

		diagnosticPara = $('.textBox');
		userText = $('.menu_order');

		if (speechResult == null || speechResult === "") {
			return;
		}

		wait = true;

		//UI에 표시
		var content =
			`<div class="talk">
                <div class="people_talk">
                    <p>${speechResult}</p>
                    <div class="people_de"></div>
                </div>
            </div>`;
		userText.append(content);

		var offset = userText.offset();
		userText.scrollTop(userText[0].scrollHeight);

		//서버에 전달
		var aoo = ajax_object_options('POST', '/api/chatBot/chat', { message: speechResult });
		ajax(aoo, function (resp) {

			if(resp.action && resp.action.trim().toLowerCase() === "주문 완료"){
				console.log("complete action detected. Page will change in 4.5 seconds.");
				setTimeout(function () {
					window.location.href = '/pay'; // 이동할 페이지 경로
				}, 4500);
			}else if(resp.action && resp.action.trim().toLowerCase() === "주문 종료"){
				console.log("Cancel action detected. Page will reload in 4.5 seconds.");
				setTimeout(function () {
					window.location.href = '/';
				}, 4500);
			}
			//text 처리
			var text =
				`<div class="talk">
                    <div class="ask_talk">
                        <p>${resp.text}</p>
                        <div class="asks_de"></div>
                    </div>
                </div>`;
			userText.append(text);
			offset = userText.offset();
			userText.scrollTop(userText[0].scrollHeight);

			//json 처리
			const coffee = resp.current_orders;
			let price = 0;
			let quantity = 0;
			const menuList = $('#menuList');
			menuList.empty();
			if(Object.keys(coffee).length !== 0) {
				coffee.drinks.forEach((drink) => {
					console.log(drink.name, drink.size, drink.add_ons);
					const imagePath = getImage(drink.name)
					const addOns = drink.add_ons;
					const size = getSize(drink.size);
					const optionsHtml = `
						<div class="option_box">
							<div>
								<span class="option">사이즈: ${size}</span>
							</div>
						</div>
					`
						+ Object.entries(addOns).map(([key, num]) => `
					<div class="option_box">
						<div>
							<span class="option">${key} : ${num}</span>
						</div>
						<div>
							+ <span class="option_money">${(num * 500).toLocaleString('ko-KR')}</span> <!-- 샘플 가격 -->
						</div>
					</div>
				`).join('');

					// 메뉴 HTML
					const menuHtml = `
				<li>
					<div class="menu_img">
						<div class="${drink.temperature === '핫' ? 'temp_hot' : 'temp_ice'}">
							<span class="temp">${drink.temperature === '핫' ? 'HOT' : 'ICE'}</span>
						</div>
						<img src="${getImage(drink.name)}" alt="${drink.name}">
					</div>
					<div class="menu_txt">
						<!-- 메뉴 & 가격 영역 -->
						<div>
							<div>
								<span class="menu">${drink.name}</span>
							</div>
							<div>
								₩<span class="money"> ${coffeeGetPrice(drink.name, addOns, drink.size).toLocaleString()}</span>
							</div>
						</div>
	
						<!-- 옵션 영역 -->
						<div>${optionsHtml}</div>
	
						<!-- 버튼 영역 -->
						<div>
							<div class="button_del">
								<img src="/img/icon_delete.png" alt="삭제 버튼">
							</div>
							<div class="button_num">
								<button>
									<span>-</span>
								</button>
								<div>
									<span>${drink.quantity}</span>
								</div>
								<button>
									<span>+</span>
								</button>
							</div>
						</div>
					</div>
				</li>`;
					//가격 및 수량
					price += coffeeGetPrice(drink.name, drink.add_ons, drink.size) * drink.quantity;
					quantity += drink.quantity;
					menuList.append(menuHtml);
				})
			}
			document.getElementById('totalPrice').textContent = price.toLocaleString('ko-KR');
			document.getElementById('totalQuantity').textContent = quantity;

			tts.lang = 'ko-KR';
			tts.pitch = 1;
			tts.rate = 1;
			tts.text = resp.text;
			tts.volume = 1;
			window.speechSynthesis.speak(tts);
			recognition.stop();

		}, function (resp) {
			alert('에러 발생');
			console.log(resp);
		});
	};

	recognition.onaudiostart = function () {
		console.log('SpeechRecognition.onaudiostart');
	};

	recognition.onaudioend = function () {
		console.log('SpeechRecognition.onaudioend');
	};

	recognition.onend = function () {
		console.log('SpeechRecognition.onend');
		if(!wait){
			recognition.start();
		}


	};

	recognition.onnomatch = function () {
		console.log('SpeechRecognition.onnomatch');
	};

	recognition.onsoundstart = function () {
		console.log('SpeechRecognition.onsoundstart');
	};

	recognition.onsoundend = function () {
		console.log('SpeechRecognition.onsoundend');
	};

	recognition.onspeechstart = function () {
		console.log('SpeechRecognition.onspeechstart');
	};

	recognition.onstart = function () {
		console.log('SpeechRecognition.onstart');
	};
	tts.onend = function () {
		console.log("TTS finished. Restarting SpeechRecognition...");
		wait = false
		recognition.start();
	};
});
