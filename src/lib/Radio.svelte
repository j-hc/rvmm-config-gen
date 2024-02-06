<script>
    export let optionName;
    export let options;
    
    export let selected = "apk";
    
    let visible = false;
</script>

<div class="relative inline-block text-left">
    <button
        on:click={() => (visible = !visible)}
        class="inline-flex justify-center items-center space-x-2 border border-gray-300 rounded-md py-2 px-4 bg-white text-sm leading-5 font-medium text-gray-900 hover:text-gray-600 focus:outline-none focus:border-gray-300 focus:ring-blue active:bg-gray-50 active:text-gray-800"
    >
        <span>{optionName}</span>
    </button>
    {#if visible}
        <div
            class="transition-all mt-2 w-screen rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-100"
        >
            <div class="py-1">
                <p
                    class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                >
                    {#each options as option}
                        <label class="items-center pr-1">
                            <input type="radio" bind:group={selected} value={option} />
                            {option}
                        </label>
                    {/each}
                </p>
            </div>
        </div>
    {/if}
</div>
