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

        input {
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
        <input />
        <div class="count">
            <progress id="progress-bar" max="100" value="0"></progress>
            <span id="char-count">0/60</span>
        </div>
    </div>
`;

class CappedInput extends HTMLElement {
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

        this.input = shadowRoot.querySelector("input");
        this.input.setAttribute("name", this.name);
        this.input.setAttribute("id", this.id);
        this.input.setAttribute("maxlength", this.limit);
        this.input.setAttribute("placeholder", this.placeholder);

        this.input.addEventListener("input", this.updateCharCount);

        this.charCount = shadowRoot.querySelector("#char-count");
        this.progressBar = shadowRoot.querySelector("#progress-bar");
    }

    updateCharCount = () => {
        this.#charactersTyped = this.input.value.length;
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
            this.input.style.outlineColor = "var(--color-limit)";
            this.charCount.style.color = "var(--color-limit)";
            this.progressBar.classList.add("limit");
        } else if (percentageTyped > 80) {
            console.log("warning");
            this.input.style.outlineColor = "var(--color-warning)";
            this.charCount.style.color = "var(--color-warning)";
            this.progressBar.classList.add("warning");
        } else {
            console.log("normal");
            this.input.style.outlineColor = "var(--color-normal)";
            this.charCount.style.color = "var(--color-normal)";
        }
    };
}

customElements.define("capped-input", CappedInput);
