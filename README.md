# Demo Grafana Plugin

---
* Prerequisites
    1. Grafana: higher than 7.0.0 (For my Grafana version is 9.3.6)
    2. NodeJS:  >= 14 (16 Recommanded for Ubuntu 22.04 LTS)
    3. yarn 
* **If you NodeJS version lower than 14, you many follow next command:**
    1. Remove nodejs that you have already installed
    ```bash
    sudo apt-get remove nodejs
    ```
    2. add Node.js v16.x repositories:
    ```bash
    curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
    ```
    3. Re-install node.js
     ```bash
    sudo apt-get install nodejs
    ```
---

* Build a Demo Plugin
1. Locate the Grafana plugins folder, the ubuntu default path: `/var/lib/grafana/plugins`. If you does not find this folder, use `mkdir plugins` and update folder access premissions `sudo chmod 777 plugins`. After that, you can `cd plugins` into plugins folder.
    **The command create a demo plugin:**
    ```bash
    npx @grafana/toolkit plugin:create my-demo-plugin
    ```

2. Then `cd my-demo-plugin` into the my-demo-plugin folder.to devlopement your demo plugin
    ```bash
    yarn install
    ```
    ```bash
    yarn dev
    ```
3. Once you have done above steps, you need you to locate the `Grafana.ini` file. The default path on ubuntu: `/etc/grafana/Grafana.ini`
    **In the Grafana.ini file make sure following variable has been modified**
    1. Find plugins paths setting:
    `[paths]`
    `plugins = /var/lib/grafana/plugins`
    2. Find `allow_loading_unsigned_plugins`
    `allow_loading_unsigned_plugins = your demo plugins name`
    3. Setting app mode to development
    `app_mode = development`
4. That is All steps, now you can restart the Grafana server and check your plugin. `setting->configuration->Plugins`
    ```bash
    sudo systemctl restart grafana-server
    ```
---
You may use my demo plugins, you just copy my demo folder into the plugins folder and just finish step 4. 
1. Put the hmq-plugin folder into Grafana plugins folder
2. `cd hmq-plugin`
3. ```bash
    yarn install
   ```
4. ```bash
    yarn watch
   ```
Now You can see the plugin likes that screenshots blow:
![images](https://github.com/EJaro00/CapSP3-JaegerGrafana-Plugin/blob/Maiqi/IMG/1.png)

![images](https://github.com/EJaro00/CapSP3-JaegerGrafana-Plugin/blob/Maiqi/IMG/2.png)

---

