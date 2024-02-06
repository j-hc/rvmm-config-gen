<script>
    import DropdownOpts from "./DropdownOpts.svelte";

    export let optionName;
    export let options;
    let visible = false;

    export let selected = [];

    const selectDefault = (options) => {
        for (const e of options) {
            if (e.use) selected.push(e);
        }
    };
    $: selectDefault(options);

    const selectAllBut = () => {
        if (selectAllButName === "Deselect All") {
            selected.length = 0;
            selectAllButName = "Select Default";
        } else {
            selected.length = 0;
            selectDefault(options);
            selectAllButName = "Deselect All";
        }
    };

    let selectAllButName = "Deselect All";
    export let selectedOpts;
</script>

<div class="relative inline-block text-left">
    <button
        on:click={() => (visible = !visible)}
        class="inline-flex justify-center items-center space-x-2 border border-gray-300 rounded-md py-2 px-4 bg-white text-sm leading-5 font-medium text-gray-900 hover:text-gray-600 focus:outline-none focus:border-gray-300 focus:ring-blue active:bg-gray-50 active:text-gray-800"
    >
        <span>{optionName}</span>
    </button>
    {#if visible}
        <p>
            <button
                on:click={selectAllBut}
                class="my-4 inline-flex justify-center items-center space-x-2 border border-gray-300 rounded-md py-1 px-2 bg-white text-xs text-gray-900 hover:text-gray-600 focus:outline-none focus:border-gray-300 focus:ring-blue active:bg-gray-50 active:text-gray-800"
            >
                {selectAllButName}</button
            >
        </p>
        <div
            class="transition-all w-screen rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-100"
        >
            <div class="py-1">
                <p
                    class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                >
                    {#each options as patch}
                        <label class="items-center">
                            <input
                                type="checkbox"
                                bind:group={selected}
                                value={patch}
                            />
                            <span>
                                {patch.name}

                                {#if patch.warn !== undefined && patch.warn}
                                    <div
                                        class="border border-t-0 border-red-200 rounded-b bg-red-100 text-red-400"
                                    >
                                        Patch does not support the selected
                                        version
                                    </div>
                                {/if}

                                <p class="ml-6">
                                    {#if patch.pkg_versions.length > 0}
                                        {patch.pkg_versions.join(", ")}
                                    {:else}
                                        all
                                    {/if}
                                </p>
                            </span>
                            <p class="font-bold font-mono ml-6">
                                - {patch.description}
                            </p>
                            {#if patch.patchOptions.length > 0}
                                <p class="ml-6">
                                    <DropdownOpts
                                        optionName="options"
                                        {patch}
                                        bind:selectedOpts
                                    />
                                </p>{/if}
                            <div class="pb-2" />
                        </label>
                    {/each}
                </p>
            </div>
        </div>
    {/if}
</div>
