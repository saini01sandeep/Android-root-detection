# 🔍 Android Root Detection Monitor

This is a **Frida script** that hooks into Android system calls to help you detect when an app tries to check if the device is rooted.

It shows exactly which root detection methods are being used — like `su` commands, debug system properties, or files like `/system/xbin/su`.

Built for Android security testing and reverse engineering.

---

## 💡 What It Does

The script listens for root-checking behavior at runtime and prints it to your terminal. It can catch:

- Shell command executions like `su`
- File checks for things like `Superuser` or `busybox`
- Android system properties like `ro.debuggable`
- Build tags like `test-keys`

If any of these are triggered, it lets you know that the app is trying to detect root access — and whether it thinks the device is actually rooted.

---

## 🧰 Requirements

- [Frida](https://frida.re) installed (`pip install frida-tools`)
- A rooted device OR emulator (like Genymotion or Android Studio AVD)
- App to test already installed on the device
- USB debugging enabled or connected via TCP

---

## ▶️ How to Use

1. Start your target app on the device.
2. Run this command from your terminal:

```bash
frida -U -n <your.app.package.name> -l android_root_detect.js
frida -U -f <your.app.package.name> -l android_root_detect.js
```

##Example Output 

[RootCheck] Runtime.exec called with: su
[RootCheck] File.exists() on: /system/xbin/su => true
[RootCheck] SystemProperties.get('ro.debuggable') => 1

[!] ✅ Device appears to be ROOTED
Indicators:
   - Runtime.exec('su')
   - File.exists(/system/xbin/su)
   - SystemProperty ro.debuggable=1

##File LIST 

android_root_detect.js       # The main Frida script
README.md                    # This file
metadata.yaml                # Metadata for automation or docs
frida_config.yaml            # Optional config if you're using tools/scripts
LICENSE                      # Open source under MIT

##Tested On 

✅ Genymotion (rooted by default)
✅ Android Studio emulator (has test-keys)
✅ Physical rooted phone
✅ Non-rooted phone (will report clean)

##Disclaimer

This tool is meant for learning, testing, and authorized app analysis only.
Don’t use it against apps or systems without proper permission.

.

🧑‍💻 Author

saini01sandeep
Android Security Researcher & Frida Enthusiast

⭐️ Like It?
If this helped you, star the repo and share it with other Android testers!
