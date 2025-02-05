const config = {
    token: "",
    refresh_token: "",
    userid: 0,
    username: ""
}

const chat = document.getElementById("chat");
const history_chat = document.getElementById("history");
const msg = document.getElementById("message");
const send_img = document.getElementById("send_img");
const login_button = document.getElementById("login_button");

document.getElementById("login_container").addEventListener("keydown", (e)=>{
    if(e.keyCode == 13){
        e.preventDefault();
        login_button.click();
    }
})


login_button.addEventListener("click", ()=> {
    const login_box = document.getElementById("login_box");
    const inputs = login_box.querySelectorAll("input");
    const user = inputs[0].value;
    const password = inputs[1].value;
    
    fetch("/user/login", {
        method: "POST",
        headers:{
            "authorization": "Bearer " + config.refresh_token,
            "Content-Type" : "application/json"
        },
        body: JSON.stringify({
            username: user,
            password: password
        })
    })
    .then((data) => {
        if(data.status > 201){
            alert("usuario o contrasena incorrecta");
            throw Error("login error");
        }
        return data.text()
    })
    .then((text) => {
        const json = JSON.parse(text);
        config.userid = json.userid;
        config.username = json.username;
        config.refresh_token = json.refresh_token;
        config.token = json.access_token;
        initRefreshTokenThread();
        requestOldChat();
        document.getElementById("login_container").remove();
    })
});

function initRefreshTokenThread(){
    setTimeout(()=>{
            fetch("/user/refresh_token", {
                method: "POST",
                headers:{
                    "Content-Type": "application/json",
                    "authorization": config.refresh_token
                },
                body: ""
            })
            .then((data) => data.text())
            .then((text) => {
                const json = JSON.parse(text);
                config.refresh_token = json.refresh_token;
                config.token = json.access_token;
                initRefreshTokenThread()
            })
        }, 900000)
}

const tools_role = document.getElementById("tools_role");
const tools_content = document.getElementById("tools_content");
const tools_function_ul = document.getElementById("tools_function_ul");


function generatePopUp(title, content){
    const container = document.createElement("div");
    const box = document.createElement("div");

    const close = document.createElement("div");

    container.className = "overlayContainer";

    box.className = "boxJSON"
    
    close.innerText = "X"
    close.style.fontSize = "18px"
    close.style.position = "absolute";
    close.style.right = "15px";
    close.style.top = "15px";
    close.style.borderRadius = "100%";
    close.style.padding = "15px";
    close.style.cursor = "pointer";
    close.style.backgroundColor = "#ffffff40"

    close.addEventListener("click", ()=> { container.remove(); });
    
    box.innerHTML += `<h3>${title}</h3>`;
    box.appendChild(content);
    box.appendChild(close);
    container.appendChild(box);

    document.body.appendChild(container);

    return container;
}

function generateAssistantEditorPopUp(original_data, assistant_element){
    const original_label = document.createElement("p");
    const original = document.createElement("div");
    const original_box = document.createElement("div");

    original_label.innerHTML = "Original"
    original.innerText = original_data.content;
    original_box.className = "popupStyles";

    const edited_box = document.createElement("div");
    const edited_label = document.createElement("p");
    const edited = document.createElement("div");

    edited.contentEditable = "true";
    edited_label.innerHTML = "Edited"
    edited.innerText = original_data.content;
    edited_box.className = "popupStyles";

    const button = document.createElement("button");
    const container = document.createElement("div");

    original_box.appendChild(original_label);
    original_box.appendChild(original);
    edited_box.appendChild(edited_label);
    edited_box.appendChild(edited);
    
    container.appendChild(original_box);
    container.appendChild(edited_box);
    
    container.className = "myFlex";
    button.innerText = "Guardar";

    container.appendChild(button);

    const main = generatePopUp("Editar respuesta", container);
    button.addEventListener("click", ()=>{
        assistant_element.innerText = edited.innerText;
        original_data.content = edited.innerText;
        main.remove();    
    });
}

function generateUserTrainEditorPopUp(original_data){
    const original_label = document.createElement("p");
    const original = document.createElement("div");
    const original_box = document.createElement("div");

    original_label.innerHTML = "Original"
    original.innerText = original_data.content;
    original_box.className = "popupStyles";
    original_box.style.maxHeight = "90px";
    const accepted_box = document.createElement("div");
    const accepted_label = document.createElement("p");
    const accepted = document.createElement("div");

    accepted.contentEditable = "true";
    accepted_label.innerHTML = "Aceptado"
    accepted.innerText = original_data.content;
    accepted_box.className = "popupStyles";
    accepted_box.style.backgroundColor = "#007f00";

    const refused_box = document.createElement("div");
    const refused_label = document.createElement("p");
    const refused = document.createElement("div");

    refused.contentEditable = "true";
    refused_label.innerHTML = "Rechazado"
    refused.innerText = original_data.content;
    refused_box.className = "popupStyles";
    refused_box.style.backgroundColor = "#a10000";

    refused_box.style.maxHeight = accepted_box.style.maxHeight = "100px";

    const button = document.createElement("button");
    const container = document.createElement("div");

    original_box.appendChild(original_label);
    original_box.appendChild(original);
    
    accepted_box.appendChild(accepted_label);
    accepted_box.appendChild(accepted);

    refused_box.appendChild(refused_label);
    refused_box.appendChild(refused);
    
    container.appendChild(original_box);
    container.appendChild(accepted_box);
    container.appendChild(refused_box);
    
    container.className = "myFlex";
    container.style.height = "100%";

    button.innerText = "Generar JSON";
    button.style.marginTop = "auto";
    button.style.marginBottom = "8px";

    container.appendChild(button);

    const main = generatePopUp("Editar respuesta", container);
    button.addEventListener("click", ()=>{
        const pre = document.createElement("pre");
        const code = document.createElement("code");
        const json = {
            example:{
                input: original.innerText,
                chosen: accepted.innerText,
                rejected: refused.innerText
            }
        }
        code.innerText = js_beautify(JSON.stringify(json))
        code.className = "language-json";
        pre.appendChild(code);
        generatePopUp("RLHD Json", pre);
    });
}

document.addEventListener("paste", function (event) {
    let activeElement = document.activeElement;
    if (activeElement && activeElement.isContentEditable) {
        event.preventDefault(); 

        let text = (event.clipboardData || window.clipboardData).getData("text/plain");

        document.execCommand("insertText", false, text);
    }
});

document.addEventListener("click", function (event) {
    if (event.target.classList.contains("selectable")) {
        activeDiv = event.target;
    }
});

document.addEventListener("keydown", function (event) {
    if (event.ctrlKey && event.key === "a") { 
        if (activeDiv) {
            event.preventDefault(); 

            let range = document.createRange();
            let selection = window.getSelection();
            range.selectNodeContents(activeDiv);
            selection.removeAllRanges();
            selection.addRange(range);
            activeDiv = false;
        }
    }
});
