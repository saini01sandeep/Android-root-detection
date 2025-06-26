Java.perform(function () {
    console.log("\n" +
    "╔═══════════════════════════════════════════════════════════════════════╗\n" +
    "║     🔍 ROOT DETECTION MONITOR - CREATED BY SAINI01SANDEEP (GitHub) 🔍    ║\n" +
    "╚═══════════════════════════════════════════════════════════════════════╝\n"
);


    var isRooted = false;
    var rootIndicators = [];

    // 1. Runtime.exec() checks (e.g., "su")
    var Runtime = Java.use("java.lang.Runtime");
    Runtime.exec.overload('java.lang.String').implementation = function (cmd) {
        if (cmd.includes("su")) {
            isRooted = true;
            rootIndicators.push("Runtime.exec('su')");
        }
        console.log("[RootCheck] Runtime.exec called with: " + cmd);
        return this.exec(cmd);
    };

    Runtime.exec.overload('[Ljava.lang.String;').implementation = function (cmd_array) {
        var cmd_str = cmd_array.join(" ");
        if (cmd_str.includes("su")) {
            isRooted = true;
            rootIndicators.push("Runtime.exec(String[]: 'su')");
        }
        console.log("[RootCheck] Runtime.exec(String[]) called with: " + cmd_str);
        return this.exec(cmd_array);
    };

    // 2. ProcessBuilder check
    var ProcessBuilder = Java.use("java.lang.ProcessBuilder");
    ProcessBuilder.$init.overload('[Ljava.lang.String;').implementation = function (args) {
        var cmd_str = args.join(" ");
        if (cmd_str.includes("su")) {
            isRooted = true;
            rootIndicators.push("ProcessBuilder('su')");
        }
        console.log("[RootCheck] ProcessBuilder started with: " + cmd_str);
        return this.$init(args);
    };

    // 3. Check the suspicious file paths
    var File = Java.use("java.io.File");
    File.exists.implementation = function () {
        var path = this.getAbsolutePath();
        var result = this.exists();
        if (path.includes("su") || path.includes("Superuser") || path.includes("busybox")) {
            console.log("[RootCheck] File.exists() on: " + path + " => " + result);
            if (result) {
                isRooted = true;
                rootIndicators.push("File.exists(" + path + ")");
            }
        }
        return result;
    };

    // 4. SystemProperties (like ro.debuggable)
    var SystemProperties = Java.use("android.os.SystemProperties");
    SystemProperties.get.overload('java.lang.String').implementation = function (key) {
        var value = this.get(key);
        if (key === "ro.debuggable" && value === "1") {
            isRooted = true;
            rootIndicators.push("SystemProperty ro.debuggable=1");
        }
        console.log("[RootCheck] SystemProperties.get('" + key + "') => " + value);
        return value;
    };

    // 5. Build.TAGS check
    var Build = Java.use("android.os.Build");
    var tags = Build.TAGS.value;
    console.log("[Info] Build.TAGS = " + tags);
    if (tags && (tags.includes("test-keys") || tags.includes("dev-keys"))) {
        isRooted = true;
        rootIndicators.push("Build.TAGS = " + tags);
    }

    // Delay final root check message
    setTimeout(function () {
        console.log("----- Root Detection Monitor Hooked Successfully (by saini01sandeep) -----\n");
        if (isRooted) {
            console.log("[!] ✅ Device appears to be ROOTED");
            console.log("Indicators:");
            rootIndicators.forEach(function (item) {
                console.log("   - " + item);
            });
        } else {
            console.log("[✓] ❌ Device does NOT appear to be rooted");
        }
    }, 1000);
});
