import { Hotkey, isDataFile } from "../shared";
import { $new } from "./mucok";
import Dropdown from "./dropdown";

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

window.api.receive("sendInitData", (data) => {
    if (!isDataFile(data)) {
        console.error("Invlid init data format")
        alert("An error occured");
        return;
    }

    const keyContainer = document.querySelector("#key-container");

    const testData: Hotkey[] = [
        {keys: ["strg", "alt", "u"], actionType: "Open Url", data: "aaa"},
        {keys: ["strg", "alt", "u"], actionType: "Open Url", data: "aaa"},
        {keys: ["strg", "alt", "u"], actionType: "Open Url", data: "aaa"}
    ];

    const dropdowns: Dropdown[] = [];

    testData.forEach((hotkey, index) => {
        const keyDiv = $new("div", ["flex", "rounded-lg", "p-1", "justify-between", "w-full", "bg-base-300", "shadow-md"]);
        const keykeyDiv = $new("div", ["flex", "items-center", "gap-1"]);

        hotkey.keys.forEach((key) => {
            const popDiv = $new("div", ["dropdown", "dropdown-hover", "dropdown-top"]);

            const realKeyDiv = $new(
                "div",
                ["bg-base-200", "rounded-md", "px-1.5", "py-1", "text-primary-content", "border-accent", "min-w-10", "h-full", "text-center", "border-base-content", "border-t-[1px]", "border-r-[1px]", "border-l-[1px]"],
                {tabindex: 0, role: "button"} as any
            );
            realKeyDiv.innerHTML = key;


            const deleteButton = $new(
                "button",
                ["dropdown-content", "bg-base-300", "rounded-box", "z-1", "p-1", "shadow-sm", "hover:bg-neutral", "cursor-pointer"],
                {tabindex: 0} as any
            );

            const deleteImage = $new("img", ["text-error"], {alt: "Delete", src: "../assets/delete.svg", height: 24, width: 24} as any);

            deleteButton.appendChild(deleteImage);
            popDiv.appendChild(realKeyDiv);
            popDiv.appendChild(deleteButton);
            keykeyDiv.appendChild(popDiv);          
        });

        const handleOptionClick = (option: string) => {
            dropdown.getButton().innerHTML = option;
        };

        const handleToggle = (isOpen: boolean) => {
            dropdowns.forEach((dd, ddIndex) => {
                if (ddIndex !== index && isOpen) {
                    dd.close();
                }
            });
        };

        const dropdown = new Dropdown({
            options: actionTypes,
            id: `action-dropdown-${index}`,
            placeholder: "Select Hotkey Action",
            defaultOption: hotkey.actionType,
            onOptionClick: handleOptionClick,
            onToggle: handleToggle
        });

        dropdowns.push(dropdown);
        
        keyDiv.appendChild(keykeyDiv);
        keyDiv.appendChild(dropdown.getContainer());                                                                                                                                       
        keyContainer?.appendChild(keyDiv);
    });
});
