function tools_info(content){
    tools_role.innerText = content.role;
    tools_content.innerText = content.content;
    tools_function_ul.innerHTML = "";
    try{
        content.tools = JSON.parse(content.tools);
        content.tools.forEach(element => {
            tools_function_ul.insertAdjacentElement("beforeend", generateUl(element));
        });
    }catch{
        try{
            content.tools.forEach(element => {
                tools_function_ul.insertAdjacentElement("beforeend", generateUl(element));
            });
        }catch{}
    }
}

function generateUl(tools){
    const summary = document.createElement("summary");
    const details = document.createElement("details");
    const div = document.createElement("div");
    const span = document.createElement("span");
    const li = document.createElement("li");
    
    summary.innerText = tools.name;
    
    div.style.marginLeft = "25px";
    div.innerHTML = `ARGS:<br>${JSON.stringify(tools.arguments)}<br>`;

    span.style.color = "green";
    span.innerText = tools.result;

    div.insertAdjacentElement("beforeend", span);

    details.insertAdjacentElement("beforeend", summary);
    details.insertAdjacentElement("beforeend", div);

    li.insertAdjacentElement("beforeend", details);

    return li;

}

function generateJSON(){
    const msgs = history_chat.querySelectorAll("div");
    const chat_array = [];
    msgs.forEach((msg) => {
        chat_array.push({
            role: msg.className,
            content: msg.innerText
        })
    });

    const json = {
        message: chat_array
    }

    return js_beautify(JSON.stringify(json));
}

function showJSONContainer(){
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

    close.addEventListener("click", ()=> { console.log("close"); container.remove(); });
    

    const json = generateJSON();
    box.innerHTML += `<h3>JSON generado</h3><pre><code class=\"language-json\" id=\"codigo\"">${json}</code></pre>`;
    box.appendChild(close);
    container.appendChild(box);

    document.body.appendChild(container);
}
