'use strict';

const myForm = document.forms.commentForm;
const productComment = myForm['product-comment'];
const productRate = myForm['product-rate'];
const productRateWrapper = document.querySelector('#productRateWrapper');
const commentsList = document.querySelector('#commentsList');

const SERVER_REQUEST_TIMEOUT = 5000;
const COMMENTS_API = '/comment';

const formData = {
  productComment: '',
  productRate: 1
};

productComment.oninput = onProductCommentInput;
productRateWrapper.onclick = onProductRateInput;
myForm.onsubmit = onMyFormSubmit;

const timerId = setInterval(() => {
  sendCommentsRequest(COMMENTS_API);
}, SERVER_REQUEST_TIMEOUT);

sendCommentsRequest(COMMENTS_API);

function sendCommentsRequest(url) {
  return sendRequest(url)
    .then(handleSuccessData)
    .catch(err => {
      console.error('err is ', err);
      clearInterval(timerId);
    });
}

function handleSuccessData(response) {
  if (response === '') return;

  let data = JSON.parse(response);
  removeAllItems(commentsList);
  data.forEach(({productComment, productRate, productDate}) => {
    let listItem = renderComment({productComment, productRate, productDate});
    commentsList.appendChild(listItem);
  });
}

function removeAllItems(parent) {
  parent.innerHTML = '';
}

function elt(tag, cls, text) {
  const el = document.createElement(tag);
  el.className = cls;
  el.innerHTML = text;
  return el;
}

function renderComment({productComment, productRate, productDate}) {
  const li = document.createElement('li');
  li.className = 'comments-item';
  li.appendChild(elt('span', 'comments-title', `<b>@username</b> ${new Date(productDate).toLocaleString()}`));
  li.appendChild(elt('span', 'comments-rate', `rate: ${productRate}`));
  li.appendChild(elt('div', 'comments-text', productComment));
  return li;
}

function updateFormData(prop, val) {
  formData[prop] = val;
}

function prepareFormData(data) {
  return Object.assign(data, {productDate: new Date()});
}

function sendRequest(url, data, method='GET') {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open(method, url, true);
    xhr.onload = () => resolve(xhr.response);
    xhr.onerror = () => reject(xhr);

    if (method == 'POST') {
      xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
      xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
      xhr.send(JSON.stringify(data));
    } else {
      xhr.send();
    }
  });
}

function onProductCommentInput(e) {
  updateFormData('productComment', e.target.value.trim());
}

function onProductRateInput(e) {
  const radioInput = e.target.closest('input[type="radio"]');

  if (!radioInput) return;

  updateFormData('productRate', radioInput.value);
}

function onMyFormSubmit(e) {
  e.preventDefault();

  const {
    productComment,
    productRate
  } = formData;

  const comment = renderComment({productComment, productRate, productDate: new Date()});
  commentsList.prepend(comment);

  sendRequest(COMMENTS_API, prepareFormData(formData), 'POST')
    .then(response => console.log('response is ', response))
    .catch(console.error);
}