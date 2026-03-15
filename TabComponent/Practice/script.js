class Tabs {
  static instanceCount = 0
  constructor({
    container,
    items = [],
    defaultIndex = 0,
    ariaLabel = 'Tabs',
    onChange = null
  }) {
    this.root = typeof container === "string" ? document.querySelector(container) : container;

    if (!this.root) {
      throw new Error("Tabs container not found")
    }

    if (!(Array.isArray(items)) || items.length === 0) {
      throw new Error("Items must be an non empty array")
    }
    // console.log(this.root)

    this.items = items;
    this.activeIndex = this.getSafeIndex(defaultIndex);
    this.ariaLabel = ariaLabel;
    this.onChange = onChange != null ? onChange : null
    this.instanceId = `tabs-${Tabs.instanceCount++}`;

    this.render();
    this.cacheDOM();
    this.bindEvents();
    this.updateUI(null, this.activeIndex, { focus: true, emit: true });
  }


  getSafeIndex(index) {
    if (index < 0 || index >= this.items.length) {
      throw new Error("Index is incorrect")
    }
    return index;
  }


  render() {
    let tabsHtml = this.items.map((item, index) => {
      let tabId = this.getTabId(item.id);
      let panelId = this.getPanelId(item.id);
      let isActive = index === this.activeIndex;

      return `<button
                id=${tabId}
                class="tabs-tab ${isActive ? "is-active" : ""}"
                role="tab"
                aria-selected="${isActive}"
                aria-controls="${panelId}"
                tabindex="${isActive ? 0 : -1}"
                data-index=${index}
                >${item.label}</button>`
    }).join("")

    let panelsHtml = this.items.map((item, index) => {
      let tabId = this.getTabId(item.id);
      let panelId = this.getPanelId(item.id);
      let isActive = index === this.activeIndex;

      return        `<section
                      id="${panelId}"
                      role ="tabpanel"
                      class="tabs-panel"
                      aria-labelledby="${tabId}"
                      ${isActive ? "" : "hidden"}
                    >${item.description}</section>
                    `
    }).join("");

    this.root.innerHTML = `<div class="tabs-container">
                <div class="tabs-list" role="tablist" aria-label="${this.ariaLabel}">
                  ${tabsHtml}
                </div>
                 <div class="tabs-panels">
                 ${panelsHtml}
                </div>
            </div>`
  }

  cacheDOM() {
    this.tabsList = this.root.querySelector('[role="tablist"]');
    this.tabs = Array.from(this.root.querySelectorAll('[role="tab"]'));
    this.tabpanels = Array.from(this.root.querySelectorAll('[role="tabpanel"]'));
    console.log(this.tabsList,typeof this.tabs,this.tabpanels)
  }

  bindEvents() {
    this.handleClick = this.onClick.bind(this);
    this.handleKeydown = this.onKeyDown.bind(this);
    this.tabsList.addEventListener("click", this.handleClick);
    this.tabsList.addEventListener("keydown", this.handleKeydown);
  }

  onClick(event) {
    let tab = event.target.closest('[role="tab"]')
    if (!tab || !(this.tabsList.contains(tab))) return;
    let nextIndex = Number(tab.dataset.index);
    if (nextIndex === this.activeIndex) return;
    this.setActiveIndex(nextIndex);
  }

  setActiveIndex(nextIndex, options = {}) {
    let safeIndex = this.getSafeIndex(nextIndex);
    if (safeIndex == this.activeIndex) return;
    let prevIndex = this.activeIndex;
    this.activeIndex = nextIndex
    this.updateUI(prevIndex, nextIndex, { 
      focus: options.focus ?? true, 
      emit: options.emit ?? true }
    );
  }

  onKeyDown(event) {
    let tab = event.target.closest('[role="tab"]')
    if(!tab) return;

    let nextIndex = this.activeIndex;

    switch (event.key) {
      case "ArrowRight":
            event.preventDefault();
            nextIndex = this.activeIndex +1 % this.tabs.length
            this.setActiveIndex(nextIndex,{focus:true})
            break;
      case "ArrowLeft":
          event.preventDefault();
            nextIndex = this.activeIndex - 1 +  this.tabs.length % this.tabs.length
            this.setActiveIndex(nextIndex,{focus:true})
            break;
      case "Home":
           event.preventDefault();
            this.setActiveIndex(0,{focus:true})
            break;
      case "End":
         event.preventDefault();
            this.setActiveIndex(this.tabs.length-1,{focus:true})
            break;
      case "Enter":
          event.preventDefault();
            this.setActiveIndex(Number(tab.dataset.index),{focus:true})
            break;
      case "":
    }

  }

  updateUI(prevIndex, nextIndex, {focus= true, emit= true}={}) {
      const nextTab = this.tabs[nextIndex];
      const nextPanel = this.tabpanels[nextIndex]
      // console.log('--updateUI-',prevIndex, nextIndex)
    if(prevIndex !== null && prevIndex !== undefined){
      let prevTab = this.tabs[prevIndex];
      let prevPanel = this.tabpanels[prevIndex];
      console.log(prevTab,prevPanel,this.tabpanels)
      if(prevTab){
        prevTab.classList.remove("is-active")
        prevTab.setAttribute("aria-selected","false")
        prevTab.setAttribute("tabindex","-1")
      }
      
      if(prevPanel){
        prevPanel.hidden = true;
      }
    }

    if(nextTab){
        nextTab.classList.add("is-active")
        nextTab.setAttribute("aria-selected","true")
        nextTab.setAttribute("tabindex","0")

        if(focus){
          nextTab.focus()
        }
    }

    if(nextPanel){
      nextPanel.hidden = false;
    }

    if(emit && this.onChange){
        this.onChange({
          activeIndex:nextIndex,
          activeItem:this.items[nextIndex]
        })
    }

  }


  getTabId(id) {
    return `${this.instanceId}-tab-${id}`;

  }

  getPanelId(id) {
    return `${this.instanceId}-panel-${id}`;
  }

  destroy(){

    if(this.tabsList){
        this.tabsList.removeEventListener("click",this.handleClick)
        this.tabsList.removeEventListener("keydown",this.handleKeydown)
    }
    this.root.innerHTML = "";
  }

}

document.getElementById("destroy-btn").addEventListener("click",function(){
  let tabslists = Array.from(document.querySelectorAll(".tabs-container"));
  for(const tabitem of tabslists){
     tabitem.remove()
  }
});



let eaInfoTabs = new Tabs({
  container: "#ea-infotabs",
  items: [{
    id: "pulse",
    label: "Pulse",
    description: "Pulse is a Pulse, personalized AI feature introduced by OpenAI in September 2025 that acts as an intelligent, automated assistant, delivering a customized, daily briefing to users. "
  },
  {
    id: "details",
    label: "Details",
    description: "Details is a Details, personalized AI feature introduced by OpenAI in September 2025 that acts as an intelligent, automated assistant, delivering a customized, daily briefing to users. "
  }, {
    id: "References",
    label: "References",
    description: "References is a proactive, References AI feature introduced by OpenAI in September 2025 that acts as an intelligent, automated assistant, delivering a customized, daily briefing to users. "
  }
    ,{
      id:"client",
      label:"Client",
      description:"Client is a proactive, personalized AI feature introduced by OpenAI in September 2025 that acts as an intelligent, automated assistant, delivering a customized, daily briefing to users. "
    },{
      id:"other",
      label:"Other",
      description:"Other is a proactive, personalized AI feature introduced by OpenAI in September 2025 that acts as an intelligent, automated assistant, delivering a customized, daily briefing to users. "
    }
  ],
  defaultIndex: 0,
  ariaLabel: "EA Info",
    onChange: ({ activeIndex, activeItem }) => {
    console.log("Changed to:", activeIndex, activeItem.label);
  }
});



let ea = new Tabs({
  container: "#ea-details",
  items: [{
    id: "pulse",
    label: "Pulse",
    description: "Pulse is a Pulse, personalized AI feature introduced by OpenAI in September 2025 that acts as an intelligent, automated assistant, delivering a customized, daily briefing to users. "
  },
  {
    id: "details",
    label: "Details",
    description: "Details is a Details, personalized AI feature introduced by OpenAI in September 2025 that acts as an intelligent, automated assistant, delivering a customized, daily briefing to users. "
  }, {
    id: "References",
    label: "References",
    description: "References is a proactive, References AI feature introduced by OpenAI in September 2025 that acts as an intelligent, automated assistant, delivering a customized, daily briefing to users. "
  }
    ,{
      id:"client",
      label:"Client",
      description:"Client is a proactive, personalized AI feature introduced by OpenAI in September 2025 that acts as an intelligent, automated assistant, delivering a customized, daily briefing to users. "
    },{
      id:"other",
      label:"Other",
      description:"Other is a proactive, personalized AI feature introduced by OpenAI in September 2025 that acts as an intelligent, automated assistant, delivering a customized, daily briefing to users. "
    }
  ],
  defaultIndex: 0,
  ariaLabel: "EA Info",
    onChange: ({ activeIndex, activeItem }) => {
    console.log("Changed to:", activeIndex, activeItem.label);
  }
});

