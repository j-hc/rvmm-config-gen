<script>
    let self;
    export let id;
</script>

<button
    bind:this={self}
    id="cbut"
    on:mouseleave={() => {
        if (self.textContent !== "Copy") self.textContent = "Copy";
    }}
    on:click={() => {
        navigator.clipboard.writeText(document.getElementById(id).innerText);
        if (self.textContent !== "Copied ✔") self.textContent = "Copied ✔";
    }}
    class="transition ease-in-out hover:-translate-y-0.5 rounded-lg border w-full
    p-3 mb-3 items-stretch bg-gray-300 border-gray-400 text-sm leading-5 font-medium
    text-gray-900 hover:text-gray-600 focus:outline-none"
    >Copy
</button>
