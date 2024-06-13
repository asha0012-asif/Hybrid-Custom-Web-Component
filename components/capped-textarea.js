const template = document.createElement("template");
template.innerHTML = `
<style>
    :host {
        display: block;
    }

    .root {
        display: grid;
        gap: 0.25rem;
    }

    div {
        display: grid;
    }

    textarea {
        padding: 0.5rem;
        border: 0.0325rem solid var(--color-normal);
        border-radius: 0.25rem;
        outline: 0.0325rem solid var(--color-normal);
    }

    .count {
        display: grid;
        grid-template-columns: repeat(7, 1fr);

        justify-items: center;
        align-items: center;
    }

    #progress-bar {
        width: 100%;
        height: 0.75rem;
        overflow: hidden;
        appearance: progress-bar;

        border: 0.0325rem solid #B2B2B2;
        border-radius: 0.75rem;

        grid-column: span 6;
    }

    #progress-bar::-webkit-progress-bar {
        background-color: #EFEFEF;
    }

    #progress-bar.warning::-webkit-progress-value {
        background-color: var(--color-warning);
    }

    #progress-bar.warning::-moz-progress-bar {
        background-color: var(--color-warning);
    }

    #progress-bar.limit::-webkit-progress-value {
        background-color: var(--color-limit);
    }

    #progress-bar.limit::-moz-progress-bar {
        background-color: var(--color-limit);
    }

    #char-count {
        font-size: 0.75rem;
        grid-column: span 1;
        justify-self: end;
    }
</style>

    <div class="root">
        <textarea></textarea>
        <div class="count">
            <progress id="progress-bar" max="100" value="0"></progress>
            <span id="char-count">0/200</span>
        </div>
    </div>
`;

class CappedTextarea extends HTMLElement {
    #charactersTyped = 0;

    constructor() {
        super();

        const shadowRoot = this.attachShadow({ mode: "open" });

        const clone = template.content.cloneNode(true);
        shadowRoot.append(clone);

        this.name = this.getAttribute("name");
        this.id = this.getAttribute("id");
        this.limit = Number(this.getAttribute("limit"));
        this.placeholder = this.getAttribute("placeholder");

        this.rows = this.getAttribute("rows");

        this.textarea = shadowRoot.querySelector("textarea");
        this.textarea.setAttribute("name", this.name);
        this.textarea.setAttribute("id", this.id);
        this.textarea.setAttribute("maxlength", this.limit);
        this.textarea.setAttribute("placeholder", this.placeholder);
        this.textarea.setAttribute("rows", this.rows);

        this.textarea.addEventListener("input", this.updateCharCount);

        this.charCount = shadowRoot.querySelector("#char-count");
        this.progressBar = shadowRoot.querySelector("#progress-bar");
    }

    updateCharCount = () => {
        this.#charactersTyped = this.textarea.value.length;
        this.displayComponent();
    };

    displayComponent = () => {
        // reset the color
        this.progressBar.classList.remove("limit");
        this.progressBar.classList.remove("warning");

        const percentageTyped = Math.round(
            (this.#charactersTyped / this.limit) * 100
        );

        this.charCount.textContent = `${this.#charactersTyped}/${this.limit}`;
        this.progressBar.value = percentageTyped;

        if (percentageTyped >= 100) {
            console.log("limit");
            this.textarea.style.outlineColor = "var(--color-limit)";
            this.charCount.style.color = "var(--color-limit)";
            this.progressBar.classList.add("limit");
        } else if (percentageTyped > 80) {
            console.log("warning");
            this.textarea.style.outlineColor = "var(--color-warning)";
            this.charCount.style.color = "var(--color-warning)";
            this.progressBar.classList.add("warning");
        } else {
            console.log("normal");
            this.textarea.style.outlineColor = "var(--color-normal)";
            this.charCount.style.color = "var(--color-normal)";
        }
    };
}

customElements.define("capped-textarea", CappedTextarea);
