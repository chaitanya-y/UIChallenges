

class AutoComplete {
    static instanceCount = 0;

    constructor({
        container,
        placeholder,
        minChars,
        maxResults,
        items = [],
        onSelect = null
    }) {
        this.root =
            typeof container === "string"
                ? document.querySelector(container)
                : container;

        if (!this.root) {
            throw new Error("Autocomplete: container not found.");
        }

        if (!Array.isArray(items) || items.length === 0) {
            throw new Error("Tabs: items must be a non-empty array.");
        }

        this.items = items;
        this.placeholder = placeholder;
        this.minChars = minChars
        this.maxResults = maxResults
        this.onSelect= typeof onSelect === "function" ? onSelect : null;
        this.instanceId = `autcomplete-${AutoComplete.instanceCount++}`;

        this.render();
        this.cacheDOM();
        this.bindEvents();
        this.updateSuggestionsUI();
        // destroy();

    }

    render(){



        this.root.innerHTML =   `<div class="autocomplete-container">
                                        <input type="text" value="" placeholder="${this.placeholder}" id="${this.getSafeID()}" min="${this.minChars}"  />
                                        <div class="items__container">
                                        </div>
                                    </div>`
    }
    


    getSafeID(){
        return `${this.instanceId}-autocomplete`
    }
    getSageContainerID(){
         return `${this.instanceId}-autocomplete-suggestionsCont`
    }

    cacheDOM(){
        this.inputElement = document.getElementById(`${this.getSafeID()}`);
        this.suggestContainer = document.getElementById()
    }

    bindEvents(){
        this.handleChange = this.onChange.bind(this);
        this.inputElement.addEventListener("input",this.handleChange);
    }

    onChange(event){
        let inputValue = event.target.value
         this.inputElement.value = inputValue
         this.updateSuggestionsUI(inputValue);
    }

    updateSuggestionsUI(inputValue){
        console.log(inputValue);
    }



}









let autocompleteInstance = null;

function createAutocomplete() {
    autocompleteInstance = new AutoComplete({
        container: "#autocomplete-root",
        placeholder: "Search frontend topics...",
        minChars: 1,
        maxResults: 6,
        items: [
            { id: 1, label: "JavaScript" },
            { id: 2, label: "TypeScript" },
            { id: 3, label: "React" },
            { id: 4, label: "Accessibility" },
            { id: 5, label: "Performance Optimization" },
            { id: 6, label: "Event Delegation" },
            { id: 7, label: "Async Await" },
            { id: 8, label: "Promises" },
            { id: 9, label: "CSS Grid" },
            { id: 10, label: "Flexbox" },
            { id: 11, label: "Debounce" },
            { id: 12, label: "Throttle" }
        ],
        onSelect: (item) => {
            console.log("Selected item:", item);
        }
    });
}

createAutocomplete();