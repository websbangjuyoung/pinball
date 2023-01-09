"use strict";

var MESSAGES_MOCK = [
  {
    type: "message",
    from: {
      name: "홍길동",
      icon: "https://simg.powerballgame.co.kr/images/class/M15.gif",
    },
    content:
      "피어나는 피는 그들의 스며들어 보내는 불어 무엇을 그들의 것이다. 고행을 황금시대를 때에, 품고 천하를 하여도 때문이다.",
  },
  {
    type: "message",
    from: {
      name: "존도우입니다",
      icon: "https://simg.powerballgame.co.kr/images/class/M15.gif",
    },
    content: "피어나는 피는 그들의 스며들어 보내는 불어 무엇을 그들의 것이다.",
  },
  {
    type: "sign-in",
    from: {
      name: "김아무개",
      icon: "https://simg.powerballgame.co.kr/images/class/M15.gif",
    },
    content: "김아무개님이 입장하셨습니다.",
  },
  {
    type: "message",
    from: {
      name: "김아무개",
      icon: "https://simg.powerballgame.co.kr/images/class/M15.gif",
    },
    content: "고행을 황금시대를 때에, 품고 천하를 하여도 때문이다.",
  },
  {
    type: "alert",
    content: "전체 공지입니다.",
  },
  {
    type: "sign-in",
    from: {
      name: "김아무개",
    },
    content: "김아무개님이 입장하셨습니다.",
  },
  {
    type: "message",
    from: {
      name: "존도우입니다",
      icon: "https://simg.powerballgame.co.kr/images/class/M15.gif",
    },
    content: "피어나는 피는 그들의 스며들어 보내는 불어 무엇을 그들의 것이다.",
  },
  {
    type: "message",
    from: {
      name: "존도우입니다",
      icon: "https://simg.powerballgame.co.kr/images/class/M15.gif",
    },
    content: "피어나는 피는 그들의 스며들어 보내는 불어 무엇을 그들의 것이다.",
  },
  {
    type: "message",
    from: {
      name: "홍길동",
      icon: "https://simg.powerballgame.co.kr/images/class/M15.gif",
    },
    content: "피어나는 피는 그들의 스며들어 보내는 불어 무엇을 그들의 것이다.",
  },
  {
    type: "message",
    from: {
      name: "김아우개",
      icon: "https://simg.powerballgame.co.kr/images/class/M15.gif",
    },
    content: "피어나는 피는 그들의 스며들어 보내는 불어 무엇을 그들의 것이다.",
  },
  {
    type: "alert",
    content: "긴급 알림입니다.",
  },
];

function delay(miliseconds) {
  const _miliseconds = miliseconds || "400";

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, _miliseconds);
  });
}

function getClonedTemplateString(template) {
  if (!template) {
    return "";
  }

  const cloned = template.content.cloneNode(true);

  const wrapper = document.createElement("div");
  wrapper.append(cloned);

  return wrapper.innerHTML;
}

function getReplacedTemplateStringWithObject(templateString, object) {
  var _templateString = templateString || "";

  if (!_templateString) {
    return _templateString;
  }

  var replaceKeys = Object.keys(object)
    .map((key) => "{" + key + "}")
    .join("|");

  const regexp = new RegExp(replaceKeys, "gi");

  return _templateString.replace(regexp, function (match) {
    const key = match.replace(/[{}]/gi, "");
    return object[key];
  });
}

function createTemplateString(template, data) {
  var clonedTemplateString = getClonedTemplateString(template);
  var replacedTemplateString = getReplacedTemplateStringWithObject(
    clonedTemplateString,
    data
  );

  return replacedTemplateString;
}
