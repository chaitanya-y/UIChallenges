class Accordion {
    static instanceCount = 0;

    constructor({
        container,
        items = [],
        defaultOpenIndices = [0],
        ariaLabel = "",
        onCollapse = null,
    }) {
        this.root = typeof container === "string" ? document.querySelector(container) : container;
        if (!this.root) {
            throw new Error("Accordion Container is not found")
        }
        if (!(Array.isArray(items)) || items.length === 0) {
            throw new Error("Items must be non empty array")
        }
        this.items = items;
        this.indices = defaultOpenIndices;
        this.ariaLabel = ariaLabel;
        this.instanceId = `Acccordion-${Accordion.instanceCount++}`;
        // this.onToggle = onCollapse != null ? onCollapse : null;

        this.render();
        this.cacheDOM();
        this.bindEvents();
        this.updateUI();
    }

    getSafeIndices(array) {
    }

    render() {

        let accordionMarkup = this.items.map((item, index) => {
            let headerId = this.getAccordionHeaderId(item.id);
            let panelId = this.getAccordionPanelId(item.id);
            let isToggled = this.indices.includes(index);

            return `<div id="${headerId}parent"  data-index="${index}">
                    <div id="${headerId}" class="accordion-header" aria-control="${panelId}" aria-expanded="${isToggled}">
                        <div>${item.title}</div><div class="arrow"><img src="./arrowdown.png" /></div>
                    </div>
                    <div id="${panelId}" class="accordion-panel" aria-labelledby="${headerId}" ${isToggled ? "" : "hidden"}>
                    ${item.content}
                    </div></div>
                    `;
        }).join("");

        this.root.innerHTML = `<div class="accordion-container" aria-label="${this.ariaLabel}">
                                  ${accordionMarkup} </div>`;
    }


    getAccordionHeaderId(id) {
        return `${this.instanceId}-Accordionheader-${id}`

    }

    getAccordionPanelId(id) {
        return `${this.instanceId}-AccordionPanel-${id}`
    }

    cacheDOM() {
    this.accordionsList = this.root.querySelector('.accordion-container');
    this.accordions = Array.from(this.root.querySelector)()

    // console.log(this.accordions)
    }

    bindEvents() {
    this.handleToggle = this.onToggle.bind(this);
    this.handleonKeyDown = this.onKeyDown.bind(this);
    this.accordionsList.addEventListener("click",this.handleToggle);
    this.accordionsList.addEventListener("keydown",this.handleonKeyDown);
    }

    onToggle(event) {
        let accordion = event.target.closest(".accordion-header");
        if(!accordion || !(this.accordionsList.contains(accordion))) return;
        let toggledAccordionIndex = Number(accordion.parentNode.dataset.index);
        if((this.indices.includes(toggledAccordionIndex))) return;
        this.indices = [...this.indices,toggledAccordionIndex];
        this.updateUI(toggledAccordionIndex);
    }

    updateUI(toggledAccordionIndex) {
        console.log('----updateUI',toggledAccordionIndex,this.indices);
        






    }

    onKeyDown() {

    }

    destroy() {

    }


}



let faq = new Accordion({
    container: "#faq-accordion",
    items: [
        { id: "a1", title: "What is LinkedIn?", content: "LinkedIn answer" },
        { id: "a2", title: "How do interviews work?", content: "Interview answer" }
    ],
    multiple: false,
    defaultOpenIndices: [1]
});