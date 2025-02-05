msg.addEventListener("blur", (e)=>{
    if(msg.innerText.length == 1)
        msg.innerText = "";
})

msg.addEventListener("keydown", (e)=>{
    
    switch(e.keyCode){
        case 13:{
            e.preventDefault();
            send();
            break;
        }
        default: {
            break;
        }
    }
})

function send(){
    if(msg.getAttribute("contenteditable") == 'false') return;
    const content = msg.innerText;
    if(content == "") return;
    resetMsgContent();

    const user = document.createElement("div");
    user.className = "user";
    user.innerText = content;
    user.setAttribute("name", getChatSize() + 1);

    const json = {
        role: "user",
        content,
        tools: ""
    };
    user.addEventListener("click", ()=>{
        tools_info(json);
    })

    user.addEventListener("dblclick", ()=>{
        generateUserTrainEditorPopUp(json);
    })

    const assistant = document.createElement("div");
    assistant.className = "assistant";
    assistant.innerHTML = "<img src=\"/?requestfile=web/svg/loading.svg\" width=\"40px\">";
    assistant.setAttribute("name", getChatSize() + 2);
    history_chat.insertAdjacentElement("beforeend", user);
    history_chat.insertAdjacentElement("beforeend", assistant);
    
    history_chat.scrollTop = history_chat.scrollHeight;

    sendRequest(content, assistant, user);
}

function generateRegenerateMessageLabel(){
    const container = document.createElement("div");
    const errorMessage = document.createElement("span");
    const image = document.createElement("img");

    image.src = "/?requestfile=web/svg/reload.svg";
    image.style.width = "15px";

    errorMessage.innerText = "Regenerar respuesta";

    container.id = "RenegerateResponse";
    container.className = "";
    container.addEventListener("click", ()=>{
        container.remove();
        const last_user = getLastUserMessage();
        const last_assistant = getLastAssistanteMessage();
        last_assistant.innerHTML = "<img src=\"/?requestfile=web/svg/loading.svg\" width=\"40px\">";
        sendRequest(last_user.innerText, last_assistant);
        msg.removeAttribute("class");
        msg.setAttribute("contenteditable", "true");
        msg.getAttribute("contenteditable")
    })
    
    msg.setAttribute("class", "disabled");
    msg.setAttribute("contenteditable", "false");
    container.insertAdjacentElement("beforeend", image);
    container.insertAdjacentElement("beforeend", errorMessage);
    chat.insertAdjacentElement("beforeend", container);
}

function getLastUserMessage(){
    const all = history_chat.querySelectorAll("div")
    for(let i = all.length - 1; i > 0; i--)
        if(all[i].className == "user") return all[i];
}

function getLastUserMessageNum(){
    const all = history_chat.querySelectorAll("div")
    for(let i = all.length - 1; i > 0; i--)
        if(all[i].className == "user") return all[i].getAttribute("name");
}

function getLastAssistanteMessage(){
    const all = history_chat.querySelectorAll("div")
    for(let i = all.length - 1; i > 0; i--)
        if(all[i].className == "assistant") return all[i];
}   

function getLastAssistanteMessageNum(){
    const all = history_chat.querySelectorAll("div")
    for(let i = all.length - 1; i > 0; i--)
        if(all[i].className == "assistant") return all[i].getAttribute("name");
}

function resetMsgContent(){
    msg.innerText = "";
}

function sendRequest(content, assistant){
    fetch("/openai", {
        method: "POST",
        headers:{
            "authorization": "Bearer " + config.refresh_token,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            userid: 1,
            message: content,
            clientNumber: 352333,
            app: "Whatsapp"
        })
    })
    .then((data) => {
        if(data.status != 201){ 
            generateRegenerateMessageLabel();
            const last = getLastAssistanteMessage();
            last.innerHTML = "Error al generar. Pulsa para reintentar"
            throw Error("Bad response")
        }
        else
            return data.text()
    })
    .then((text)=>{
        let json = JSON.parse(text);
        assistant.innerHTML= "";
        assistant.innerText = json.content;
        assistant.addEventListener("click", ()=> {
            let content = json.content;
            let tools = json.tools;
            tools_info({
                role: "assistant",
                content: content,
                tools: tools
            })
        })

        assistant.addEventListener("dblclick", ()=> {
            let content = json.content;
            let tools = json.tools;

            generateAssistantEditorPopUp({
                role: "assistant",
                content: content,
                tools: tools
            }, assistant);
        });

        history_chat.scrollTop = history_chat.scrollHeight;
    });
}

function loadChat(content){
    history_chat.innerHTML = "";
    for(let [i, conversation] of content.entries()){
        
        switch(conversation.role){
            case "user":{
                let user_data = conversation;
                const user = document.createElement("div");
                user.className = "user selectable";
                user.innerText = user_data.content;
                user.setAttribute("name", i);
                history_chat.insertAdjacentElement("beforeend", user);
                user.addEventListener("click", ()=>{
                    tools_info(user_data);
                });

                user.addEventListener("dblclick", ()=>{
                    generateUserTrainEditorPopUp(user_data);
                })
                break
            }
            case "assistant":{
                let assinstant_data = conversation;
                const assinstant = document.createElement("div");
                assinstant.className = "assistant selectable";
                assinstant.innerText = assinstant_data.content;
                assinstant.setAttribute("name", i);
                history_chat.insertAdjacentElement("beforeend", assinstant);
                assinstant.addEventListener("click", ()=>{
                    tools_info(assinstant_data);
                })

                assinstant.addEventListener("dblclick", ()=> {
                    generateAssistantEditorPopUp(assinstant_data, assinstant);
                });

                break;
            }
            default:{
                break;
            }
        }
    }
}

async function requestOldChat(){
    const chat_raw = await fetch("/openai/getchat", {
        method: "POST",
        headers:{
            "authorization": "Bearer " + config.refresh_token,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            userid: 1,
            clientNumber: 352333,
            app: "Whatsapp"
        })
    })
    .then((data) => {
        if(data.status != 201) throw Error("[GETCHAT] Bad request")
        return data.text();
    })
    loadChat(JSON.parse(`[${chat_raw}]`));
}

function getChatSize(){
    return history_chat.querySelectorAll("div").length;
}

send_img.addEventListener("click", send);

