import { $new } from "./mucok";

interface CreateDropdownParams {
    options: string[];
    id?: string;
    placeholder?: string;
    defaultOption?: string;
    onOptionClick?: (option: string, e: Event) => void;
    onToggle?: (isOpen: boolean) => void;
}

export default class Dropdown {
    private container: Element;
    private button: Element;
    private content: Element;

    constructor({options, id, defaultOption, placeholder, onOptionClick, onToggle}: CreateDropdownParams) {
        this.container = $new("details", ["dropdown"]);

        this.button = $new("summary", ["btn", "m1", "w-40"]);
        if (defaultOption) {
            this.button.innerHTML = defaultOption;
        } else if (placeholder) {
            this.button.innerHTML = placeholder;
        }

        this.button.addEventListener("click", () => {
            onToggle && onToggle(!(this.container as any).open);
        });

        this.content = $new("ul", [
            "menu",
            "dropdown-content",
            "bg-base-100",
            "rounded-box",
            "z-1",
            "w-52",
            "p-2",
            "shadow-sm",
        ]);
        
        options.forEach((option) => {
            const listItem = $new("li");
            const itemButton = $new("button");
            itemButton.innerHTML = option;
            itemButton.addEventListener("click",
                e => onOptionClick && onOptionClick(option, e)
            );
            listItem.appendChild(itemButton);
            this.content.appendChild(listItem);
        });

        this.container.appendChild(this.button);
        this.container.appendChild(this.content);

        if (id) {
            this.button.id = `${id}-button`;
            this.content.id = `${id}-content`;
            this.container.id = `${id}-container`;
        }

        document.addEventListener("mousedown", (e) => {
            if (!this.container.contains(e.target as Node)) {
                this.close();
            }
        });
    }

    getContainer(): Element {
        return this.container;
    }

    getButton(): Element {
        return this.button;
    }

    getContent(): Element {
        return this.content;
    }

    open() {
        (this.container as any).open = true;
    }

    close() {
        (this.container as any).open = false;
    }

    isOpen(): boolean {
        if (typeof (this.container as any).open === "boolean") {
            return (this.container as any).open
        } else {
            return false;
        }
    }
}
