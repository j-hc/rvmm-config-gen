<script>
    export let patch;
    export let optionName;
    export let selectedOpts = {};

    let visible = false;
</script>

<div class="relative inline-block text-left">
    <button
        on:click={() => (visible = !visible)}
        class="inline-flex justify-center items-center space-x-2 border border-gray-300 rounded-md py-1 px-1 bg-white text-sm text-gray-900 hover:text-gray-600 focus:outline-none focus:border-gray-300 focus:ring-blue active:bg-gray-50 active:text-gray-800"
    >
        <span>{optionName}</span>
    </button>
    {#if visible}
        <div
            class="transition-all w-screen rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-100"
        >
            <div class="py-1">
                <p
                    class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                >
                    {#each patch.patchOptions as option}
                        <p class="font-bold">{option.description}</p>
                        <label class="items-center">
                            {option.key}:
                            <input
                                on:input={(e) => {
                                    option.value = e.target.value;
                                    option.is_selected = true;

                                    if (selectedOpts[patch.name] === undefined)
                                        selectedOpts[patch.name] = {};
                                    if (
                                        selectedOpts[patch.name][option.key] ===
                                        undefined
                                    )
                                        selectedOpts[patch.name][option.key] =
                                            [];

                                    selectedOpts[patch.name][option.key] =
                                        option.value;
                                }}
                                type="text"
                                class="border-2 rounded border-gray-300 p-0.5 w-80 mb-2"
                            />
                        </label>
                        <p />
                    {/each}
                </p>
            </div>
        </div>
    {/if}
</div>
