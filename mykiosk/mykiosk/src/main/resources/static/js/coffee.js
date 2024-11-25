var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList;
var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent;
var diagnosticPara = document.querySelector('.output');
const tts = new SpeechSynthesisUtterance();

function populateVoiceList() {
	if (typeof speechSynthesis === 'undefined') {
		return;
	}

	const voices = speechSynthesis.getVoices();
	const voiceList = voices
		.filter((voice) => voice.lang.includes('en'))
		.map((voice) => `${voice.name} (${voice.lang})`);
	console.log(voices);
}

populateVoiceList();

if (typeof speechSynthesis !== 'undefined' && speechSynthesis.onvoiceschanged !== undefined) {
	speechSynthesis.onvoiceschanged = populateVoiceList;
}

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

function coffeeGetPrice(coffee) {
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
	return price;
}

$(document).ready(function () {
	//음성인식
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
			// offset = userText.offset();
			// userText.scrollTop(userText[0].scrollHeight);
			//
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
