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

/*
function searchCoffee(text, coffee, data) {
	if (text.includes(coffee)) {
		var coffeeCount = 0;
		var textSplit = text.split(coffee);
		data.coffeeKind++;
		var coffeePrice = coffeeGetPrice(coffee);

		if (textSplit.length > 1) {
			var zanSplit = textSplit[1].split("잔")[0];
			switch (zanSplit.trim()) {
				case "한":
					coffeeCount += 1;
					break;
				case "두":
					coffeeCount += 2;
					break;
				case "세":
					coffeeCount += 3;
					break;
				case "네":
					coffeeCount += 4;
					break;
				case "다섯":
					coffeeCount += 5;
					break;
				case "여섯":
					coffeeCount += 6;
					break;
				case "일곱":
					coffeeCount += 7;
					break;
				case "여덟":
					coffeeCount += 8;
					break;
				case "아홉":
					coffeeCount += 9;
					break;
				case "열":
					coffeeCount += 10;
					break;
				default:
					break;
			}
			data.coffeeCount += coffeeCount;
			data.price += coffeeCount * coffeePrice;
			data.content +=
				`<div class="orderList">
                    <div class="number">${data.coffeeKind}</div>
                    <div class="menu">${coffee}</div>
                    <div class="menu">${coffeeCount}</div>
                    <div class="menu">${(coffeeCount * coffeePrice).toLocaleString('ko-KR')} <span>원</span></div>
                </div>`;
		}
	}
	return data;
}
*/
function coffeeGetPrice(coffee, shot, size) {
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
	if(shot !== 'None'){
		shotnum = parseInt(shot[shot.length - 2], 10);
		price += 500*shotnum;
	}
	if(size === "라지"){
		price += 1000;
	}

	return price;
}

function getImage(menuName){
	switch(menuName){
		case "에스프레소":
			return '/img/espresso.png'
		case "아메리카노":
			return '/img/menu_2.png'
		case "카푸치노":
			return '/img/cappuccino.png'
		case "카페라떼":
			return '/img/menu_1.png'
		case "바닐라라떼":
			return '/img/vanillaLatte.png'
		case "카라멜마끼야또":
			return '/img/carameMacchiato.png'
		case "카페모카":
			return '/img/cafeMocha.png'
		case "아포카토":
			return '/img/affokato.png'
		case "복숭아아이스티":
			return '/img/icedTea.png'
		case "허브티":
			return '/img/herbalTea.png'
		case "토마토주스":
			return '/img/tomato.png'
		case "키위주스":
			return '/img/kiwi.png'
		case "레몬에이드":
			return '/img/lemon.png'
		case "망고스무디":
			return '/img/mango.png'
		case "딸기스무디":
			return '/img/strawberry.png'
		case "쿠키앤크림":
			return '/img/cookie.png'
		case "말차라떼":
			return '/img/matcha.png'
		case "초콜릿라떼":
			return '/img/chocolate.png'
		default:
			return '/img/menu_1.png'
	}
}


$(document).ready(function () {
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
			var text =
				`<div class="talk">
                    <div class="ask_talk">
                        <p>${resp.text}</p>
                        <div class="asks_de"></div>
                    </div>
                </div>`;
			userText.append(text);
			console.log("Server Response:", resp);
			offset = userText.offset();
			userText.scrollTop(userText[0].scrollHeight);

			//json 처리
			const coffee = resp.current_orders;
			let price = 0;
			let quantity = 0;
			const menuList = $('#menuList');
			if (!menuList.length) {
				console.error("#menuList element not found.");
			}
			coffee.drinks.forEach((drink) => {
				const imagePath = getImage(drink.name)
				const addOns = drink.add_ons !== "None" ? drink.add_ons.split(",") : [];

				const optionsHtml = addOns.map(option => `
					<div class="option_box">
						<div>
							<span class="option">${option}</span>
						</div>
						<div>
							+ <span class="option_money">500</span> <!-- 샘플 가격 -->
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
								₩<span class="money"> ${coffeeGetPrice(drink.name, drink.add_ons, drink.size).toLocaleString()}</span>
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

				menuList.html(menuHtml);
				//가격 및 수량
				price += coffeeGetPrice(drink.name, drink.add_ons, drink.size) * drink.quantity;
				quantity += drink.quantity;
			})

			document.getElementById('totalPrice').textContent = price.toLocaleString('ko-KR');
			document.getElementById('totalQuantity').textContent = quantity;



			// if (text.includes("주문하신") || text.includes("수정")) {
			// 	$('.orderListBox').empty();
			// 	var data = { content: '', coffeeKind: 0, coffeeCount: 0, price: 0 };
			//
			// 	var menu = [
			// 		"에스프레소", "아메리카노", "카푸치노", "카페라떼", "바닐라라떼", "카라멜마끼야또",
			// 		"카페모카", "아포카토", "토마토주스", "키위주스", "망고스무디", "딸기스무디",
			// 		"쿠키앤크림", "레몬에이드", "복숭아아이스티", "허브티", "말차라떼", "초콜릿라떼"
			// 	];
			//
			// 	for (var i = 0; i < menu.length; i++) {
			// 		data = searchCoffee(text, menu[i], data);
			// 	}
			//
			// 	if (text.includes('결제')) {
			// 		setTimeout(() => {
			// 			$('.contents').css('display', 'none');
			// 			$('.payment').css('display', 'flex');
			// 			setTimeout(() => {
			// 				$('.payment').css('display', 'none');
			// 				$('.paymentEnd').css('display', 'flex');
			// 				setTimeout(() => {
			// 					$('.paymentEnd').css('display', 'none');
			// 					$('.contents').css('display', 'flex');
			// 					$('.orderListBox').empty();
			// 					$('#coffeeCount').text(0);
			// 					$('#coffeePrice').text(0);
			// 					userText.html('');
			// 				}, 15000);
			//
			// 				window.speechSynthesis.cancel();
			// 				diagnosticPara.html('안녕하세요. 서비스 지원을 위한 제니입니다.<br>원하시는 서비스를 말씀해 주세요.');
			// 				tts.lang = 'ko-KR';
			// 				tts.pitch = 1;
			// 				tts.rate = 1;
			// 				tts.text = '주문이 성공적으로 진행되었습니다. 카드를 회수해 주세요. 저희 매장을 이용해 주셔서 감사합니다. 주문번호를 확인 하신 후 안내된 번호에 맞춰 카운터로 오시면 됩니다.';
			// 				tts.volume = 1;
			// 				window.speechSynthesis.speak(tts);
			// 			}, 7000);
			// 		}, 1000);
			// 	}
			//
			// 	if (text.includes('취소')) {
			// 		$('.orderListBox').empty();
			// 		$('#coffeeCount').text(0);
			// 		$('#coffeePrice').text(0);
			// 		userText.html('');
			// 	}
			//
			// 	$('.orderListBox').html(data.content);
			// 	$('#coffeeCount').text(data.coffeeCount);
			// 	$('#coffeePrice').text(data.price.toLocaleString('ko-KR'));
			// }

			tts.lang = 'ko-KR';
			tts.pitch = 1;
			tts.rate = 1;
			tts.text = resp.text;
			tts.volume = 1;
			window.speechSynthesis.speak(tts);
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
		recognition.start();
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
});
