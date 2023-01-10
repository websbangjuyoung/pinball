'use strict';

var MESSAGES_MOCK = [
  {
    type: 'message',
    from: {
      name: '홍길동',
      icon: 'https://simg.powerballgame.co.kr/images/class/M15.gif',
    },
    content:
      '피어나는 피는 그들의 스며들어 보내는 불어 무엇을 그들의 것이다. 고행을 황금시대를 때에, 품고 천하를 하여도 때문이다.',
  },
  {
    type: 'message',
    from: {
      name: '존도우입니다',
      icon: 'https://simg.powerballgame.co.kr/images/class/M15.gif',
    },
    content: '피어나는 피는 그들의 스며들어 보내는 불어 무엇을 그들의 것이다.',
  },
  {
    type: 'sign-in',
    from: {
      name: '김아무개',
      icon: 'https://simg.powerballgame.co.kr/images/class/M15.gif',
    },
    content: '김아무개님이 입장하셨습니다.',
  },
  {
    type: 'message',
    from: {
      name: '김아무개',
      icon: 'https://simg.powerballgame.co.kr/images/class/M15.gif',
    },
    content: '고행을 황금시대를 때에, 품고 천하를 하여도 때문이다.',
  },
  {
    type: 'alert',
    content: '전체 공지입니다.',
  },
  {
    type: 'sign-in',
    from: {
      name: '김아무개',
    },
    content: '김아무개님이 입장하셨습니다.',
  },
  {
    type: 'message',
    from: {
      name: '존도우입니다',
      icon: 'https://simg.powerballgame.co.kr/images/class/M15.gif',
    },
    content: '피어나는 피는 그들의 스며들어 보내는 불어 무엇을 그들의 것이다.',
  },
  {
    type: 'message',
    from: {
      name: '존도우입니다',
      icon: 'https://simg.powerballgame.co.kr/images/class/M15.gif',
    },
    content: '피어나는 피는 그들의 스며들어 보내는 불어 무엇을 그들의 것이다.',
  },
  {
    type: 'message',
    from: {
      name: '홍길동',
      icon: 'https://simg.powerballgame.co.kr/images/class/M15.gif',
    },
    content: '피어나는 피는 그들의 스며들어 보내는 불어 무엇을 그들의 것이다.',
  },
  {
    type: 'message',
    from: {
      name: '김아우개',
      icon: 'https://simg.powerballgame.co.kr/images/class/M15.gif',
    },
    content: '피어나는 피는 그들의 스며들어 보내는 불어 무엇을 그들의 것이다.',
  },
  {
    type: 'alert',
    content: '긴급 알림입니다.',
  },
];

function Chat(chatIO, initialUser, _options) {
  if (!chatIO) {
    throw new Error('No socket.io');
  }

  var rooms = ['general'];
  var defaultRoom = rooms[0];
  var currentRoom = null;

  var currentUser = {};

  var _initialOptions = {
    messageTemplateIds: {
      message: 'chatMessageTemplate',
      default: 'chatDefaultMessageTemplate',
    },

    messagesContainerId: 'chatMessagesContainer',
    messagesId: 'chatMessages',
    messageInputId: 'chatMessageInput',
    formId: 'chatForm',
  };

  var options = Object.assign(_initialOptions, _options);

  var messageTemplateEls = null;
  var messagesContainerEl = null;
  var messagesEl = null;
  var messageInputEl = null;
  var formEl = null;

  _init();

  function _init() {
    initEls();
    initUser(initialUser);
    initAuth();
  }

  function initEls() {
    messageTemplateEls = Object.keys(options.messageTemplateIds).reduce(
      function (acc, key) {
        return Object.assign(acc, {
          [key]: document.getElementById(options.messageTemplateIds[key]),
        });
      },
      {}
    );

    messagesContainerEl = document.getElementById(options.messagesContainerId);
    messagesEl = document.getElementById(options.messagesId);
    messageInputEl = document.getElementById(options.messageInputId);

    formEl = document.getElementById(options.formId);
  }

  function initUser(user) {
    currentUser = Object.assign({}, user);

    if (isAuthenticated()) {
      chatIO.emit('new-user', currentUser);
    }
  }

  function clearUser() {
    if (isAuthenticated()) {
      chatIO.emit('remove-user', currentUser);
    }

    currentUser = {
      name: '',
      icon: '',
    };
  }

  function initAuth() {
    if (isAuthenticated()) {
      setFormAvailable();
    } else {
      setFormRequiredAuth();
    }
  }

  function setFormRequiredAuth() {
    formEl.setAttribute('disabled', true);

    for (var element of formEl.elements) {
      element.disabled = true;
    }

    var placeholder =
      messageInputEl.dataset.unauthPlaceholder || '로그인을 해 주세요.';
    messageInputEl.setAttribute('placeholder', placeholder);
  }

  function setFormAvailable() {
    formEl.setAttribute('disabled', false);

    for (var element of formEl.elements) {
      element.disabled = false;
    }

    messageInputEl.setAttribute('placeholder', '');
  }

  function getTemplateByType(type) {
    return messageTemplateEls[type] || messageTemplateEls['default'];
  }

  function getMessage() {
    var message = messageInputEl.value;

    if (!message) {
      throw new Error('메세지를 입력해 주세요.111');
    }

    return message;
  }

  function clearMessage() {
    messageInputEl.focus();
    messageInputEl.value = '';
  }

  function sendMessage(message) {
    const now = new Date();

    chatIO.emit(
      'message-room',
      currentRoom,
      message,
      currentUser,
      now.getTime(),
      now
    );
  }

  function renderMessages(messages) {
    return messages.map(renderMessage);
  }

  function renderMessage(message) {
    const type = message.type;

    var template = getTemplateByType(type);

    var from = message.from || {};

    return createTemplateString(template, {
      type: type,
      content: message.content,
      name: from.name || '',
      icon: from.icon || '',
    });
  }

  function appendRenderedMessages(messages) {
    messagesEl.insertAdjacentHTML('beforeend', messages);
    messagesContainerEl.scrollTop = messagesContainerEl.scrollHeight;
  }

  function isAuthenticated() {
    return typeof currentUser.name !== 'undefined' && currentUser.name !== '';
  }

  function getClonedTemplateString(template) {
    if (!template) {
      return '';
    }

    const cloned = template.content.cloneNode(true);

    const wrapper = document.createElement('div');
    wrapper.append(cloned);

    return wrapper.innerHTML;
  }

  function getReplacedTemplateStringWithObject(templateString, object) {
    var _templateString = templateString || '';

    if (!_templateString) {
      return _templateString;
    }

    var replaceKeys = Object.keys(object)
      .map((key) => '{' + key + '}')
      .join('|');

    const regexp = new RegExp(replaceKeys, 'gi');

    return _templateString.replace(regexp, function (match) {
      const key = match.replace(/[{}]/gi, '');
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

  formEl.addEventListener('submit', function (e) {
    e.preventDefault();

    try {
      sendMessage(getMessage());
    } catch (error) {
      alert(error.message);
    }

    clearMessage();
  });

  chatIO.off('room-messages').on('room-messages', function (messages) {
    var _messages = messages.length < 1 ? MESSAGES_MOCK : messages;

    var renderedMessages = renderMessages(_messages).join('');
    appendRenderedMessages(renderedMessages);
  });

  /**
   * public method
   */

  this.setUser = function (user) {
    clearUser();

    initUser(user);
    initAuth();
  };

  this.removeUser = function () {
    clearUser();
    initAuth();
  };

  this.joinRoom = function (_room) {
    var room = _room || defaultRoom;

    if (!rooms.filter((chatRoom) => chatRoom === room).length) {
      throw new Error('No ' + room + ' room');
    }

    currentRoom = room;
    chatIO.emit('join-room', room);
  };
}
