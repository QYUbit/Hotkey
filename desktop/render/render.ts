import { Hotkey, isDataFile } from "../shared";
import { $new } from "./mucok";

interface IpcApi {
    receive: (channel: string, cb: (...args: any[]) => void) => void;
    send: (channel: string, ...args: any[]) => void;
}

declare global {
    interface Window {
        api: IpcApi;
    }
}

const actionTypes = ["Open Url", "Open Application"];

document.addEventListener("DOMContentLoaded", () => {
    console.log("ready");
    window.api.send("ready");
});

window.api.receive("sendErrorFeedback", (message) => {
    if (typeof message === "string" && message.length < 200) {
        alert(message);
        return;
    }
    alert("An error occured");
});

interface CreateDropdownParams {
    optionCb?: (option: string, e: Event) => void;
    placeholder?: string;
    defaultOption?: string;
    index?: number;
}

function createDropdownElement(options: string[], {defaultOption, placeholder, index=0, optionCb}: CreateDropdownParams): Element {
    const dropdown = $new("div");

    const button = $new("button", ["btn"], {popovertarget: `popover-${index}`, style: `anchor-name:--anchor-${index}`} as any);
    if (defaultOption) {
        button.innerHTML = defaultOption;
    } else if (placeholder) {
        button.innerHTML = placeholder;
    }

    button.addEventListener("click", () => {
        if ((list as any).popover) {
            (list as any).popover = undefined;
        } else {
            (list as any).popover;
        }
    });

    dropdown.appendChild(button);

    const list = $new(
        "ul",
        ["dropdown", "menu", "w-52", "rounded-box", "bg-base-100", "shadow-sm"],
        {id: `popover-${index}`, style: `position-anchor:--anchor-${index}`} as any
    );

    dropdown.appendChild(list);
    
    options.forEach((option) => {
        const listItem = $new("li");
        const itemButton = $new("button");
        itemButton.innerHTML = option;
        itemButton.addEventListener("click",
            e => optionCb && optionCb(option, e)
        );
        listItem.appendChild(itemButton);
        list.appendChild(listItem);
    });

    return dropdown;
}

window.api.receive("sendInitData", (data) => {
    if (!isDataFile(data)) {
        console.error("Invlid init data format")
        alert("An error occured");
        return;
    }

    const keyContainer = document.querySelector("#key-container");

    const testData: Hotkey[] = [{keys: ["strg", "alt", "u"], actionType: "open", data: "aaa"},
    {keys: ["strg", "alt", "u"], actionType: "open", data: "aaa"},
    {keys: ["strg", "alt", "u"], actionType: "open", data: "aaa"}];

    testData.forEach((hotkey, index) => {
        const keyDiv = $new("div", ["bg-blue-500", "flex", "rounded-lg", "p-1", "justify-between", "w-full"]);
        const keykeyDiv = $new("div", ["bg-green-500", "flex", "justify-center", "items-center", "gap-1"]);

        hotkey.keys.forEach((key) => {
            const realKeyDiv = $new("div", ["bg-fuchsia-500", "rounded-md", "px-1.5", "py-0.5", "text-white"]);
            realKeyDiv.innerHTML = key;
            keykeyDiv.appendChild(realKeyDiv);            
        });

        const dropdown = createDropdownElement(actionTypes, {placeholder: "Select Hotkey Action", index, optionCb: () => {}});
        
        keyDiv.appendChild(keykeyDiv);
        keyDiv.appendChild(dropdown);
        keyContainer?.appendChild(keyDiv);
    });
});
