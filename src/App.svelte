<script>
  import CopyBut from "./lib/CopyBut.svelte";
  import RVApp from "./lib/RVApp.svelte";

  function getPkgs(patchesJson) {
    const supportedAppsSet = new Set();
    for (const patch of patchesJson) {
      if (patch.compatiblePackages !== null) {
        Object.keys(patch.compatiblePackages).forEach((p) =>
          supportedAppsSet.add(p),
        );
      }
    }
    const supportedApps = [...supportedAppsSet];
    supportedApps.sort((a, b) => {
      const isPkgA = PKG_APPNAME[a] !== undefined;
      const isPkgB = PKG_APPNAME[b] !== undefined;

      if (isPkgA && isPkgB) return 0;
      else if (isPkgA) return -1;
      else if (isPkgB) return 1;
    });

    return supportedApps;
  }

  const PKG_APPNAME = {
    "com.google.android.youtube": "YouTube",
    "tv.twitch.android.app": "Twitch",
    "com.twitter.android": "Twitter",
    "com.laurencedawson.reddit_sync": "Sync",
    "com.laurencedawson.reddit_sync.pro": "Sync Pro",

    "com.google.android.apps.youtube.music": "Music",
    "com.rubenmayayo.reddit": "Boost",
    "com.zhiliaoapp.musically": "Tiktok",
    "com.reddit.frontpage": "Reddit",
    "com.facebook.orca": "Messenger",
    "com.instagram.android": "Instagram",
  };

  function getReprName(pkgName) {
    if (PKG_APPNAME[pkgName] !== undefined) return PKG_APPNAME[pkgName];
    else return pkgName;
  }

  const PKG_APKMIRROR = {
    "com.google.android.youtube":
      "https://apkmirror.com/apk/google-inc/youtube/",
    "tv.twitch.android.app":
      "https://apkmirror.com/apk/twitch-interactive-inc/twitch/",
    "com.twitter.android": "https://apkmirror.com/apk/twitter-inc/twitter/",
    "com.google.android.apps.youtube.music":
      "https://apkmirror.com/apk/google-inc/youtube-music/",
    "com.zhiliaoapp.musically":
      "https://apkmirror.com/apk/tiktok-pte-ltd/tik-tok-including-musical-ly/",
    "com.reddit.frontpage": "https://apkmirror.com/apk/redditinc/reddit/",
    "com.facebook.orca": "https://apkmirror.com/apk/facebook-2/messenger/",
    "com.instagram.android":
      "https://apkmirror.com/apk/instagram/instagram-instagram/",
  };
  function getApkmirror(pkgName) {
    if (PKG_APKMIRROR[pkgName] !== undefined) return PKG_APKMIRROR[pkgName];
    else return undefined;
  }

  let TOML = [];
  let configTOMLVisible = false;

  let patchesGenTextVisible = false;

  let defaultPatchesJson = fetch("patches.json")
    .then((r) => r.json())
    .then((r) => r.patches || r);
</script>

<main>
  <p class="m-4">RVMM Config Generator</p>
  <div class="inline-flex">
    <a href="https://t.me/rvc_magisk" target="_blank" rel="noreferrer noopener">
      <svg class="m-4" width="2rem" height="auto" viewBox="0 0 16 16">
        <path
          d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8.287 5.906c-.778.324-2.334.994-4.666 2.01-.378.15-.577.298-.595.442-.03.243.275.339.69.47l.175.055c.408.133.958.288 1.243.294.26.006.549-.1.868-.32 2.179-1.471 3.304-2.214 3.374-2.23.05-.012.12-.026.166.016.047.041.042.12.037.141-.03.129-1.227 1.241-1.846 1.817-.193.18-.33.307-.358.336a8.154 8.154 0 0 1-.188.186c-.38.366-.664.64.015 1.088.327.216.589.393.85.571.284.194.568.387.936.629.093.06.183.125.27.187.331.236.63.448.997.414.214-.02.435-.22.547-.82.265-1.417.786-4.486.906-5.751a1.426 1.426 0 0 0-.013-.315.337.337 0 0 0-.114-.217.526.526 0 0 0-.31-.093c-.3.005-.763.166-2.984 1.09z"
        />
      </svg>
    </a>

    <a
      href="https://github.com/j-hc/revanced-magisk-module"
      target="_blank"
      rel="noreferrer noopener"
    >
      <svg class="m-4" width="2rem" height="auto" viewBox="0 0 16 16">
        <path
          d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"
        />
      </svg>
    </a>
  </div>
  <br />

  {#if patchesGenTextVisible}
  <div class="m-3 mb-5 text-xs justify-center items-center space-x-2 border border-gray-300 rounded-md py-2 px-4 bg-white font-medium text-gray">
  If you don't have a patches.json for a custom bundle of revanced-patches, you can use 
  <a class="underline" href="https://github.com/j-hc/rvmm-config-gen/raw/refs/heads/master/patches-json-gen.jar">patches-json-gen.jar</a>
  : <code>java -jar patches-json-gen.jar patches.rvp patches.json</code>
  </div>
  {/if}

  <div class="flex justify-between">
    <button
      on:click={() => {
        configTOMLVisible = !configTOMLVisible;
      }}
      class="m-3 mb-5 justify-center items-center space-x-2 border border-gray-300 rounded-md py-2 px-4 bg-white text-sm leading-5 font-medium text-gray-900 hover:text-gray-600 focus:outline-none focus:border-gray-300 focus:ring-blue active:bg-gray-50 active:text-gray-800"
      >{configTOMLVisible ? "Hide Config" : "Create Config"}</button
    >
    <label
      for="files"
      class="m-3 mb-5 text-xs justify-center items-center space-x-2 border border-gray-300 rounded-md py-2 px-4 bg-white font-medium text-gray-900 hover:text-gray-600 focus:outline-none focus:border-gray-300 focus:ring-blue active:bg-gray-50 active:text-gray-800 ml-auto"
      >Upload patches.json</label
    >
    <input
      on:click={() => patchesGenTextVisible = true }
      on:change={(e) => {
        var file = e.target.files[0];
        var r = new FileReader();
        r.readAsText(file);
        r.onload = (re) => {
          const j = JSON.parse(re.target.result);
          defaultPatchesJson = Promise.resolve(j.patches || j);
          TOML = [];
        };
      }}
      id="files"
      class="hidden"
      type="file"
    />
  </div>
  {#if configTOMLVisible}
    <div
      class="bg-gray-300 rounded-lg mx-4 my-0 border border-gray-400 p-4 text-sm"
    >
      <CopyBut id={"config-toml-text"} />

      <div class="text-gray-600"># config.toml</div>
      <div id="config-toml-text">
        {#each TOML as t}
          {#if !t.deleted && t.apkmirror_dlurl !== "https://apkmirror.com/apk/" && t.apkmirror_dlurl.length !== 0}
            [{t.app_name}]<br />
            apkmirror-dlurl = "{t.apkmirror_dlurl}"<br />
            {#if t.patches_source !== "revanced/revanced-patches"}
              patches-source = "{t.patches_source}"<br />
              integrations-source = "{t.patches_source.split(
                "/",
              )[0]}/revanced-integrations"<br />
              rv-brand = "{t.patches_source.split("/")[0]} ReVanced"<br />
            {/if}
            {#if t.patches_version !== "latest"}
              patches-version = "{t.patches_version}"<br />
            {/if}
            {#if t.arch !== "universal"}
              arch = "{t.arch}"<br />
            {/if}
            {#if t.build_mode !== "apk"}
              build-mode = "{t.build_mode}"<br />
            {/if}
            {#if t.version !== "auto"}
              version = "{t.version}"<br />
            {/if}
            {#if t.included_patches !== ""}
              included-patches = "{t.included_patches}"<br />
            {/if}
            {#if t.excluded_patches !== ""}
              excluded-patches = "{t.excluded_patches}"<br />
            {/if}
            {#if t.exclusive_patches}
              exclusive-patches = {t.exclusive_patches}<br />
            {/if}
            {#if t.opts.length > 0}
              patcher-args = "{t.opts}"<br />
            {/if}
            <br />
          {/if}
        {/each}
      </div>
    </div>
  {/if}

  {#await defaultPatchesJson.then((j) => getPkgs(j)) then pkgs}
    {#each pkgs as pkgName, i}
      <RVApp
        {pkgName}
        {defaultPatchesJson}
        reprName={getReprName(pkgName)}
        apkmirror_dlurl={getApkmirror(pkgName)}
        bind:TOML={TOML[i]}
      />
    {/each}
  {/await}
</main>

<style>
</style>
