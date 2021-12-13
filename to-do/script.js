let allTasks = [];
let valueName = "";
let valueInput = "";
let inputText = null;
let inputName = null;

window.onload = async () => {
  inputText = document.getElementById("add-task");
  inputText.addEventListener("change", updateValue);
  inputName = document.getElementById("add-name");
  inputName.addEventListener("change", updateName);
  const resp = await fetch("http://localhost:8000/allTasks", {
    method: "GET",
  });

  const result = await resp.json();
  allTasks = result.data;

  for (let i in allTasks) {
    allTasks[i].editor = false;
  }
  render();
};

const delAllTasks = () => {
  allTasks = [];
  inputText.value = "";
  inputName.value = "";
  render();
};

const onClickButton = async () => {
  if (valueName) {
    const resp = await fetch("http://localhost:8000/createTask", {
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        name: valueName,
        text: valueInput,
        isCheck: false,
      }),
    });

    let result = await resp.json();
    allTasks = result.data;

    for (let i in allTasks) {
      allTasks[i].editor = false;
    }

    valueInput = "";
    valueName = "";
    inputText.value = "";
    inputName.value = "";
    render();
  } else {
    alert('Поле "Задача" пустое!!!');
  }
};

const updateName = (event) => {
  valueName = event.target.value;
};

const updateValue = (event) => {
  valueInput = event.target.value;
};

const render = () => {
  const content = document.getElementById("content-page");
  while (content.firstChild) {
    content.removeChild(content.firstChild);
  }

  allTasks = allTasks.sort((obj1, obj2) => {
    return obj2.isCheck - obj1.isCheck;
  });

  allTasks.map((item, index) => {
    const { name, text, isCheck, id, editor } = item;
    if (!editor && item) {
      const container = document.createElement("div");
      container.id = `task-${index}`;
      const nameh2 = document.createElement("h2");
      nameh2.innerText = name;
      const textP = document.createElement("p");
      textP.innerText = text ? text : "Описание отсутствует";

      const container2 = document.createElement("div");
      const imgEdit = document.createElement("img");
      imgEdit.src = "edit.png";
      imgEdit.onclick = () => openEditor(index);

      const imgDel = document.createElement("img");
      imgDel.src = "delet.png";
      imgDel.onclick = () => delTask(index, id);
      const checkBox = document.createElement("input");
      checkBox.type = "checkbox";
      checkBox.className = "check";
      checkBox.checked = isCheck;
      checkBox.onchange = () => onChangeCheckbox(index);

      container2.className = isCheck ? "edit del" : "edit";
      imgDel.className = isCheck ? "delImg" : "";
      imgEdit.className = isCheck ? "delImg" : "";
      textP.className = isCheck ? "text-task done-task" : "text-task";
      container.className = isCheck ? "page done" : "page";
      nameh2.className = isCheck ? "done-task" : "";

      container2.appendChild(imgEdit);
      container2.appendChild(checkBox);
      container2.appendChild(imgDel);

      container.appendChild(nameh2);
      container.appendChild(textP);
      container.appendChild(container2);
      content.appendChild(container);
    } else if (item) {
      const container = document.createElement("div");
      container.id = `task-${index}`;
      container.className = "page";

      const contEditName = document.createElement("div");
      contEditName.className = "editName";
      const nameh2 = document.createElement("h2");
      nameh2.innerText = "Change:";
      const editName = document.createElement("input");
      editName.type = "text";
      editName.id = `name${index}`;
      editName.className = "sizeName";
      editName.value = name;
      contEditName.appendChild(nameh2);
      contEditName.appendChild(editName);

      const textP = document.createElement("input");
      textP.type = "text";
      textP.id = `text${index}`;
      textP.className = "editText";
      textP.value = text;

      const container2 = document.createElement("div");
      container2.className = "edit";
      const imgClos = document.createElement("img");
      imgClos.src = "close.png";
      imgClos.onclick = () => openEditor(index);
      const imgOk = document.createElement("img");
      imgOk.src = "good.png";
      imgOk.onclick = () => changeTask(index);
      container2.appendChild(imgOk);
      container2.appendChild(imgClos);
      container.appendChild(contEditName);
      container.appendChild(textP);
      container.appendChild(container2);
      content.appendChild(container);
    }
  });
};

const onChangeCheckbox = async (index) => {
  allTasks[index].isCheck = !allTasks[index].isCheck;
  changeBD(index);
  render();
};

const delTask = async (index, id) => {
  delete allTasks[index];
  const resp = await fetch(`http://localhost:8000/deleteTask?id=${id}`, {
    method: "DELETE",
  });
  render();
};

const openEditor = (index) => {
  allTasks[index].editor = !allTasks[index].editor;
  render();
};

const changeTask = (index) => {
  const inputTextValue = document.getElementById(`text${index}`);
  changeText(inputTextValue);
  const inputNameValue = document.getElementById(`name${index}`);
  changeName(inputNameValue);
  allTasks[index].name = valueName;
  allTasks[index].text = valueInput;
  allTasks[index].editor = !allTasks[index].editor;
  changeBD(index);
  valueInput = "";
  valueName = "";
  render();
};

const changeText = (text) => {
  valueInput = text.value;
};

const changeName = (name) => {
  valueName = name.value;
};

const changeBD = async (index) => {
  const { name, text, isCheck, id } = allTasks[index];
  const resp = await fetch("http://localhost:8000/updateTask", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify({
      nameObj,
      textObj,
      isCheckObj,
      id,
    }),
  });
};
