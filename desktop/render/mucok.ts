export function $new(htmlTag: string, classNames?: string[], attributes?: Partial<Element>): Element {
    const element = document.createElement(htmlTag);
    if (classNames) element.className = classNames.join(" ");
    if (attributes) {
        for (const attr in attributes) {
            element[attr] = attributes[attr];
        }
    }
    return element;
}

export function $get(selectors: string): NodeListOf<Element> {
    return document.querySelectorAll(selectors);
}

export function $use<UsableData = Record<string, any>>(selectors: string | Element | NodeListOf<Element>): Usables<UsableData> {
    if (selectors instanceof Element || selectors instanceof NodeList) {
        return new Usables(selectors);
    }
    const elements = document.querySelectorAll(selectors);
    return new Usables(elements);
}

export class Usable<UsableData> {
    private el: Element;
    private usData: UsableData;

    constructor(elements: Element) {
        this.el = elements;
    }

    get(): Element {
        return this.el;
    }

    data(): UsableData {
        return this.usData;
    }

    setData(data: UsableData) {
        this.usData = data;
    }

    setDataKey<Key extends keyof UsableData>(key: Key, value: UsableData[Key]) {
        this.usData[key] = value;
    }

    remove() {
        this.el.remove();
    }

    on(eventName: string, cb: (e: Event) => any) {
        this.el.addEventListener(eventName, cb);
    }

    off(eventName: string, cb: (e: Event) => any) {
        this.el.removeEventListener(eventName, cb);
    }

    addClass(className: string) {
        this.el.classList.add(className);
    }

    removeClass(className: string) {
        this.el.classList.remove(className);
    }

    toggleClass(className: string) {
        this.el.classList.toggle(className);
    }

    classNames(): string[] {
        return Array.from(this.el.classList);
    }

    html(): string {
        return this.el.innerHTML;
    }

    text(): string | null {
        return this.el.textContent;
    }

    setHtml(html: string) {
        this.el.innerHTML = html;
    }

    setText(text: string) {
        this.el.textContent = text;
    }

    attr(name: string) {
        return this.el.getAttribute(name);
    }

    setAttr(name: string, value: any) {
        this.el.setAttribute(name, value);
    }

    append(child: HTMLElement | Usable<any>) {
        if (child instanceof Usable) {
            this.el.appendChild(child.get());
        } else {
            this.el.appendChild(child);
        }
        return this;
    }
}

export class Usables<UsableData> extends Array<Usable<UsableData>> {
    constructor(elements: Element | NodeListOf<Element>) {
        if (elements instanceof Element) {
            super(new Usable<UsableData>(elements));
            return;
        }
        super(...Array.from(elements).map(el => new Usable<UsableData>(el)));
    }

    one(): Usable<UsableData> {
        return this[0];
    }

    getAll(): Element[] {
        return this.map(us => us.get());
    }

    remove() {
        this.forEach(us => us.remove());
    }

    on(eventName: string, cb: (e: Event) => any) {
        this.forEach(us => us.on(eventName, cb));
    }

    off(eventName: string, cb: (e: Event) => any) {
        this.forEach(us => us.off(eventName, cb));
    }

    addClass(className: string) {
        this.forEach(us => us.addClass(className));
    }

    removeClass(className: string) {
        this.forEach(us => us.removeClass(className));
    }
}
