<script>
  import Dropdown from "./Dropdown.svelte";
  import Radio from "./Radio.svelte";

  export let pkgName;
  export let defaultPatchesJson;
  export let reprName;
  export let apkmirror_dlurl = "https://apkmirror.com/apk/";
  export let TOML;
  export let arch = "universal";

  let build_mode;
  let selected_patches = [];
  let app_name;
  let patches_json_err = null;

  $: apkmirror_dlurl = ((u) => {
    if (
      u.startsWith("https://apkmirror.com/apk/") ||
      u.startsWith("https://www.apkmirror.com/apk/") ||
      u.length === 0
    ) {
      return u;
    } else {
      return "https://apkmirror.com/apk/";
    }
  })(apkmirror_dlurl);

  let version = "auto";
  let patches_source = "revanced/revanced-patches";
  let patches_version = "latest";

  function parsePatches(pkgName, patchesJson) {
    const patches = [];
    for (const patch of patchesJson) {
      for (const pkg of Object.keys(patch.compatiblePackages || {})) {
        if (pkg !== pkgName) continue;
        const versionsSet = new Set();
        const pkgVersions = patch.compatiblePackages[pkg];
        if (pkgVersions !== null) {
          pkgVersions.forEach((e) => {
            versionsSet.add(e);
          });
        }
        const versions = [...versionsSet];
        patches.push({
          name: patch.name,
          description: patch.description,
          pkg_versions: versions,
          use: patch.use,
          patchOptions: patch.options,
        });
      }
    }
    return patches;
  }

  $: patches = defaultPatchesJson.then((j) => parsePatches(pkgName, j));

  async function checkValidVersion(version) {
    for (const p of await patches) {
      if (version === "auto" || version === "latest" || version === "beta")
        p.warn = false;
      else
        p.warn =
          p.pkg_versions.length !== 0 && !p.pkg_versions.includes(version);
    }
  }
  $: checkValidVersion(version);

  let app_name_c = "";

  let nodeRef;
  $: patches.then((patches) => {
    const inc = [];
    const exc = [];

    let exclusive;
    if (selected_patches.length > patches.length / 2) {
      exclusive = false;
      for (const p of patches) {
        const n = `'${p.name}'`;
        if (!p.use && selected_patches.includes(p)) {
          let incAddOpt = false;
          for (const [patchName, patchOpt] of Object.entries(selectedOpts)) {
            if (incAddOpt) break;
            if (patchName !== p.name) continue;
            for (const [_, value] of Object.entries(patchOpt)) {
              if (value.length > 0) {
                incAddOpt = true;
                break;
              }
            }
          }
          if (!incAddOpt) inc.push(n);
        } else if (p.use && !selected_patches.includes(p)) {
          exc.push(n);
        }
      }
    } else {
      exclusive = true;
      selected_patches.forEach((p) => {
        const n = `'${p.name}'`;
        inc.push(n);
      });
    }

    const incp = inc.join(" ");
    const excp = exc.join(" ");
    if (!app_name) app_name_c = reprName;
    else app_name_c = app_name;

    let optionsArr = [];
    let lastPatchName = null;
    for (const [patchName, patchOpt] of Object.entries(selectedOpts)) {
      for (const [key, value] of Object.entries(patchOpt)) {
        if (value.length > 0) {
          if (lastPatchName !== patchName) {
            optionsArr.push(`-e '${patchName}'`);
            lastPatchName = patchName;
          }
          optionsArr.push(`-O${key}=${value}`);
        }
      }
    }
    const options = optionsArr.join(" ");

    TOML = {
      app_name: app_name_c,
      apkmirror_dlurl: apkmirror_dlurl,
      patches_source: patches_source,
      patches_version: patches_version,
      version: version,
      build_mode: build_mode,
      arch: arch,
      included_patches: incp,
      excluded_patches: excp,
      exclusive_patches: exclusive,
      deleted: deleted,

      opts: options,
    };
  });

  let deleted = false;
  let selectedOpts = [];
</script>

<details
  bind:this={nodeRef}
  class="select-none m-3 group p-4 border-2 cursor-pointer rounded-md hover:bg-gray-50 hover:border-gray-300"
>
  <summary
    >{app_name ? app_name : reprName}

    <button
      on:click={() => {
        nodeRef.parentNode.removeChild(nodeRef);
        deleted = true;
      }}
      class="float-right w-7 h-7 rounded-full border-2 border-gray-400 text-gray-400 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-50"
      >-</button
    >
    <!-- <button
      on:click={() => {
        const cl = nodeRef.cloneNode(true);
        let i;
        if (app_name_c[app_name_c.length - 2] === "-")
          i = [app_name_c.length - 1] + 1;
        else i = 2;
        cl.querySelector("#app-name").value = app_name_c + "-" + i;
        nodeRef.parentNode.insertBefore(cl, nodeRef);
      }}
      class="mr-3 float-right w-7 h-7 rounded-full border-2 border-gray-400 text-gray-400 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-50"
      >+</button
    > -->
  </summary>
  <div
    class="select-none text-xs my-3 py-1 cursor-pointer hover:bg-gray-50 hover:border-gray-300"
  >
    <label
      >app-name:
      <input
        id="app-name"
        type="text"
        class="border-2 rounded border-gray-300 p-0.5 w-full"
        placeholder={reprName === pkgName
          ? "Fill in app-name and apkmirror-dlurl"
          : reprName}
        bind:value={app_name}
      />
    </label>
    <hr class="my-3 border-t border-gray-300" />

    <label
      >apkmirror-dlurl:
      <input
        type="text"
        class="border-2 rounded border-gray-300 p-0.5 pl-1 w-full"
        size="60"
        bind:value={apkmirror_dlurl}
      />
    </label>

    <hr class="my-3 border-t border-gray-300" />
    <Radio
      optionName={"version"}
      options={["auto", "latest", "beta"]}
      bind:selected={version}
    />

    <label>
      custom:
      <input
        type="text"
        class="border-2 rounded border-gray-300 p-0.5 w-20"
        bind:value={version}
        placeholder="18.19.35"
      />
    </label>

    <hr class="my-3 border-t border-gray-300" />

    <Radio
      optionName={"build-mode"}
      options={["apk", "both", "module"]}
      bind:selected={build_mode}
    />
    <hr class="my-3 border-t border-gray-300" />

    <Radio
      optionName={"apkmirror arch"}
      options={["universal", "arm64-v8a", "arm-v7a", "both"]}
      bind:selected={arch}
    />
    <hr class="my-3 border-t border-gray-300" />

    <label
      >patches source:
      <input
        id="patches-source"
        type="text"
        class="border-2 rounded border-gray-300 p-0.5 pl-1 w-full"
        size="60"
        bind:value={patches_source}
      />
    </label>

    <label
      >patches version:
      <input
        id="patches-version"
        type="text"
        class="border-2 rounded border-gray-300 p-0.5 pl-1 w-full"
        size="60"
        bind:value={patches_version}
      />
    </label>

    {#if patches_json_err}
      <div
        class="border border-t-0 border-red-200 rounded-b bg-red-100 text-red-400"
      >
        {patches_json_err}
      </div>
    {/if}

    {#await patches then patches}
      <hr class="my-3 border-t border-gray-300" />
      <Dropdown
        optionName={"patches"}
        options={patches}
        bind:selected={selected_patches}
        bind:selectedOpts
      />
    {:catch error}
      <div
        class="border border-t-0 border-red-200 rounded-b bg-red-100 text-red-400"
      >
        Could not fetch patches
      </div>
    {/await}
  </div>
</details>
