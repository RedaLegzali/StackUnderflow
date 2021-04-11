const socket = io();
const chatForm = document.getElementById("chat-form");
const messages = document.getElementById("messages");
const users = document.getElementById("users");
const user = document.getElementById("user").textContent;
const room = document.getElementById("room").textContent;

socket.on("connect", () => {
  socket.emit("join", { user, room });
});

socket.on("join", (data) => {
  data.forEach((user) => {
    let node = document.getElementById(user.id);
    if (!node) {
      let html = `<p id=${user.id} class="lead">${user.name}</p>`;
      users.insertAdjacentHTML("beforeend", html);
    }
  });
});
socket.on("leave", (id) => {
  let node = document.getElementById(id);
  node.parentNode.removeChild(node);
});

socket.on("message", (data) => {
  let html;
  if (data.user === user) {
    html = `
      <div class="row mt-2 mx-2">
        <div
          class="col-md-6 col-sm-8 col-12 offset-md-6 offset-sm-4 bg-success pt-3 px-5 rounded"
          style="color: white"
        >
          <small><strong> ${data.user} </strong> <span class="float-right">${data.time}</span> </small>
          <p class="lead"> ${data.message} </p>
        </div>
      </div>
    `;
  } else {
    html = `
      <div class="row mt-2 mx-2">
        <div
          class="col-md-6 col-sm-8 col-12 bg-info pt-3 px-5 rounded"
          style="color: white"
        >
          <small><strong> ${data.user} </strong> <span class="float-right">${data.time}</span> </small>
          <p class="lead"> ${data.message} </p>
        </div>
      </div>
    `;
  }
  messages.insertAdjacentHTML("beforeend", html);
  messages.scrollTop = messages.scrollHeight;
});

socket.on("messages", (data) => {
  data.forEach((message) => {
    let html;
    if (message.user === user) {
      html = `
      <div class="row mt-2 mx-2">
        <div
          class="col-md-6 col-sm-8 col-12 offset-md-6 offset-sm-4 bg-success pt-3 px-5 rounded"
          style="color: white"
        >
          <small><strong> ${message.user} </strong> <span class="float-right">${message.time}</span> </small>
          <p class="lead"> ${message.message} </p>
        </div>
      </div>
    `;
    } else {
      html = `
      <div class="row mt-2 mx-2">
        <div
          class="col-md-6 col-sm-8 col-12 bg-info pt-3 px-5 rounded"
          style="color: white"
        >
          <small><strong> ${message.user} </strong> <span class="float-right">${message.time}</span> </small>
          <p class="lead"> ${message.message} </p>
        </div>
      </div>
    `;
    }
    messages.insertAdjacentHTML("beforeend", html);
    messages.scrollTop = messages.scrollHeight;
  });
});

chatForm.addEventListener("submit", (e) => {
  e.preventDefault();
  let message = e.target.elements.message;
  if (message.value) {
    socket.emit("chat", {
      user,
      room,
      message: message.value
    });
    message.value = "";
  }
});
