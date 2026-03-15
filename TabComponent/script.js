class Tabs {
  static instanceCount = 0;

  constructor({
    container,
    items = [],
    defaultIndex = 0,
    ariaLabel = "Tabs",
    onChange = null
  }) {
    this.root =
      typeof container === "string"
        ? document.querySelector(container)
        : container;

    if (!this.root) {
      throw new Error("Tabs: container not found.");
    }

    if (!Array.isArray(items) || items.length === 0) {
      throw new Error("Tabs: items must be a non-empty array.");
    }

    this.items = items;
    this.activeIndex = this.getSafeIndex(defaultIndex);
    this.ariaLabel = ariaLabel;
    this.onChange = typeof onChange === "function" ? onChange : null;
    this.instanceId = `tabs-${Tabs.instanceCount++}`;

    this.render();
    this.cacheDom();
    this.bindEvents();
    this.updateUI(null, this.activeIndex, { focus: false, emit: false });
  }

  getSafeIndex(index) {
    if (index < 0 || index >= this.items.length) {
      return 0;
    }
    return index;
  }

  render() {
    const tabsMarkup = this.items
      .map((item, index) => {
        const tabId = this.getTabId(item.id);
        const panelId = this.getPanelId(item.id);
        const isActive = index === this.activeIndex;

        return `
          <button
            id="${tabId}"
            class="tabs__tab${isActive ? " is-active" : ""}"
            role="tab"
            type="button"
            aria-selected="${isActive}"
            aria-controls="${panelId}"
            tabindex="${isActive ? "0" : "-1"}"
            data-index="${index}"
          >
            ${item.label}
          </button>
        `;
      })
      .join("");

    const panelsMarkup = this.items
      .map((item, index) => {
        const tabId = this.getTabId(item.id);
        const panelId = this.getPanelId(item.id);
        const isActive = index === this.activeIndex;

        return `
          <section
            id="${panelId}"
            class="tabs__panel"
            role="tabpanel"
            aria-labelledby="${tabId}"
            ${isActive ? "" : "hidden"}
          >
            ${item.content}
          </section>
        `;
      })
      .join("");

    this.root.innerHTML = `
      <div class="tabs">
        <div class="tabs__list" role="tablist" aria-label="${this.ariaLabel}">
          ${tabsMarkup}
        </div>
        <div class="tabs__panels">
          ${panelsMarkup}
        </div>
      </div>
    `;
  }

  cacheDom() {
    this.tabList = this.root.querySelector('[role="tablist"]');
    this.tabs = Array.from(this.root.querySelectorAll('[role="tab"]'));
    this.panels = Array.from(this.root.querySelectorAll('[role="tabpanel"]'));
  }

  bindEvents() {
    this.handleClick = this.onClick.bind(this);
    this.handleKeydown = this.onKeyDown.bind(this);

    this.tabList.addEventListener("click", this.handleClick);
    this.tabList.addEventListener("keydown", this.handleKeydown);
  }

  onClick(event) {
    const tab = event.target.closest('[role="tab"]');
    if (!tab || !this.tabList.contains(tab)) return;

    const nextIndex = Number(tab.dataset.index);
    if (nextIndex === this.activeIndex) return;

    this.setActiveIndex(nextIndex);
  }

  onKeyDown(event) {
    const tab = event.target.closest('[role="tab"]');
    if (!tab) return;

    let nextIndex = this.activeIndex;

    switch (event.key) {
      case "ArrowRight":
        event.preventDefault();
        nextIndex = (this.activeIndex + 1) % this.tabs.length;
        this.setActiveIndex(nextIndex, { focus: true });
        break;

      case "ArrowLeft":
        event.preventDefault();
        nextIndex = (this.activeIndex - 1 + this.tabs.length) % this.tabs.length;
        this.setActiveIndex(nextIndex, { focus: true });
        break;

      case "Home":
        event.preventDefault();
        this.setActiveIndex(0, { focus: true });
        break;

      case "End":
        event.preventDefault();
        this.setActiveIndex(this.tabs.length - 1, { focus: true });
        break;

      case "Enter":
      case " ":
        event.preventDefault();
        this.setActiveIndex(Number(tab.dataset.index), { focus: true });
        break;
    }
  }

  setActiveIndex(nextIndex, options = {}) {
    const safeIndex = this.getSafeIndex(nextIndex);
    if (safeIndex === this.activeIndex) return;
    
    const prevIndex = this.activeIndex;
    this.activeIndex = safeIndex;
    this.updateUI(prevIndex, safeIndex, {
      focus: options.focus ?? true,
      emit: options.emit ?? true
    });
  }

  updateUI(prevIndex, nextIndex, { focus = true, emit = true } = {}) {
    const nextTab = this.tabs[nextIndex];
    const nextPanel = this.panels[nextIndex];

    if (prevIndex !== null && prevIndex !== undefined) {
      const prevTab = this.tabs[prevIndex];
      const prevPanel = this.panels[prevIndex];

      if (prevTab) {
        prevTab.classList.remove("is-active");
        prevTab.setAttribute("aria-selected", "false");
        prevTab.setAttribute("tabindex", "-1");
      }

      if (prevPanel) {
        prevPanel.hidden = true;
      }
    }

    if (nextTab) {
      nextTab.classList.add("is-active");
      nextTab.setAttribute("aria-selected", "true");
      nextTab.setAttribute("tabindex", "0");

      if (focus) {
        nextTab.focus();
      }
    }

    if (nextPanel) {
      nextPanel.hidden = false;
    }

    if (emit && this.onChange) {
      this.onChange({
        activeIndex: nextIndex,
        activeItem: this.items[nextIndex]
      });
    }
  }



  getTabId(id) {
    return `${this.instanceId}-tab-${id}`;
  }

  getPanelId(id) {
    return `${this.instanceId}-panel-${id}`;
  }

  destroy() {
    if (this.tabList) {
      this.tabList.removeEventListener("click", this.handleClick);
      this.tabList.removeEventListener("keydown", this.handleKeydown);
    }
    this.root.innerHTML = "";
  }
}

function createTabs() {
  productTabs = new Tabs({
    container: "#product-tabs",
    ariaLabel: "Product tabs",
    items: [
      { id: "overview", label: "Overview", content: "<p>Overview content</p>" },
      { id: "features", label: "Features", content: "<p>Features content</p>" },
      { id: "pricing", label: "Pricing", content: "<p>Pricing content</p>" }
    ]
  });
}

document.getElementById("create-tabs-btn").addEventListener("click", () => {
  if (!productTabs) {
    createTabs();
  }
});

  document.getElementById("destroy-btn").addEventListener("click", () => {
  if (productTabs) {
    productTabs.destroy();
    productTabs = null;
  }
});

let productTabs = new Tabs({
  container: "#product-tabs",
  ariaLabel: "Product information",
  defaultIndex: 0,
  items: [
    {
      id: "overview",
      label: "Overview",
      content: `
        <h2>Overview</h2>
        <p>This is the overview content.</p>
      `
    },
    {
      id: "features",
      label: "Features",
      content: `
        <h2>Features</h2>
        <p>Feature list goes here.</p>
      `
    },
    {
      id: "pricing",
      label: "Pricing",
      content: `
        <h2>Pricing</h2>
        <p>Pricing details go here.</p>
      `
    }
  ],
  onChange: ({ activeIndex, activeItem }) => {
    console.log("Changed to:", activeIndex, activeItem.label);
  }
});

const accountTabs = new Tabs({
  container: "#account-tabs",
  ariaLabel: "Account settings",
  defaultIndex: 1,
  items: [
    {
      id: "profile",
      label: "Profile",
      content: `
        <h2>Profile</h2>
        <p>Edit your profile details.</p>
      `
    },
    {
      id: "security",
      label: "Security",
      content: `
        <h2>Security</h2>
        <p>Manage password and authentication.</p>
      `
    },
    {
      id: "notifications",
      label: "Notifications",
      content: `
        <h2>Notifications</h2>
        <p>Control alert preferences.</p>
      `
    }
  ]
});
// const tabButtons = document.querySelectorAll(".tab-button");
// const tabPanels = document.querySelectorAll(".tab-panel");

// tabButtons.forEach((button) => {
//   button.addEventListener("click", () => {
//     const targetTab = button.dataset.tab;

//     tabButtons.forEach((btn) => btn.classList.remove("active"));
//     tabPanels.forEach((panel) => panel.classList.remove("active"));

//     button.classList.add("active");
//     document.getElementById(targetTab).classList.add("active");
//   });
// });